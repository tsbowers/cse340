import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res) => {
    try {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        const title = 'Upcoming Service Projects'; 

        res.render('projects', { title, projects });
    } catch (error) {
        console.error('Error fetching upcoming projects:', error);
        res.status(500).send('Internal Server Error');
    }
};  

const showProjectDetailsPage = async (req, res) => {
    try {
        const projectId = req.params.id; 
        
        const project = await getProjectDetails(projectId);
        
        if (!project) {
            return res.status(404).render('errors/404', { title: 'Project Not Found' });
        }
        
        const categories = await getCategoriesByProjectId(projectId);
        
        res.render('project', { 
            title: project.title, 
            project,
            categories // Passed to the view to generate tags dynamically
        });
    } catch (error) {
        console.error('Error fetching project details:', error);
        res.status(500).send('Internal Server Error');
    }
};

export { showProjectsPage, showProjectDetailsPage };