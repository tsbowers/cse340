import pool from './db.js';


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