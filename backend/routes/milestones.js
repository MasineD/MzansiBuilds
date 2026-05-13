import express from 'express';
import pool from '../config/database.js';
import protect from '../middleware/auth.js'; 

const router = express.Router()

router.post('/milestone', async(req,res) => {
    
    const projectId = req.project.id    //Get the projectId from the request
    const { description, completed } = req.body;
    if(!description){
        return res.status(400).json({msg: "Please enter the milestone description"});
    }
    try{
        const newMilestone = await pool.query(
            "INSERT INTO milestones (project_id, description, completed) VALUES ($1, $2, $3) RETURNING *",
            [project_id, description, completed || false]
        ); 
        res.json(newProject.rows[0]);
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Error occurred trying to CREATE a milestone");
    }
});
// Fetch the milestones belonging to a particular project
router.get("/milestones", protect, async (req, res) => {
    try{
        const project_id = req.project.id;
        const allMilestones = await pool.query(`
            SELECT 
                id,
                project_id,
                description,
                completed,
                created_at
            FROM projects
            WHERE project_id = $1
        `, [project_id]);
        
        res.json(allMilestones.rows);
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Error occurred trying to READ milestones");
    }
});
// Updating a milestone
router.put("/:id", protect, async(req, res) => {
    try{
        const { id } = req.params;
        const project_id = req.project.id;
        const { description, completed } = req.body;
        
        // First check if milestone exists and belongs to the project
        const checkMilestone = await pool.query(
            "SELECT * FROM milestones WHERE id = $1 AND project_id = $2",
            [id, project_id]
        );
        
        if(checkMilestone.rows.length === 0){
            return res.status(404).json({msg: "Milestone not found or unauthorized"});
        }
        
        const updateMilestone = await pool.query(
            "UPDATE milestones SET description = $1, completed = $2 WHERE id = $3 AND project_id = $4 RETURNING *",
            [description, completed, id, project_id]
        );
        
        res.json({ message: "UPDATE successful", milestone: updateMilestone.rows[0]});
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Error occurred trying to UPDATE a milestone");
    }
});

// Deleting a milestone (ensure milestone belongs to the project)
router.delete("/:id", protect, async(req, res) => {
    try{
        const { id } = req.params;
        const project_id = req.project.id;
        
        const deleteMilestone = await pool.query(
            "DELETE FROM milestones WHERE id = $1 AND project_id = $2 RETURNING *",
            [id, project_id]
        );
        
        if (deleteMilestone.rows.length === 0) {
            return res.status(404).json({msg: "Milestone not found or unauthorized"});
        }
        
        res.json({ message: "Milestone successfully deleted", milestone: deleteMilestone.rows[0] });
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Error occurred trying to DELETE a milestone");
    }
});

export default router;