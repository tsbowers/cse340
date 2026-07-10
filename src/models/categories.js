// src/models/categories.js
import { pool } from './db.js'; // Adjust if your pool export is named differently in db.js

/**
 * Retrieves all categories from the database sorted alphabetically.
 */
export async function getAllCategories() {
    const queryText = 'SELECT category_id, name FROM category ORDER BY name ASC;';
    try {
        const res = await pool.query(queryText);
        return res.rows;
    } catch (err) {
        console.error('Error executing query to fetch categories:', err);
        throw err;
    }
}