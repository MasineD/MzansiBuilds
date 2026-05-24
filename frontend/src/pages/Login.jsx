import React from 'react'
import { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaEnvelope, FaLock, FaRocket } from 'react-icons/fa';

const Login = ({ setUser }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [form, setForm] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);

    // Get the API URL from environment variables
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            // Use the environment variable instead of hardcoded localhost
            const res = await axios.post(`${API_URL}/api/auth/login`, form);
            setUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/dashboard');
        }catch(err){
            setError("Failed to login");
        }
    };

    return (
        // ... rest of your JSX remains the same
    );
}

export default Login;