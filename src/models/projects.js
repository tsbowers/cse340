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

const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
            project_id,
            organization_id,
            title,
            description,
            project_location,
            project_date
        FROM service_project
        WHERE organization_id = $1
        ORDER BY project_date;
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
            p.project_location,
            p.project_date,
            p.organization_id,
            o.name AS organization_name
        FROM service_project p
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE p.project_date >= CURRENT_DATE
        ORDER BY p.project_date ASC
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
            p.project_location,
            p.project_date,
            p.organization_id,
            o.name AS organization_name
        FROM service_project p
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;
    const { rows } = await pool.query(queryText, [id]);
    return rows[0] || null;
}

// Export the model functions (using ES Module syntax)
export { 
    getProjectsByOrganizationId 
};