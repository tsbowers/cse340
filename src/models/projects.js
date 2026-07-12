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
          location,
          date
        FROM project
        WHERE organization_id = $1
        ORDER BY date;
      `;
      
      const queryParams = [organizationId];
      const result = await db.query(query, queryParams);

      return result.rows;
};
// Export the model functions
export { getAllProjects, getProjectsByOrganizationId };