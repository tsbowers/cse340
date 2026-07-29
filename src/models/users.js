import { pool } from './db.js';
import bcrypt from 'bcrypt';

/**
 * Inserts a new user into the database, assigning them the default "user" role.
 * @param {string} name - The user's display name.
 * @param {string} email - The user's email address (used as username).
 * @param {string} passwordHash - The bcrypt-hashed password.
 * @returns {number} The id of the newly created user record.
 */
const createUser = async (name, email, passwordHash) => {
    const default_role = 'user';
    const query = `
        INSERT INTO users (name, email, password_hash, role_id) 
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4)) 
        RETURNING user_id
    `;
    const queryParams = [name, email, passwordHash, default_role];

    const result = await pool.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new user with ID:', result.rows[0].user_id);
    }

    return result.rows[0].user_id;
};

/**
 * Looks up a user by their email address.
 * @param {string} email - The email address to search for.
 * @returns {object|null} The user record, or null if no match is found.
 */
const findUserByEmail = async (email) => {
    const query = `
        SELECT u.user_id, u.name, u.email, u.password_hash, r.role_name 
        FROM users u
        JOIN roles r ON u.role_id = r.role_id
        WHERE u.email = $1
    `;
    const queryParams = [email];

    const result = await pool.query(query, queryParams);

    if (result.rows.length === 0) {
        return null; // User not found
    }

    return result.rows[0];
};

/**
 * Compares a plain text password against a bcrypt hash.
 * @param {string} password - The plain text password to check.
 * @param {string} passwordHash - The stored bcrypt hash to compare against.
 * @returns {boolean} True if the password matches the hash, false otherwise.
 */
const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

/**
 * Authenticates a user by email and password.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's plain text password.
 * @returns {object|null} The user object (without password_hash) if authentication
 * succeeds, or null if the user isn't found or the password doesn't match.
 */
const authenticateUser = async (email, password) => {
    const user = await findUserByEmail(email);

    if (!user) {
        return null;
    }

    const passwordMatches = await verifyPassword(password, user.password_hash);

    if (!passwordMatches) {
        return null;
    }

    // Don't carry the password hash beyond this point
    const { password_hash, ...safeUser } = user;

    return safeUser;
};

export { createUser, authenticateUser };