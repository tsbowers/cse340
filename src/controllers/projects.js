// src/controllers/projects.js

// Import the new model functions alongside your existing ones
import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';

// Define the constant for the number of projects to retrieve
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Update the showProjectsPage function to use getUpcomingProjects
const showProjectsPage = async (req, res) => {
    try {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        const title = 'Upcoming Service Projects'; // Updated title

        res.render('projects', { title, projects });
    } catch (error) {
        console.error('Error fetching upcoming projects:', error);
        res.status(500).send('Internal Server Error');
    }
};  

// Create the new showProjectDetailsPage controller
const showProjectDetailsPage = async (req, res) => {
    try {
        // Extract the ID from the URL parameters (e.g., /project/3 -> req.params.id is 3)
        const projectId = req.params.id; 
        
        // Retrieve the service project by its ID
        const project = await getProjectDetails(projectId);
        
        // If no project is returned, render a 404 error
        if (!project) {
            return res.status(404).render('errors/404', { title: 'Project Not Found' });
        }
        
        // Render the new individual project details view (project.ejs)
        res.render('project', { 
            title: project.title, 
            project 
        });
    } catch (error) {
        console.error('Error fetching project details:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Export your controller functions
export { showProjectsPage, showProjectDetailsPage };