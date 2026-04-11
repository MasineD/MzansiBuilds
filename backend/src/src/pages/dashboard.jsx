import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'

const Dashboard = () => {
    let navigate = useNavigate()
    function handleLogout(){
    sessionStorage.removeItem('token')
    navigate('/')
  }
  return (
    <div>
     <p> Dashboard</p>
     <Link to='/overview'>Overview</Link>
     <Link to='/projects'>Projects</Link>
     <Link to='/celebration'>Celebration Wall</Link>
     <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Dashboard
