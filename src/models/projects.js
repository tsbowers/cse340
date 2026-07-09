// src/models/projects.js
import pool from './db.js';
export async function getAllProjects() {
    const queryText = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.project_location,
            p.project_date,
            o.name AS organization_name
        FROM service_project p
        JOIN organization o ON p.organization_id = o.organization_id
        ORDER BY p.project_date ASC;
    `;
    const { rows } = await pool.query(queryText);
    return rows;
}