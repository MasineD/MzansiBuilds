import { useNavigate, Link } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import supabase from '../client'
import EditProfile from '../components/editProfile'
import '../index.css'

const Dashboard = ({ username, email, onLogout }) => {
//   const navigate = useNavigate();
    const navigate = useNavigate()
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [profileData, setProfileData] = useState(null)
  const [userId, setUserId] = useState(null)

  // Get current user ID and fetch profile
  useEffect(() => {
    const getUserAndProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        
        // Fetch profile data
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (error) {
          console.error('Error fetching profile:', error)
        } else {
          setProfileData(data)
        }
      }
    }
    
    getUserAndProfile()
  }, [])

  const handleProfileUpdate = (updatedProfile) => {
    setProfileData(updatedProfile)
    setShowEditProfile(false)
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header bg-green-500">
        <h1>Welcome <br /> <span>{username}</span></h1>
        <button onClick={onLogout}>Logout</button>
        <Link to='/overview'>Overview</Link>
        <Link to='/projects'>Projects</Link>
        <Link to='/celebration-wall'>Celebration Wall</Link>
      </div>
      
      <div className="dashboard-info">
        <h3>Your Information</h3>
        <p><strong>Email:</strong> {email} (unchangeable)</p>
        <p><strong>Username:</strong> {username}</p>
        
        {profileData && (
          <>
            <p><strong>Age:</strong> {profileData.age || 'Not provided'}</p>
            <p><strong>Gender:</strong> {profileData.gender || 'Not provided'}</p>
            <p><strong>Phone Number:</strong> {profileData.phone_number || 'Not provided'}</p>
            <p><strong>Organisation:</strong> {profileData.organisation || 'Not provided'}</p>
            <p><strong>Department:</strong> {profileData.department || 'Not provided'}</p>
            <p><strong>Role:</strong> {profileData.role || 'Not provided'}</p>
          </>
        )}
        
        <button onClick={() => setShowEditProfile(!showEditProfile)}>
          {showEditProfile ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>
      
      {showEditProfile && (
        <EditProfile 
          userId={userId}
          onProfileUpdate={handleProfileUpdate}
          onCancel={() => setShowEditProfile(false)}
        />
      )}
    </div>
  )
}

export default Dashboard