import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { testConnection } from './src/models/db.js';
import { getAllOrganizations } from './src/models/organizations.js';
import { getAllProjects } from './src/models/projects.js';
import { getAllCategories } from './src/models/categories.js';

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/**
 * Configure Express middleware
 */
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

/**
 * Routes
 */
app.get('/', async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
});

app.get('/organizations', async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';
    res.render('organizations', { title, organizations });
});

// 2. Updated /projects Route
app.get('/projects', async (req, res) => {
    try {
        const title = 'Service Projects';
        const projects = await getAllProjects(); // Fetch projects from database
        
        // Pass both title and projects to the view
        res.render('projects', { title, projects }); 
    } catch (error) {
        console.error('Error loading projects page:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get("/categories", async (req, res) => {
    try {
        const title = "Service Categories";
        const categories = await getAllCategories(); // Fetch categories from database
        
        // Pass title and the categories array to your view
        res.render("categories", { title, categories });
    } catch (error) {
        console.error('Error loading categories page:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, async () => {
    try {
        await testConnection();
        console.log(`Server is running at http://127.0.0.1:${PORT}`);
        console.log(`Environment: ${NODE_ENV}`);
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
});