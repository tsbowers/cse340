import { pool } from './db.js';

/**
 * Signs a user up to volunteer for a project.
 * Uses ON CONFLICT DO NOTHING so re-clicking "volunteer" isn't an error
 * if the user has already signed up for this project.
 * @param {number|string} userId
 * @param {number|string} projectId
 */
export async function addVolunteer(userId, projectId) {
    const queryText = `
        INSERT INTO volunteer (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, project_id) DO NOTHING
        RETURNING user_id, project_id;
    `;
    const { rows } = await pool.query(queryText, [userId, projectId]);
    return rows[0] || null;
}

/**
 * Removes a user's volunteer signup for a project.
 * @param {number|string} userId
 * @param {number|string} projectId
 */
export async function removeVolunteer(userId, projectId) {
    const queryText = `
        DELETE FROM volunteer
        WHERE user_id = $1 AND project_id = $2;
    `;
    await pool.query(queryText, [userId, projectId]);
}

/**
 * Checks whether a user is currently volunteering for a project.
 * @param {number|string} userId
 * @param {number|string} projectId
 * @returns {boolean}
 */
export async function isVolunteering(userId, projectId) {
    const queryText = `
        SELECT 1 FROM volunteer WHERE user_id = $1 AND project_id = $2;
    `;
    const { rows } = await pool.query(queryText, [userId, projectId]);
    return rows.length > 0;
}

/**
 * Retrieves all projects a given user has signed up to volunteer for.
 * @param {number|string} userId
 */
export async function getVolunteerProjectsByUserId(userId) {
    const queryText = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location AS project_location,
            p.date AS project_date,
            p.organization_id,
            o.name AS organization_name
        FROM volunteer v
        JOIN project p ON v.project_id = p.project_id
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE v.user_id = $1
        ORDER BY p.date ASC;
    `;
    const { rows } = await pool.query(queryText, [userId]);
    return rows;
}