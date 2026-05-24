import express from 'express';
import pool from '../config/database.js';
import protect from '../middleware/auth.js'; 

const router = express.Router();

// Create a milestone (must be associated with a project)
router.post('/milestone', protect, async(req, res) => {
    // Get project_id from request body
    const { project_id, description, completed } = req.body;
    
    // Validate required fields
    if (!project_id) {
        return res.status(400).json({msg: "Project ID is required. Milestone must be associated with a project"});
    }
    
    if (!description) {
        return res.status(400).json({msg: "Please enter the milestone description"});
    }
    
    try {
        // First verify that the project exists and belongs to the authenticated user
        const projectCheck = await pool.query(
            "SELECT id FROM projects WHERE id = $1 AND user_id = $2",
            [project_id, req.user.id]
        );
        
        if (projectCheck.rows.length === 0) {
            return res.status(404).json({msg: "Project not found or you don't have permission to add milestones to this project"});
        }
        
        // Check current milestone count for this project
        const milestoneCount = await pool.query(
            "SELECT COUNT(*) FROM milestones WHERE project_id = $1",
            [project_id]
        );
        
        if (parseInt(milestoneCount.rows[0].count) >= 10) {
            return res.status(400).json({msg: "Maximum 10 milestones allowed per project"});
        }
        
        // Insert the milestone
        const newMilestone = await pool.query(
            "INSERT INTO milestones (project_id, description, completed) VALUES ($1, $2, $3) RETURNING *",
            [project_id, description, completed || false]
        ); 
        
        res.json(newMilestone.rows[0]);
    }
    catch(error) {
        console.error(error.message);
        res.status(500).send("Error occurred trying to CREATE a milestone");
    }
});

// Fetch milestones belonging to a specific project
router.get("/milestones/:projectId", protect, async (req, res) => {
    try {
        const { projectId } = req.params;
        
        // Verify the project belongs to the authenticated user
        const projectCheck = await pool.query(
            "SELECT id FROM projects WHERE id = $1 AND user_id = $2",
            [projectId, req.user.id]
        );
        
        if (projectCheck.rows.length === 0) {
            return res.status(404).json({msg: "Project not found or unauthorized"});
        }
        
        // Fetch milestones for this project
        const allMilestones = await pool.query(`
            SELECT 
                id,
                project_id,
                description,
                completed,
                created_at
            FROM milestones
            WHERE project_id = $1
            ORDER BY created_at ASC
        `, [projectId]);
        
        res.json(allMilestones.rows);
    }
    catch(error) {
        console.error(error.message);
        res.status(500).send("Error occurred trying to READ milestones");
    }
});

// Update a milestone
router.put("/milestone/:id", protect, async(req, res) => {
    try {
        const { id } = req.params;
        const { description, completed } = req.body;
        
        // First verify the milestone exists and belongs to a project owned by the user
        const checkMilestone = await pool.query(
            `SELECT m.id FROM milestones m
             JOIN projects p ON m.project_id = p.id
             WHERE m.id = $1 AND p.user_id = $2`,
            [id, req.user.id]
        );
        
        if (checkMilestone.rows.length === 0) {
            return res.status(404).json({msg: "Milestone not found or unauthorized"});
        }
        
        const updateMilestone = await pool.query(
            "UPDATE milestones SET description = $1, completed = $2 WHERE id = $3 RETURNING *",
            [description, completed, id]
        );
        
        res.json({ message: "UPDATE successful", milestone: updateMilestone.rows[0]});
    }
    catch(error) {
        console.error(error.message);
        res.status(500).send("Error occurred trying to UPDATE a milestone");
    }
});

// Delete a milestone
router.delete("/milestone/:id", protect, async(req, res) => {
    try {
        const { id } = req.params;
        
        // First verify the milestone exists and belongs to a project owned by the user
        const checkMilestone = await pool.query(
            `SELECT m.id FROM milestones m
             JOIN projects p ON m.project_id = p.id
             WHERE m.id = $1 AND p.user_id = $2`,
            [id, req.user.id]
        );
        
        if (checkMilestone.rows.length === 0) {
            return res.status(404).json({json: {msg: "Milestone not found or unauthorized"}});
        }
        
        const deleteMilestone = await pool.query(
            "DELETE FROM milestones WHERE id = $1 RETURNING *",
            [id]
        );
        
        res.json({ message: "Milestone successfully deleted", milestone: deleteMilestone.rows[0] });
    }
    catch(err) {
        console.error(err.message);
        res.status(500).send("Error occurred trying to DELETE a milestone");
    }
});

export default router;