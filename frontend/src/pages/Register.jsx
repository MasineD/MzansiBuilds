import React from 'react'
import { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const Register = ({ setUser }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const res = await axios.post(`${API_URL}/api/auth/register`, form);
            setUser(res.data.user);
            navigate('/dashboard');
        }catch(err){
            setError("Failed to register");
        }
    };

  return (
    <div className='min-h-screen flex items-center justify-center bg-black relative overflow-hidden'>
      <form onSubmit={handleSubmit} className='relative z-10 bg-black border border-green-500/30 rounded-2xl shadow-[2px_2px_10px_0px_#00ff00] p-8 w-96'>
        <button onClick={()=>navigate('/')} className='absolute top-4 left-4 text-white/70 hover:text-[#00ff00] transition-all duration-300 hover:scale-110 hover:rotate-12 cursor-pointer'>
          <FaHome size={24}/> Home
        </button>   
        
        <div className='text-center mb-6'>
          <h1 className='text-3xl font-semibold text-white mt-2'>Sign Up</h1>
        </div>
        
        {error && <p className='text-red-400 text-sm mb-4 text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20'>{error}</p>}
        
        <div className='space-y-4'>
          <div className='relative group'>
            <FaUser className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-green-500 transition-colors duration-300' />
            <input 
              type="text" 
              placeholder='Full Name' 
              value={form.name} 
              onChange={(e)=>setForm({...form, name: e.target.value})}
              className='w-full pl-10 pr-4 py-3 bg-black border border-white/30 rounded text-white focus:outline-none focus:border-green-500 transition-colors duration-300'
            />
          </div>
          
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
          
          <button 
            type="submit" 
            className="cursor-pointer w-full py-3 bg-[#00ff00] text-white font-semibold rounded-lg hover:shadow-[0_0_20px_#00ff00] hover:scale-105 hover:cursor-pointer transform transition-all duration-300 relative overflow-hidden group">
            Sign Up
          </button>
        </div>
        
        <p className='text-center text-white/70 mt-6 text-sm'>
          Already have an account? 
          <span 
            className='text-green-500 cursor-pointer hover:text-green-400 transition-all duration-300 ml-1' 
            onClick={()=>navigate('/login')}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  )
}

export default Register