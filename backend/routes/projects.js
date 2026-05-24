import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';
import protect from '../middleware/auth.js';

const router = express.Router();

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000
};

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Route to create a new project (protected route)
router.post("/projects", protect, async (req, res) => {
    try {
        const user_id = req.user.id;
        const { title, description, startDate, endDate, projectUrl, completed } = req.body;
        
        if (!title || !description || !startDate || !endDate) {
            return res.status(400).json({ msg: "All fields are required to create a project" });
        }
        
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start > end) {
            return res.status(400).json({ msg: "Start date cannot be after end date" });
        }
        
        const newProject = await pool.query(
            "INSERT INTO projects (user_id, title, description, startDate, endDate, projectUrl, completed) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [user_id, title, description, startDate, endDate, projectUrl, completed || false]
        );
        
        res.json(newProject.rows[0]);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Error occurred trying to CREATE a project");
    }
});

// ========== UPDATED: Fetch all projects for the authenticated user (including collaborator projects) ==========
router.get("/projects", protect, async (req, res) => {
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

// ========== NEW: Fetch projects where user is a collaborator only ==========
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
                u.email as owner_email,
                (SELECT COUNT(*) FROM collaborators WHERE project_id = p.id) as collaborator_count
            FROM collaborators c
            JOIN projects p ON c.project_id = p.id
            JOIN users u ON p.user_id = u.id
            WHERE c.user_id = $1
            ORDER BY p.created_at DESC
        `, [user_id]);
        
        res.json(collaboratorProjects.rows);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Error occurred trying to READ collaborator projects");
    }
});

// ========== NEW: Fetch projects where user is owner only ==========
router.get("/owner-projects", protect, async (req, res) => {
    try {
        const user_id = req.user.id;
        
        const ownerProjects = await pool.query(`
            SELECT 
                id,
                user_id as owner_id,
                title,
                description,
                TO_CHAR(startDate, 'YYYY-MM-DD') as startdate,
                TO_CHAR(endDate, 'YYYY-MM-DD') as enddate,
                projectUrl,
                completed,
                created_at,
                (SELECT COUNT(*) FROM collaborators WHERE project_id = p.id) as collaborator_count
            FROM projects p
            WHERE user_id = $1
            ORDER BY created_at DESC
        `, [user_id]);
        
        res.json(ownerProjects.rows);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Error occurred trying to READ owner projects");
    }
});

// ========== UPDATED: Get a single project with collaborators info ==========
router.get("/project/:id", protect, async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;
        
        const project = await pool.query(`
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
                u.email as owner_email,
                CASE 
                    WHEN p.user_id = $2 THEN 'owner' 
                    WHEN EXISTS (SELECT 1 FROM collaborators WHERE project_id = p.id AND user_id = $2) THEN 'collaborator'
                    ELSE 'none'
                END as relationship,
                (SELECT COUNT(*) FROM collaborators WHERE project_id = p.id) as collaborator_count
            FROM projects p
            JOIN users u ON p.user_id = u.id
            WHERE p.id = $1
        `, [id, user_id]);
        
        if (project.rows.length === 0) {
            return res.status(404).json({ msg: "Project not found" });
        }
        
        // Check if user has access (owner or collaborator)
        const relationship = project.rows[0].relationship;
        if (relationship === 'none') {
            return res.status(403).json({ msg: "You don't have access to this project" });
        }
        
        // Get collaborators for this project
        const collaborators = await pool.query(`
            SELECT 
                c.id,
                c.user_id,
                c.created_at,
                u.name,
                u.email
            FROM collaborators c
            JOIN users u ON c.user_id = u.id
            WHERE c.project_id = $1
            ORDER BY c.created_at ASC
        `, [id]);
        
        res.json({
            ...project.rows[0],
            collaborators: collaborators.rows
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Error occurred trying to READ project");
    }
});

// ========== UPDATED: Get other projects (excluding user's own and collaborator projects) ==========
router.get("/other-projects", protect, async (req, res) => {
    try {
        const user_id = req.user.id;
        
        const otherProjects = await pool.query(`
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
                u.email as owner_email,
                (SELECT COUNT(*) FROM collaborators WHERE project_id = p.id) as collaborator_count,
                pr.role as owner_role
            FROM projects p
            JOIN users u ON p.user_id = u.id
            LEFT JOIN profiles pr ON p.user_id = pr.user_id
            WHERE p.user_id != $1
              AND p.id NOT IN (SELECT project_id FROM collaborators WHERE user_id = $1)
            ORDER BY p.created_at DESC
        `, [user_id]);
        
        res.json(otherProjects.rows);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Error occurred trying to READ other projects");
    }
});

// ========== UPDATED: Get project collaborators count ==========
router.get("/:id/collaborators/count", protect, async (req, res) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query(
            "SELECT COUNT(*) as count FROM collaborators WHERE project_id = $1",
            [id]
        );
        
        res.json({ count: parseInt(result.rows[0].count) });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Error occurred trying to READ collaborator count");
    }
});

// Updating a project (ensure user owns the project)
router.put("/:id", protect, async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;
        
        const { title, description, startDate, endDate, projectUrl, completed } = req.body;
        
        // First check if project exists and belongs to user
        const checkProject = await pool.query(
            "SELECT * FROM projects WHERE id = $1 AND user_id = $2",
            [id, user_id]
        );
        
        if (checkProject.rows.length === 0) {
            return res.status(404).json({ msg: "Project not found or unauthorized" });
        }
        
        const updateProject = await pool.query(
            "UPDATE projects SET title = $1, description = $2, startDate = $3, endDate = $4, projectUrl = $5, completed = $6 WHERE id = $7 AND user_id = $8 RETURNING *",
            [title, description, startDate, endDate, projectUrl, completed, id, user_id]
        );
        
        res.json({ message: "UPDATE successful", project: updateProject.rows[0] });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Error occurred trying to UPDATE a project");
    }
});

// Deleting a project (ensure user owns the project)
router.delete("/:id", protect, async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;
        
        // First check if project exists and belongs to user
        const checkProject = await pool.query(
            "SELECT * FROM projects WHERE id = $1 AND user_id = $2",
            [id, user_id]
        );
        
        if (checkProject.rows.length === 0) {
            return res.status(404).json({ msg: "Project not found or unauthorized" });
        }
        
        // Delete all milestones associated with this project first
        await pool.query("DELETE FROM milestones WHERE project_id = $1", [id]);
        
        // Delete all collaborators associated with this project
        await pool.query("DELETE FROM collaborators WHERE project_id = $1", [id]);
        
        // Then delete the project
        const deleteResult = await pool.query(
            "DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING *",
            [id, user_id]
        );
        
        res.json({ message: "Project and all associated milestones and collaborators successfully deleted", project: deleteResult.rows[0] });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("Error occurred trying to DELETE a project");
    }
});

export default router;