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

/**
 * Inserts a new service project into the database.
 * @param {string} title - The title of the project.
 * @param {string} description - A description of the project.
 * @param {string} location - The location of the project.
 * @param {string} date - The date of the project.
 * @param {number|string} organizationId - The id of the organization hosting the project.
 * @returns {number} The id of the newly created project record.
 */
export async function createProject(title, description, location, date, organizationId) {
    const queryText = `
        INSERT INTO project (title, description, location, date, organization_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId];
    const result = await pool.query(queryText, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
}

/**
 * Updates an existing service project in the database.
 * @param {number|string} id - The id of the project to update.
 * @param {string} title - The title of the project.
 * @param {string} description - A description of the project.
 * @param {string} location - The location of the project.
 * @param {string} date - The date of the project.
 * @param {number|string} organizationId - The id of the organization hosting the project.
 * @returns {number} The id of the updated project record.
 */
export async function updateProject(id, title, description, location, date, organizationId) {
    const queryText = `
        UPDATE project
        SET title = $1,
            description = $2,
            location = $3,
            date = $4,
            organization_id = $5
        WHERE project_id = $6
        RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId, id];
    const result = await pool.query(queryText, queryParams);

    if (result.rows.length === 0) {
        throw new Error(`Failed to update project with id ${id}`);
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Updated project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
}