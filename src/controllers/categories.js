import { getAllCategories, getCategoryById, getProjectsByCategoryId, updateCategoryAssignments } from '../models/categories.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';

export const showCategoriesPage = async (req, res) => {
    try {
        const categories = await getAllCategories();
        res.render('categories', { 
            title: 'Service Project Categories', 
            categories 
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const showCategoryDetailsPage = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryById(categoryId);
        
        if (!category) {
            return res.status(404).render('errors/404', { title: 'Category Not Found' });
        }
        
        const projects = await getProjectsByCategoryId(categoryId);
        
        res.render('category', {
            title: category.name,
            category,
            projects
        });
    } catch (error) {
        console.error('Error fetching category details:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const showAssignCategoriesForm = async (req, res) => {
    try {
        const projectId = req.params.projectId;

        const projectDetails = await getProjectDetails(projectId);

        if (!projectDetails) {
            return res.status(404).render('errors/404', { title: 'Project Not Found' });
        }

        const categories = await getAllCategories();
        const assignedCategories = await getCategoriesByProjectId(projectId);

        const title = 'Assign Categories to Project';

        res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
    } catch (error) {
        console.error('Error loading assign categories form:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const processAssignCategoriesForm = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const selectedCategoryIds = req.body.categoryIds || [];

        // Ensure selectedCategoryIds is an array
        const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];

        await updateCategoryAssignments(projectId, categoryIdsArray);

        req.flash('success', 'Categories updated successfully.');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error updating category assignments:', error);
        req.flash('error', 'There was an error updating the categories.');
        res.redirect(`/assign-categories/${req.params.projectId}`);
    }
};