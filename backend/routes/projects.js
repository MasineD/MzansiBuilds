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
router.post("/projects", async (req,res)=>{     //Make the operation non-blocking with the async word
    try{
        const { title, description, startDate, endDate, projectUrl, completed } = req.body;        //Destructuring a TODO's details from the client
        if(!title || !description || !startDate || !endDate || !projectUrl){     //Check if all the required fields are provided, and if not, send a 400 Bad Request response with an error message.
            return res.status(400).json({msg: "All fields are required to create a project"});
        }
        // create the date variables, and convert them to the correct format for the database
        const start = new Date(startDate);
        const end = new Date(endDate);
        if( start > end){
            return res.status(400).json({msg: "Start date cannot be after end date"});
        }
        const newProject =  await pool.query(      //Talking to the database, and creating a new task
            "INSERT INTO projects (title, description, startDate, endDate, projectUrl, completed) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",        //$1 and $2 are parameterised queries, preventing SQL injection attacks. Returning * allows sending the responses back to the frontend
            [title, description, startDate, endDate, projectUrl, completed || false]
        );
        res.json(newProject.rows[0]);      //Sending a response back to the frontend, if everything was successful
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Error occured trying to CREATE a project", err.message)
    }
});
// TODO: Uncomment the commented line in PostgreSQL 
// Fetching all projects
router.get("/projects", async (req,res)=>{
    try{
        const allProjects = await pool.query("SELECT * FROM projects");    //Fetching all projects
        res.json(allProjects.rows);        //Sending all projects back to the frontend
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Error occured trying to READ projects", err.message);
    }
});
// Updating a project
// TODO: Handle the project id in the frontend, and send it with the request, so that we can update the correct project in the database. This will allow us to implement project editing functionality in the future.
router.put("/:id", async(req,res)=>{
    try{
        const { id } = req.params;
        const { description, startDate, endDate, projectUrl, completed } = req.body;
        if(!description || !startDate || !endDate || !projectUrl || completed === undefined){
            return res.status(400).json({msg: "Please provide all required fields to update the project"});
        }
        const updateProject =  await pool.query(
            "UPDATE projects SET description = $1, startDate = $2, endDate = $3, projectUrl = $4, completed = $5 WHERE id = $6 RETURNING *",
            [description, startDate, endDate, projectUrl, completed || false, id]
        );
        if(updateProject.rows.length === 0){
            return res.status(404).json({msg: "Project not found"});
        }
        res.json({ message: "UPDATE successful", project: updateProject.rows[0]});
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Error occured trying to UPDATE a project", err.message);
    }
});
// Deleting a project
router.delete("/:id", async(req,res)=>{
    try{
        const { id } = req.params;
        const deleteResult = await pool.query(
            "DELETE FROM projects WHERE id = $1 RETURNING *",
            [id]
        );
        if (deleteResult.rows.length === 0) {
            return res.status(404).json({msg: "Project not found"});
        }
        res.json({ message: "Project successfully deleted", project: deleteResult.rows[0] });
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Error occured trying to DELETE a project", err.message);
    }
});

export default router;