import express from 'express';
import pool from '../config/database.js';
import protect from '../middleware/auth.js'; 

const router = express.Router();

// ========== CREATE a new comment ==========
// POST /api/comments
router.post('/', protect, async (req, res) => {
    try {
        const user_id = req.user.id;
        const { project_id, description } = req.body;
        
        // Validate required fields
        if (!project_id) {
            return res.status(400).json({ msg: "Project ID is required" });
        }
        
        if (!description || description.trim() === '') {
            return res.status(400).json({ msg: "Comment description cannot be empty" });
        }
        
        // Verify the project exists
        const projectCheck = await pool.query(
            "SELECT id, user_id FROM projects WHERE id = $1",
            [project_id]
        );
        
        if (projectCheck.rows.length === 0) {
            return res.status(404).json({ msg: "Project not found" });
        }
        
        const projectOwnerId = projectCheck.rows[0].user_id;
        
        // Insert the new comment
        const newComment = await pool.query(
            `INSERT INTO comments (project_id, user_id, description) 
             VALUES ($1, $2, $3) 
             RETURNING id, project_id, user_id, description, created_at`,
            [project_id, user_id, description]
        );
        
        // Fetch user details for the response
        const userDetails = await pool.query(
            "SELECT name, email FROM users WHERE id = $1",
            [user_id]
        );
        
        const commentWithUser = {
            ...newComment.rows[0],
            user_name: userDetails.rows[0]?.name || 'Anonymous',
            user_email: userDetails.rows[0]?.email
        };
        
        res.status(201).json({ 
            message: "Comment added successfully", 
            comment: commentWithUser,
            project_owner_id: projectOwnerId
        });
        
    } catch (error) {
        console.error('Error creating comment:', error.message);
        res.status(500).json({ msg: "Error occurred trying to CREATE a comment" });
    }
});

// ========== GET all comments for a specific project ==========
// GET /api/comments/project/:projectId
router.get('/project/:projectId', protect, async (req, res) => {
    try {
        const { projectId } = req.params;
        
        // Verify the project exists
        const projectCheck = await pool.query(
            "SELECT id FROM projects WHERE id = $1",
            [projectId]
        );
        
        if (projectCheck.rows.length === 0) {
            return res.status(404).json({ msg: "Project not found" });
        }
        
        // Fetch all comments for this project with user details
        const comments = await pool.query(
            `SELECT 
                c.id,
                c.project_id,
                c.user_id,
                c.description,
                c.created_at,
                u.name as user_name,
                u.email as user_email
             FROM comments c
             JOIN users u ON c.user_id = u.id
             WHERE c.project_id = $1
             ORDER BY c.created_at DESC`,
            [projectId]
        );
        
        res.json(comments.rows);
        
    } catch (error) {
        console.error('Error fetching comments:', error.message);
        res.status(500).json({ msg: "Error occurred trying to READ comments" });
    }
});

// ========== UPDATE a comment ==========
// PUT /api/comments/:id
router.put('/:id', protect, async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;
        const { description } = req.body;
        
        // Check if comment exists and belongs to user
        const commentCheck = await pool.query(
            "SELECT * FROM comments WHERE id = $1 AND user_id = $2",
            [id, user_id]
        );
        
        if (commentCheck.rows.length === 0) {
            return res.status(404).json({ msg: "Comment not found or unauthorized" });
        }
        
        if (!description || description.trim() === '') {
            return res.status(400).json({ msg: "Comment description cannot be empty" });
        }
        
        // Update the comment
        const updatedComment = await pool.query(
            `UPDATE comments 
             SET description = $1, updated_at = CURRENT_TIMESTAMP 
             WHERE id = $2 AND user_id = $3 
             RETURNING id, project_id, user_id, description, created_at, updated_at`,
            [description, id, user_id]
        );
        
        res.json({ message: "Comment updated successfully", comment: updatedComment.rows[0] });
        
    } catch (error) {
        console.error('Error updating comment:', error.message);
        res.status(500).json({ msg: "Error occurred trying to UPDATE a comment" });
    }
});

// ========== DELETE a comment ==========
// DELETE /api/comments/:id
router.delete('/:id', protect, async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;
        
        // Check if comment exists and belongs to user
        const commentCheck = await pool.query(
            "SELECT * FROM comments WHERE id = $1 AND user_id = $2",
            [id, user_id]
        );
        
        if (commentCheck.rows.length === 0) {
            return res.status(404).json({ msg: "Comment not found or unauthorized" });
        }
        
        // Delete the comment
        await pool.query(
            "DELETE FROM comments WHERE id = $1 AND user_id = $2",
            [id, user_id]
        );
        
        res.json({ message: "Comment deleted successfully" });
        
    } catch (error) {
        console.error('Error deleting comment:', error.message);
        res.status(500).json({ msg: "Error occurred trying to DELETE a comment" });
    }
});

// ========== GET a single comment by ID ==========
// GET /api/comments/:id
router.get('/:id', protect, async (req, res) => {
    try {
        const { id } = req.params;
        
        const comment = await pool.query(
            `SELECT 
                c.id,
                c.project_id,
                c.user_id,
                c.description,
                c.created_at,
                u.name as user_name,
                u.email as user_email
             FROM comments c
             JOIN users u ON c.user_id = u.id
             WHERE c.id = $1`,
            [id]
        );
        
        if (comment.rows.length === 0) {
            return res.status(404).json({ msg: "Comment not found" });
        }
        
        res.json(comment.rows[0]);
        
    } catch (error) {
        console.error('Error fetching comment:', error.message);
        res.status(500).json({ msg: "Error occurred trying to READ comment" });
    }
});

export default router;