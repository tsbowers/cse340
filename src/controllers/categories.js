import {
    getAllCategories,
    getCategoryById,
    getProjectsByCategoryId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
} from '../models/categories.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

// Define validation and sanitization rules for the category form
export const categoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ min: 3, max: 100 }).withMessage('Category name must be between 3 and 100 characters')
];

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

export const showNewCategoryForm = async (req, res) => {
    res.render('new-category', { title: 'Add New Category' });
};

export const processNewCategoryForm = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new category form
        return res.redirect('/new-category');
    }

    const { name } = req.body;

    try {
        const newCategoryId = await createCategory(name);

        req.flash('success', 'New category created successfully!');
        res.redirect(`/category/${newCategoryId}`);
    } catch (error) {
        console.error('Error creating new category:', error);
        req.flash('error', 'There was an error creating the category.');
        res.redirect('/new-category');
    }
};

export const showEditCategoryForm = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryById(categoryId);

        if (!category) {
            return res.status(404).render('errors/404', { title: 'Category Not Found' });
        }

        res.render('edit-category', { title: 'Edit Category', category });
    } catch (error) {
        console.error('Error loading edit category form:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const processEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the edit category form
        return res.redirect(`/edit-category/${categoryId}`);
    }

    const { name } = req.body;

    try {
        await updateCategory(categoryId, name);

        req.flash('success', 'Category updated successfully!');
        res.redirect(`/category/${categoryId}`);
    } catch (error) {
        console.error('Error updating category:', error);
        req.flash('error', 'There was an error updating the category.');
        res.redirect(`/edit-category/${categoryId}`);
    }
};