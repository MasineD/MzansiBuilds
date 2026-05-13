import express from 'express'
import pool from '../config/database.js';
import protect from '../middleware/auth.js'; 

const router = express.Router();

router.get("/celebrationWall", protect, async (req, res) => {
    try{
        // const user_id = req.user.id;
        const completedProjects = await pool.query(`
            SELECT 
                pr.name,
                pr.role,
                p.id,
                p.user_id,
                p.title,
                p.description,
                TO_CHAR(p.startDate, 'YYYY-MM-DD') as startdate,
                TO_CHAR(p.endDate, 'YYYY-MM-DD') as enddate,
                p.completed
            FROM projects p
            JOIN profiles pr ON p.user_id = pr.id
            WHERE p.completed IS TRUE
            ORDER BY p.created_at DESC
        `);
        
        res.json(completedProjects.rows);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Error occurred trying to READ completed projects");
    }
});

export default router;