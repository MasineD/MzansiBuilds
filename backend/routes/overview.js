import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import protect from '../middleware/auth.js'; 

const router = express.Router();

// router to fetch user-specific projects
router.get("/myprojects", protect, async (req, res) => {
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
            LIMIT 5
        `, [user_id]);
        
        res.json(allProjects.rows);
    }
    catch(err){
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