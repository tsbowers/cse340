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

export async function getCategoryById(category_id) {
    const queryText = 'SELECT category_id, name FROM category WHERE category_id = $1;';
    try {
        const res = await pool.query(queryText, [category_id]);
        return res.rows[0];
    } catch (err) {
        console.error('Error executing query to fetch category by ID:', err);
        throw err;
    }
}

export async function getCategoriesByProjectId(project_id) {
    const queryText = `
        SELECT c.category_id, c.name 
        FROM category c
        JOIN project_category pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name ASC;`;
    try {
        const res = await pool.query(queryText, [project_id]);
        return res.rows;
    } catch (err) {
        console.error('Error executing query to fetch categories by project ID:', err);
        throw err;
    }
}

export async function getProjectsByCategoryId(category_id) {
    const queryText = `
        SELECT p.project_id, p.organization_id, p.title, p.description, p.location, p.date 
        FROM project p
        JOIN project_category pc ON p.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.date ASC;`;
    try {
        const res = await pool.query(queryText, [category_id]);
        return res.rows;
    } catch (err) {
        console.error('Error executing query to fetch projects by category ID:', err);
        throw err;
    }
}