import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import protect from '../middleware/auth.js'; 

const router = express.Router();

// router to fetch user-specific projects
router.get("/myprojects", protect, async (req, res) => {
   try {
        const user_id = req.user.id;
        
        // Get projects where user is owner OR collaborator
        const allProjects = await pool.query(`
            SELECT 
                p.id,
                p.user_id as owner_id,
                p.title,
                p.description,
                TO_CHAR(p.startDate, 'YYYY-MM-DD') as startdate,
                TO_CHAR(p.endDate, 'YYYY-MM-DD') as enddate,
                p.projectUrl,
                p.completed,
                p.created_at,
                CASE 
                    WHEN p.user_id = $1 THEN 'owner' 
                    ELSE 'collaborator' 
                END as relationship,
                u.name as owner_name,
                u.email as owner_email
            FROM projects p
            JOIN users u ON p.user_id = u.id
            WHERE p.user_id = $1 
               OR p.id IN (SELECT project_id FROM collaborators WHERE user_id = $1)
            ORDER BY p.created_at DESC
        `, [user_id]);
        
        res.json(allProjects.rows);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Error occurred trying to READ projects");
    }
});
// Router to fetch other projects
router.get("/otherprojects", protect, async (req, res) => {
    try{
        const user_id = req.user.id;
        const allProjects = await pool.query(`
            SELECT 
            p.id,
            p.user_id,
            p.title,
            p.description,
            TO_CHAR(p.startDate, 'YYYY-MM-DD') as startdate,
            TO_CHAR(p.endDate, 'YYYY-MM-DD') as enddate,
            p.projectUrl,
            p.completed,
            p.created_at,
            pr.name,
            pr.role
        FROM projects p
        JOIN profiles pr ON p.user_id = pr.id
        WHERE p.user_id != $1
        ORDER BY p.created_at DESC
        `, [user_id]);
        
        res.json(allProjects.rows);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Error occurred trying to READ projects");
    }
});

export default router;