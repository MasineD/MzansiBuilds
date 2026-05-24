import express from 'express';
import pool from '../config/database.js';
import protect from '../middleware/auth.js'; 

const router = express.Router();

// ========== CREATE a collaborator ==========
// POST /api/collaborators
router.post('/collaborator', protect, async (req, res) => {
    const { project_id, email } = req.body;
    const user_id = req.user.id;  // This comes from the decoded JWT token
    
    // Validate required fields
    if (!project_id) {
        return res.status(400).json({ msg: "Project ID is required" });
    }
    
    if (!email) {
        return res.status(400).json({ msg: "User email is required" });
    }
    
    try {
        // First verify that the project exists and belongs to the authenticated user
        const projectCheck = await pool.query(
            "SELECT id, user_id FROM projects WHERE id = $1 AND user_id = $2",
            [project_id, user_id]
        );
        
        if (projectCheck.rows.length === 0) {
            return res.status(404).json({ msg: "Project not found or you don't have permission to add collaborators to this project" });
        }
        
        // Find the user by email
        const userCheck = await pool.query(
            "SELECT id, name, email FROM users WHERE email = $1",
            [email]
        );
        
        if (userCheck.rows.length === 0) {
            return res.status(404).json({ msg: "User with this email not found" });
        }
        
        const collaboratorUserId = userCheck.rows[0].id;
        
        // Check if already a collaborator
        const existingCollaborator = await pool.query(
            "SELECT id FROM collaborators WHERE project_id = $1 AND user_id = $2",
            [project_id, collaboratorUserId]
        );
        
        if (existingCollaborator.rows.length > 0) {
            return res.status(400).json({ msg: "User is already a collaborator on this project" });
        }
        
        // Check if trying to add yourself
        if (collaboratorUserId === req.user.id) {
            return res.status(400).json({ msg: "You cannot add yourself as a collaborator" });
        }
        
        // Insert the collaborator
        const newCollaborator = await pool.query(
            "INSERT INTO collaborators (user_id, project_id, email) VALUES ($1, $2, $3) RETURNING id, project_id, user_id, created_at",
            [collaboratorUserId, project_id, email]
        );
        
        // Return collaborator with user details
        const collaboratorWithUser = {
            id: newCollaborator.rows[0].id,
            project_id: newCollaborator.rows[0].project_id,
            user_id: newCollaborator.rows[0].user_id,
            name: userCheck.rows[0].name,
            email: userCheck.rows[0].email,
            created_at: newCollaborator.rows[0].created_at
        };
        
        res.status(201).json(collaboratorWithUser);
    }
    catch(error) {
        console.error(error.message);
        res.status(500).json({ msg: "Error occurred trying to CREATE a collaborator" });
    }
});

// ========== GET all collaborators for a specific project ==========
// GET /api/collaborators/:projectId
router.get("/collaborators/:projectId", protect, async (req, res) => {
    try {
        const { projectId } = req.params;
        
        // Verify the project exists and user has access (owner or collaborator)
        const projectCheck = await pool.query(
            `SELECT p.id FROM projects p
             WHERE p.id = $1 AND (p.user_id = $2 OR EXISTS (
                 SELECT 1 FROM collaborators c WHERE c.project_id = p.id AND c.user_id = $2
             ))`,
            [projectId, req.user.id]
        );
        
        if (projectCheck.rows.length === 0) {
            return res.status(404).json({ msg: "Project not found or unauthorized" });
        }
        
        // Fetch collaborators for this project with user details
        const collaborators = await pool.query(`
            SELECT 
                c.id,
                c.project_id,
                c.user_id,
                c.created_at,
                u.name,
                u.email
            FROM collaborators c
            JOIN users u ON c.user_id = u.id
            WHERE c.project_id = $1
            ORDER BY c.created_at ASC
        `, [projectId]);
        
        // Also get the project owner
        const projectOwner = await pool.query(`
            SELECT u.id, u.name, u.email
            FROM projects p
            JOIN users u ON p.user_id = u.id
            WHERE p.id = $1
        `, [projectId]);
        
        res.json({
            collaborators: collaborators.rows,
            owner: projectOwner.rows[0] || null
        });
    }
    catch(error) {
        console.error(error.message);
        res.status(500).json({ msg: "Error occurred trying to READ collaborators" });
    }
});

// ========== DELETE a collaborator ==========
// DELETE /api/collaborator/:id
router.delete("/collaborator/:id", protect, async (req, res) => {
    try {
        const { id } = req.params;
        
        // First verify the collaborator exists and belongs to a project owned by the user
        const checkCollaborator = await pool.query(
            `SELECT c.id, c.project_id FROM collaborators c
             JOIN projects p ON c.project_id = p.id
             WHERE c.id = $1 AND p.user_id = $2`,
            [id, req.user.id]
        );
        
        if (checkCollaborator.rows.length === 0) {
            return res.status(404).json({ msg: "Collaborator not found or unauthorized" });
        }
        
        const deleteCollaborator = await pool.query(
            "DELETE FROM collaborators WHERE id = $1 RETURNING *",
            [id]
        );
        
        res.json({ message: "Collaborator successfully deleted", collaborator: deleteCollaborator.rows[0] });
    }
    catch(err) {
        console.error(err.message);
        res.status(500).json({ msg: "Error occurred trying to DELETE a collaborator" });
    }
});

// ========== GET projects where user is a collaborator ==========
// GET /api/collaborator-projects
router.get("/collaborator-projects", protect, async (req, res) => {
    try {
        const user_id = req.user.id;
        
        const collaboratorProjects = await pool.query(`
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
                u.name as owner_name,
                u.email as owner_email
            FROM collaborators c
            JOIN projects p ON c.project_id = p.id
            JOIN users u ON p.user_id = u.id
            WHERE c.user_id = $1
            ORDER BY p.created_at DESC
        `, [user_id]);
        
        res.json(collaboratorProjects.rows);
    }
    catch(error) {
        console.error(error.message);
        res.status(500).json({ msg: "Error occurred trying to READ collaborator projects" });
    }
});

// ========== GET collaborator count for a project ==========
// GET /api/collaborators/count/:projectId
router.get("/collaborators/count/:projectId", protect, async (req, res) => {
    try {
        const { projectId } = req.params;
        
        const result = await pool.query(
            "SELECT COUNT(*) as count FROM collaborators WHERE project_id = $1",
            [projectId]
        );
        
        res.json({ count: parseInt(result.rows[0].count) });
    }
    catch(error) {
        console.error(error.message);
        res.status(500).json({ msg: "Error occurred trying to READ collaborator count" });
    }
});

export default router;