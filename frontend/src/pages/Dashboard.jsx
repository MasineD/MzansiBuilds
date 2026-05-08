// import React from 'react'
// import axios from 'axios'
// import { useNavigate } from 'react-router-dom';

// const Dashboard = ({ user, setUser }) => {
//     const navigate = useNavigate();
//     // Function to handle logout, which will involve making a request to the backend to destroy the session or token, and then updating the state accordingly, will go here
//   const handleLogout = async () => {
//         try {
//           await axios.post('http://localhost:5000/api/auth/logout'); // Sending the logout request to the backend to destroy the session or token
//             setUser(null); // After logging out, set the user state to null
//             navigate('/login'); // Redirect to the login page after logging out
//         } catch (err) {
//           console.error("Failed to logout");
//         }
//     }
//     return (
//     <div>
//       {user ? (
//         <div>
//           <h1>Welcome, {user.name}!</h1>
//           <button onClick={handleLogout}>Logout</button>
//         </div>
//       ) : (
//         <p>Please log in to view the dashboard.</p>
//       )}
//     </div>
//   )

// }

// export default Dashboard

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import EditProfile from '../components/editProfile'
import Overview from '../features/overview'
import Projects from '../features/projects'
import CelebrationWall from '../features/celebrationWall'
import '../index.css'

