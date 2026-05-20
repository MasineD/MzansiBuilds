import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router';
import Navbar from './components/navbar';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import NotFound from './components/notfound';
import axios from 'axios';
import './index.css';

axios.defaults.withCredentials = true; // Send cookies with requests

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        // ========== FIXED: Use full URL or ensure proxy is configured ==========
        const res = await axios.get('http://localhost:5000/api/auth/current', {
          withCredentials: true
        });
        
        if (res.data.user) {
          setUser(res.data.user);
          // Store user in localStorage as backup (optional)
          localStorage.setItem('user', JSON.stringify(res.data.user));
        } else {
          setUser(null);
          localStorage.removeItem('user');
        }
      } catch (err) {
        console.error('Session check failed:', err.response?.status, err.message);
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    fetchUserSession();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Dashboard user={user} setUser={setUser} /> : <Home />} />
        <Route path="/login" element={user ? <Dashboard user={user} setUser={setUser} /> : <Login setUser={setUser} />} />
        <Route path="/register" element={user ? <Dashboard user={user} setUser={setUser} /> : <Register setUser={setUser} />} />
        {user && <Route path="/dashboard" element={<Dashboard user={user} setUser={setUser} />} />}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;