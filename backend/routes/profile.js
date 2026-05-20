import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import protect from '../middleware/auth.js';   //Imports the protect middleware function from the auth.js file in the middleware directory. This middleware is used to protect certain routes by verifying the JWT token sent in the request cookies.

const router = express.Router();        //Create a router object using Express, which allows us to define routes for user authentication (registration and login) in a modular way. This router will be exported and used in the main server file to handle authentication-related requests.

// Fetching profile details for the authenticated user
router.get("/profile", protect, async (req, res) => {
    try{
        const user_id = req.user.id;
        const myProfile = await pool.query(`
            SELECT 
                id,
                name,
                gender,
                age,
                email,
                phonenumber,
                organization,
                role,
                created_at
            FROM profiles
            WHERE id = $1
        `, [user_id]);
        
        if (myProfile.rows.length === 0) {
            return res.status(404).json({ msg: "Profile not found" });
        }

        res.json(myProfile.rows[0]);    //Send a single object rather than a whole array of profiles
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Error occurred trying to READ profile details");
    }
});

// Updating a profile details
router.put("/profile", protect, async(req, res) => {
    try{
        const user_id = req.user.id;
        
        const { name, gender, age, phonenumber, organization, role } = req.body;
        
        // First check if profile exists
        const checkProfile = await pool.query(
            "SELECT * FROM profiles WHERE id = $1",
            [user_id]
        );
        
        if(checkProfile.rows.length === 0){
            return res.status(404).json({msg: "Profile not found"});
        }
        
        const updateProfile = await pool.query(
            "UPDATE profiles SET name = $1, gender = $2, age = $3, phonenumber = $4, organization = $5, role = $6 WHERE id = $7 RETURNING *",
            [name, gender, age, phonenumber, organization, role , user_id]
        );
        
        res.json({ message: "UPDATE successful", profile: updateProfile.rows[0]});
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Error occurred trying to UPDATE a profile");
    }
});

export default router;