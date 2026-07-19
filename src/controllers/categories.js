import { getAllCategories, getCategoryById, getProjectsByCategoryId } from '../models/categories.js';

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