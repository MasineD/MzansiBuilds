import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './components/NotFound';
import axios from 'axios';
import './index.css';
import { API_URL } from './api.js'

axios.defaults.withCredentials = true;

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserSession = async () => {
      // ✅ First, check localStorage for cached user data
      const cachedUser = localStorage.getItem('user');
      
      try {
        const res = await axios.get(`${API_URL}/api/auth/current`, {
          withCredentials: true,
          timeout: 10000 // 10 second timeout
        });
        
        if (res.data.user) {
          setUser(res.data.user);
          localStorage.setItem('user', JSON.stringify(res.data.user));
        } else {
          // Only clear if server explicitly says no user
          setUser(null);
          localStorage.removeItem('user');
        }
      } catch (err) {
        console.error('Session check failed:', err.response?.status, err.message);
        
        // ✅ IMPORTANT: Don't clear user on network errors
        // Only clear if it's a 401 (unauthorized) or 404
        if (err.response?.status === 401 || err.response?.status === 404) {
          setUser(null);
          localStorage.removeItem('user');
        } else if (cachedUser) {
          // ✅ Keep the cached user if it's a network error
          try {
            const parsedUser = JSON.parse(cachedUser);
            setUser(parsedUser);
            console.log('Using cached user data due to network error');
          } catch (e) {
            setUser(null);
          }
        }
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
        <Route path="/dashboard" element={user ? <Dashboard user={user} setUser={setUser} /> : <Login setUser={setUser} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
