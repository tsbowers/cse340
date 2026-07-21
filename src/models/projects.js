// src/models/projects.js
import { pool } from './db.js';

/**
 * Retrieves all projects from the database
 */
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

/**
 * Retrieves projects belonging to a specific organization
 * @param {number|string} organizationId 
 */
export async function getProjectsByOrganizationId(organizationId) {
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
}

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

/**
 * Retrieves all categories associated with a given service project
 * Required for displaying category tags on the project details page
 * @param {number|string} projectId 
 */
export async function getCategoriesByProjectId(projectId) {
    const queryText = `
        SELECT 
            c.category_id,
            c.name
        FROM category c
        JOIN project_category pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name ASC;
    `;
    const { rows } = await pool.query(queryText, [projectId]);
    return rows;
}