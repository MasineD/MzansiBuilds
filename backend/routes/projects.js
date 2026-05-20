import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import protect from '../middleware/auth.js';   //Imports the protect middleware function from the auth.js file in the middleware directory. This middleware is used to protect certain routes by verifying the JWT token sent in the request cookies.

const router = express.Router();        //Create a router object using Express, which allows us to define routes for user authentication (registration and login) in a modular way. This router will be exported and used in the main server file to handle authentication-related requests.

// TODO: Protect all the routes, and send the user_id with the request, so that we can associate the projects with the user who created them. This will allow us to implement user-specific project management in the future.

const cookieOptions = {
    httpOnly: true,        //Ensures that the cookie cannot be accessed via client-side JavaScript, providing protection against cross-site scripting (XSS) attacks.
    secure: process.env.NODE_ENV === 'production', //Ensures that the cookie is only sent over HTTPS connections in production environments, enhancing security.
    sameSite: 'strict',   //Prevents the browser from sending the cookie along with cross-site requests, providing protection against cross-site request forgery (CSRF) attacks.
    maxAge: 30 * 24 * 60 * 60 * 1000 //Sets the cookie to expire after 30 days, which is a common duration for session cookies.
};
// function to generate JWT token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET,
        { expiresIn: '30d' }); //Generates a JSON Web Token (JWT) that includes the user's ID and username as payload. The token is signed using a secret key from the environment variables and is set to expire in 30 days.
};
// Route to create a new project (protected route)
// Route to create a new project (protected route)
router.post("/projects", protect, async (req, res) => {  // Add protect middleware
    try{
        // Get user_id from the authenticated user (added by protect middleware)
        const user_id = req.user.id;  // This comes from the decoded JWT token
        
        const { title, description, startDate, endDate, projectUrl, completed } = req.body;
        
        if(!title || !description || !startDate || !endDate ){
            return res.status(400).json({msg: "All fields are required to create a project"});
        }
        
        const start = new Date(startDate);
        const end = new Date(endDate);
        if(start > end){
            return res.status(400).json({msg: "Start date cannot be after end date"});
        }
        
        // Fix the SQL query - there was a missing comma after user_id
        const newProject = await pool.query(
            "INSERT INTO projects (user_id, title, description, startDate, endDate, projectUrl, completed) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [user_id, title, description, startDate, endDate, projectUrl, completed || false]
        );
        
        res.json(newProject.rows[0]);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Error occurred trying to CREATE a project");
    }
});
// TODO: Uncomment the commented line in PostgreSQL 
// Fetching all projects
// Fetching all projects for the authenticated user
router.get("/projects", protect, async (req, res) => {
    try{
        const user_id = req.user.id;
        const allProjects = await pool.query(`
            SELECT 
                id,
                user_id,
                title,
                description,
                TO_CHAR(startDate, 'YYYY-MM-DD') as startdate,
                TO_CHAR(endDate, 'YYYY-MM-DD') as enddate,
                projectUrl,
                completed,
                created_at
            FROM projects
            WHERE user_id = $1
            ORDER BY created_at DESC
        `, [user_id]);
        
        res.json(allProjects.rows);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Error occurred trying to READ projects");
    }
});

// Updating a project (ensure user owns the project)
router.put("/:id", protect, async(req, res) => {
    try{
        const { id } = req.params;
        const user_id = req.user.id;
        
        const { description, startDate, endDate, projectUrl, completed } = req.body;
        
        // First check if project exists and belongs to user
        const checkProject = await pool.query(
            "SELECT * FROM projects WHERE id = $1 AND user_id = $2",
            [id, user_id]
        );
        
        if(checkProject.rows.length === 0){
            return res.status(404).json({msg: "Project not found or unauthorized"});
        }
        
        const updateProject = await pool.query(
            "UPDATE projects SET description = $1, startDate = $2, endDate = $3, projectUrl = $4, completed = $5 WHERE id = $6 AND user_id = $7 RETURNING *",
            [description, startDate, endDate, projectUrl, completed, id, user_id]
        );
        
        res.json({ message: "UPDATE successful", project: updateProject.rows[0]});
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Error occurred trying to UPDATE a project");
    }
});

// Deleting a project (ensure user owns the project)
// Add this to your existing project DELETE route to also delete milestones
router.delete("/:id", protect, async(req, res) => {
    try{
        const { id } = req.params;
        const user_id = req.user.id;
        
        // First check if project exists and belongs to user
        const checkProject = await pool.query(
            "SELECT * FROM projects WHERE id = $1 AND user_id = $2",
            [id, user_id]
        );
        
        if(checkProject.rows.length === 0){
            return res.status(404).json({msg: "Project not found or unauthorized"});
        }
        
        // Delete all milestones associated with this project first
        await pool.query(
            "DELETE FROM milestones WHERE project_id = $1",
            [id]
        );
        
        // Then delete the project
        const deleteResult = await pool.query(
            "DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING *",
            [id, user_id]
        );
        
        res.json({ message: "Project and all associated milestones successfully deleted", project: deleteResult.rows[0] });
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Error occurred trying to DELETE a project");
    }
});

export default router;