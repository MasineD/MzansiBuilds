import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import EditProfile from '../components/editProfile'
import Overview from '../features/overview'
import Projects from '../features/projects'
import CelebrationWall from '../features/celebrationWall'
import '../index.css'
import { FaPencilAlt } from 'react-icons/fa'
import {MdMenu, MdClose} from 'react-icons/md'

const Dashboard = ({ user, setUser }) => {
  const navigate = useNavigate()
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [profileData, setProfileData] = useState(null)
  const [userId, setUserId] = useState(null)
  const [activeNav, setActiveNav] = useState('Overview')
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({})

  // ========== Verify session on mount and refresh user data ==========
  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/current', {
          withCredentials: true
        });
        if (!res.data.user) {
          // If no user found, redirect to login
          setUser(null);
          navigate('/login');
        } else {
          // Update user state with fresh data
          setUser(res.data.user);
        }
      } catch (error) {
        console.error('Session verification failed:', error);
        setUser(null);
        navigate('/login');
      }
    };
    
    verifySession();
  }, [navigate, setUser]);

  // Function to handle logout
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, {
        withCredentials: true
      });
      setUser(null);
      localStorage.removeItem('user');
      navigate('/login');
    } catch (err) {
      console.error("Failed to logout");
    }
  }

  // Function to get initials from username
  const getInitials = (name) => {
    if (!name) return '?'
    const nameParts = name.split(' ')
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase()
    }
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase()
  }
  
  // Sidebar navigation
  const navItems = [
    { label: 'Overview', component: <Overview /> },
    { label: 'Projects', component: <Projects /> },
    { label: 'Celebration Wall', component: <CelebrationWall /> }
  ]

  // Closing the profile modal
  const closeProfile = () => {
    setShowEditProfile(false)
    console.log("Closing the profile")
  }

  return (
    <div>
      <div className="flex min-h-screen max-h-screen fixed bg-black w-full">
        {/* Sidebar */}
        <aside className="bg-black w-[20%] overflow-y-auto">
          {/* Sidebar Header */}
          <div className="sdHeader flex items-center justify-center h-[10%] pt-6">
            <span className="text-[30px] font-heading font-bold text-white">MzansiBuilds</span>
          </div>
          
          {/* User Profile Section */}
          <div className="userProfile flex items-center justify-center flex-col border-b border-gray-700 pb-6">
            <div className="profilePhoto flex items-center justify-center w-[13dvw] h-[26dvh] bg-green-600 rounded-[50%] text-black mt-4">
              <span className="text-[60px] font-bold text-gray-300">
                {getInitials(user?.name)}
              </span>
            </div>
            <div className="userDetails text-center mt-3">
              <h3 className="userFullName text-[22px] text-white">{user?.name}</h3>
              <p className="text-white/60 text-sm">{user?.email}</p>
            </div>
             
            {/* Edit Profile Button */}
            <div className="editProfileBtnContainer w-full px-4 mt-2">
              <button onClick={() => setShowEditProfile(true)} 
                className="text-white cursor-pointer hover:scale-105 transition-all duration-300 flex justify-end items-center w-full hover:text-[#00ff00]">
                <FaPencilAlt size={18} />
              </button>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div className="features mt-4">
            <nav className="sideBarNavigation flex flex-col py-[16px] mx-2">
              {navItems.map(({ label }) => (
                <button
                  key={label}
                  onClick={() => setActiveNav(label)}
                  className="flex items-center gap-[12px] w-[100%] py-[12px] px-[20px] bg-transparent cursor-pointer transition-all duration-100"
                  style={{
                    color: activeNav === label ? '#ffffff' : '#9ca3af',
                    borderLeft: activeNav === label ? '5px solid #00ff00' : '5px solid transparent',
                    fontSize: '20px',
                    fontWeight: activeNav === label ? 600 : 400
                  }}
                >
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>
          
          {/* Sign Out Button */}
          <div className="logout px-4 mt-8">
            <button 
              className="text-white cursor-pointer bg-[rgba(255,255,255,0.2)] text-[20px] font-600 w-full py-[10px] rounded-md hover:bg-[rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-300" 
              onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="bg-gradient-to-br from-green-600 to-white-100 w-[80%] overflow-y-auto p-6">
          <div className="main-content">
            {navItems.find(item => item.label === activeNav)?.component}
          </div>
        </main>
      </div>

      {showEditProfile && (
        <EditProfile closeProfile={closeProfile} />
      )}
    </div>
  )
}

export default Dashboard