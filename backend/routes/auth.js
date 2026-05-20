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
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// User registration route
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please provide name, email and password' });
    }
    
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
        [name, email, hashedPassword]
    );
    
    const token = generateToken(newUser.rows[0].id);
    res.cookie('token', token, cookieOptions);
    
    return res.status(201).json({ user: newUser.rows[0] });
});

// User login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }
    
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const userData = user.rows[0];
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const token = generateToken(userData.id);
    res.cookie('token', token, cookieOptions);
    
    res.json({ user: { id: userData.id, name: userData.name, email: userData.email } });
});

// ========== FIXED: Current user route - returns full user info ==========
router.get('/current', protect, async (req, res) => {
    try {
        // req.user is set by the protect middleware from the JWT token
        const userId = req.user.id;
        
        // Fetch fresh user data from database
        const user = await pool.query(
            'SELECT id, name, email FROM users WHERE id = $1',
            [userId]
        );
        
        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json({ user: user.rows[0] });
    } catch (error) {
        console.error('Error fetching current user:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Logout route
router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    res.json({ message: 'Logged out successfully' });
});

export default router;