const Dashboard = ({ user, setUser }) => {
  const navigate = useNavigate()
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [profileData, setProfileData] = useState(null)
  const [userId, setUserId] = useState(null)
  const [activeNav, setActiveNav] = useState('Overview')
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({})

  // Get current user ID and fetch profile
//   useEffect(() => {
//     const getUserAndProfile = async () => {
//       const { data: { user } } = await supabase.auth.getUser()
//       if (user) {
//         setUserId(user.id)
        
//         // Fetch profile data
//         const { data, error } = await supabase
//           .from('profiles')
//           .select('*')
//           .eq('id', user.id)
//           .single()
        
//         if (error) {
//           console.error('Error fetching profile:', error)
//         } else {
//           setProfileData(data)
//           setEditForm({
//             firstname: data.username || '',
//             age: data.age || '',
//             gender: data.gender || '',
//             phone: data.phone_number || '',
//             organisation: data.organisation || '',
//             department: data.department || '',
//             role: data.role || ''
//           })
//         }
//       }
//     }
    
//     getUserAndProfile()
//   }, [])

    // Function to handle logout, which will involve making a request to the backend to destroy the session or token, and then updating the state accordingly, will go here
  const handleLogout = async () => {
        try {
          await axios.post('http://localhost:5000/api/auth/logout'); // Sending the logout request to the backend to destroy the session or token
            setUser(null); // After logging out, set the user state to null
            navigate('/login'); // Redirect to the login page after logging out
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

  const handleProfileUpdate = (updatedProfile) => {
    setProfileData(updatedProfile)
    setShowEditProfile(false)
    setIsEditing(false)
  }

//   const handleSaveProfile = async () => {
//     const { error } = await supabase
//       .from('profiles')
//       .update({
//         username: editForm.firstname,
//         age: editForm.age,
//         gender: editForm.gender,
//         phone_number: editForm.phone,
//         organisation: editForm.organisation,
//         department: editForm.department,
//         role: editForm.role
//       })
//       .eq('id', userId)

//     if (error) {
//       console.error('Error updating profile:', error)
//       alert('Error updating profile: ' + error.message)
//     } else {
//       setProfileData({
//         ...profileData,
//         username: editForm.firstname,
//         age: editForm.age,
//         gender: editForm.gender,
//         phone_number: editForm.phone,
//         organisation: editForm.organisation,
//         department: editForm.department,
//         role: editForm.role
//       })
//       setIsEditing(false)
//       setShowEditProfile(false)
//       alert('Profile updated successfully!')
//     }
//   }

  const navItems = [
    { label: 'Overview', component: <Overview /> },
    { label: 'Projects', component: <Projects /> },
    { label: 'Celebration Wall', component: <CelebrationWall /> }
  ]

  return (
    <div className="flex min-h-screen max-h-screen fixed bg-black w-full">
      {/* Sidebar */}
      <aside className="bg-black w-[20%] overflow-y-auto">
        {/* Header */}
        <div className="sdHeader flex items-center justify-center h-[10%] pt-6">
          <span className="text-[30px] font-heading font-bold text-white">MzansiBuilds</span>
        </div>
        
        {/* User Profile Section */}
        <div className="userProfile flex items-center justify-center flex-col border-b border-gray-700 pb-6">
          {/* Profile Initials Circle - Replaced the image with initials */}
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
        <div className="editProfileBtnContainer">
          <button onClick={() => setShowEditProfile(true)} className="text-white/30 cursor-pointer hover:scale-105">
            Edit Profile
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
      
      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="editProfileContainer fixed inset-0 bg-[rgba(0,0,0,0.7)] flex items-center justify-center z-50 overflow-y-auto" 
       style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
    <div className="closeProfileEdit w-[50vw] p-[24px] rounded-[16px] bg-black/90 relative max-h-[90vh] overflow-y-auto" 
         style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {/* Add this style to hide scrollbar in webkit browsers */}
      <style>
        {`
          .closeProfileEdit::-webkit-scrollbar {
            display: none;
          }
          .editProfileContainer::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
            <button 
              onClick={() => {
                setShowEditProfile(false)
                setIsEditing(false)
              }} 
              className="closeProfileBtn text-white/50 absolute top-4 right-6 p-[4px] rounded-full cursor-pointer hover:bg-[rgba(255,255,255,0.5)] hover:text-white"
            >
              X
            </button>
            <h2 className="editProfileTitle text-[30px] font-bold mb-[16px] text-center text-white">User Details</h2>
            
            <div className="profileForm flex flex-col gap-[12px]">
              {/* User's personal details */}
              <div className="personalDetails grid grid-cols-1 gap-2">
                <label className='userDetails_Label text-white'>Firstname: </label>
                <input 
                  type="text" 
                  placeholder="First Name" 
                  value={editForm.firstname || ''} 
                  onChange={e => setEditForm(prev => ({ ...prev, firstname: e.target.value }))}
                  className="p-2 rounded-md bg-gray-800 text-white border border-gray-600" 
                  disabled={!isEditing}
                />
                
                <label className='userDetails_Label text-white mt-2'>Age: </label>
                <input 
                  type="number" 
                  placeholder="Age" 
                  value={editForm.age || ''} 
                  onChange={e => setEditForm(prev => ({ ...prev, age: e.target.value }))}
                  className="p-2 rounded-md bg-gray-800 text-white border border-gray-600" 
                  disabled={!isEditing}
                />
                
                <label className='userDetails_Label text-white mt-2'>Gender: </label>
                <input 
                  type="text" 
                  placeholder="Gender" 
                  value={editForm.gender || ''} 
                  onChange={e => setEditForm(prev => ({ ...prev, gender: e.target.value }))}
                  className="p-2 rounded-md bg-gray-800 text-white border border-gray-600" 
                  disabled={!isEditing}
                />
                
                <label className='userDetails_Label text-white mt-2'>Phone: </label>
                <input 
                  type="tel" 
                  placeholder="Phone" 
                  value={editForm.phone || ''} 
                  onChange={e => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="p-2 rounded-md bg-gray-800 text-white border border-gray-600" 
                  disabled={!isEditing}
                />
                
                <label className='userDetails_Label text-white mt-2'>Organisation: </label>
                <input 
                  type="text" 
                  placeholder="Organisation" 
                  value={editForm.organisation || ''} 
                  onChange={e => setEditForm(prev => ({ ...prev, organisation: e.target.value }))}
                  className="p-2 rounded-md bg-gray-800 text-white border border-gray-600" 
                  disabled={!isEditing}
                />
                
                <label className='userDetails_Label text-white mt-2'>Department: </label>
                <input 
                  type="text" 
                  placeholder="Department" 
                  value={editForm.department || ''} 
                  onChange={e => setEditForm(prev => ({ ...prev, department: e.target.value }))}
                  className="p-2 rounded-md bg-gray-800 text-white border border-gray-600" 
                  disabled={!isEditing}
                />
                
                <label className='userDetails_Label text-white mt-2'>Role: </label>
                <input 
                  type="text" 
                  placeholder="Role" 
                  value={editForm.role || ''} 
                  onChange={e => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                  className="p-2 rounded-md bg-gray-800 text-white border border-gray-600" 
                  disabled={!isEditing}
                />
              </div>
              
              {/* Buttons to edit and save changes */}
              <div className="editProfile_Buttons flex gap-4 justify-end mt-6">
                <button 
                  onClick={() => setIsEditing(!isEditing)} 
                  className="px-6 py-2 bg-[#90ee90] rounded-md text-black font-semibold cursor-pointer hover:bg-[#00ff00] transition-all duration-300 hover:scale-105"
                >
                  {isEditing ? 'Editing...' : 'Edit'}
                </button>
                {isEditing && (
                  <button 
                    onClick={handleSaveProfile} 
                    className="px-6 py-2 bg-blue-500 rounded-md text-white font-semibold cursor-pointer hover:bg-blue-600 transition-all duration-300 hover:scale-105"
                  >
                    Save Changes
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard