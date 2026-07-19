// src/models/projects.js
import { pool } from './db.js';

export async function getAllProjects() {
    const queryText = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.location AS project_location,
            p.date AS project_date,
            o.name AS organization_name
        FROM project p
        JOIN organization o ON p.organization_id = o.organization_id
        ORDER BY p.date ASC;
    `;
    const { rows } = await pool.query(queryText);
    return rows;
}

const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
            project_id,
            organization_id,
            title,
            description,
            location AS project_location,
            date AS project_date
        FROM project
        WHERE organization_id = $1
        ORDER BY date;
    `;
      
    const queryParams = [organizationId];
    const result = await pool.query(query, queryParams);

    return result.rows;
};

/**
 * Retrieves the next N upcoming service projects from today onward
 * @param {number} number_of_projects 
 */
export async function getUpcomingProjects(number_of_projects) {
    const queryText = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.location AS project_location,
            p.date AS project_date,
            p.organization_id,
            o.name AS organization_name
        FROM project p
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE p.date >= CURRENT_DATE
        ORDER BY p.date ASC
        LIMIT $1;
    `;
    const { rows } = await pool.query(queryText, [number_of_projects]);
    return rows;
}

/**
 * Retrieves a single service project details by ID
 * @param {number|string} id 
 */
export async function getProjectDetails(id) {
    const queryText = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.location AS project_location,
            p.date AS project_date,
            p.organization_id,
            o.name AS organization_name
        FROM project p
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;
    const { rows } = await pool.query(queryText, [id]);
    return rows[0] || null;
}

export { 
    getProjectsByOrganizationId 
};