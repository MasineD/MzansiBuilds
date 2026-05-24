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
       <div className='min-h-screen flex items-center justify-center bg-black relative overflow-hidden'>
      <form onSubmit={handleSubmit} className='relative z-10 bg-black border border-green-500/30 rounded-2xl shadow-[2px_2px_10px_0px_#00ff00] p-8 w-96'>
        {/* Home button */}
        <button onClick={()=>navigate('/')} className='absolute top-4 left-4 text-white/70 hover:text-[#00ff00] transition-all duration-300 hover:scale-110 hover:rotate-12 cursor-pointer'>
          <FaHome size={24}/> Home
        </button>
        
        {/* Header - Home and Sign In as per image */}
        <div className='text-center mb-6'>
          <h2 className='text-3xl font-semibold text-white mt-2'>Sign In</h2>
        </div>
        
        {error && <p className='text-red-400 text-sm mb-4 text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20 animate-shake'>{error}</p>}
        
        <div className='space-y-4'>
          {/* Email field */}
          <div className='relative group'>
            <FaEnvelope className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-green-500 transition-colors duration-300' />
            <input 
              type="email" 
              placeholder='Email' 
              value={form.email} 
              onChange={(e)=>setForm({...form, email: e.target.value})}
            className='w-full pl-10 pr-4 py-3 bg-black border border-white/30 rounded text-white focus:outline-none focus:border-green-500 transition-colors duration-300'
            />
          </div>
          
          {/* Password field */}
          <div className='relative group'>
            <FaLock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-green-500 transition-colors duration-300' />
            <input 
              type="password" 
              placeholder='Password' 
              value={form.password} 
              onChange={(e)=>setForm({...form, password: e.target.value})}
              className='w-full pl-10 pr-4 py-3 bg-black border border-white/30 rounded text-white focus:outline-none focus:border-green-500 transition-colors duration-300'
            />
          </div>
          
          {/* Forgot password link - exactly as in image */}
          <div className='text-right'>
            <span 
              className='text-sm text-gray-400 hover:text-green-500 cursor-pointer transition-colors duration-300'
              onClick={() => navigate('/forgot-password')}
            >
              forgot password?
            </span>
          </div>
          
          {/* Login button */}
          <button 
            type="submit" 
            className="cursor-pointer w-full py-3 bg-[#00ff00] text-white font-semibold rounded-lg hover:shadow-[0_0_20px_#00ff00] hover:scale-105 hover:cursor-pointer transform transition-all duration-300 relative overflow-hidden group">
            <span className='relative z-10'>Login</span>
            <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-500'></div>
          </button>
        </div>
        
        {/* Sign up link - exactly as in image */}
        <p className='text-center text-gray-300 mt-6 text-sm'>
          Don't have an account? 
          <span 
            className='text-green-500 cursor-pointer font-semibold hover:text-green-400 transition-all duration-300 ml-1' 
            onClick={()=>navigate('/register')}
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
    );
}

export default Login;
