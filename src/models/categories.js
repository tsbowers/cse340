import { pool } from './db.js';

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
        SELECT p.project_id, p.organization_id, p.title, p.description, 
               p.location AS project_location, p.date AS project_date 
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

/**
 * Assigns a single category to a project by inserting a row into the
 * project_category many-to-many join table. Not exported since it's
 * only used internally by updateCategoryAssignments.
 */
async function assignCategoryToProject(categoryId, projectId) {
    const queryText = `
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2);`;
    try {
        await pool.query(queryText, [categoryId, projectId]);
    } catch (err) {
        console.error('Error executing query to assign category to project:', err);
        throw err;
    }
}

/**
 * Replaces the full set of categories assigned to a project.
 * Removes all existing assignments for the project, then re-creates
 * an assignment for each category ID in the provided array.
 * @param {number|string} projectId
 * @param {Array<number|string>} categoryIds
 */
export async function updateCategoryAssignments(projectId, categoryIds) {
    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;`;
    try {
        await pool.query(deleteQuery, [projectId]);

        for (const categoryId of categoryIds) {
            await assignCategoryToProject(categoryId, projectId);
        }
    } catch (err) {
        console.error('Error executing query to update category assignments:', err);
        throw err;
    }
}