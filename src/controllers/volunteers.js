import { addVolunteer, removeVolunteer } from '../models/volunteers.js';

/**
 * Signs the logged-in user up to volunteer for a project.
 * Route is protected by requireLogin, so req.session.user is guaranteed to exist.
 */
const processAddVolunteer = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;

    try {
        await addVolunteer(userId, projectId);
        req.flash('success', 'You have successfully signed up to volunteer!');
    } catch (error) {
        console.error('Error adding volunteer:', error);
        req.flash('error', 'There was an error signing you up to volunteer.');
    }

    res.redirect(`/project/${projectId}`);
};

/**
 * Removes the logged-in user as a volunteer for a project.
 * Accepts an optional "returnTo" field in the request body so this route can
 * be triggered from either the project details page or the dashboard and
 * send the user back to the right place afterward.
 */
const processRemoveVolunteer = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;
    const returnTo = req.body.returnTo || `/project/${projectId}`;

    try {
        await removeVolunteer(userId, projectId);
        req.flash('success', 'You have been removed as a volunteer.');
    } catch (error) {
        console.error('Error removing volunteer:', error);
        req.flash('error', 'There was an error removing you as a volunteer.');
    }

    res.redirect(returnTo);
};

export { processAddVolunteer, processRemoveVolunteer };