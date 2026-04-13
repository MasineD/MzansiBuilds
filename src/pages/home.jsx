import React from 'react'
import { useNavigate } from 'react-router-dom'


const Home = () => {
  const navigate = useNavigate()

  return (
    <div>
        <h1>Welcome to MzansiBuilds application</h1>
        <button onClick={() => navigate('/login')}>Get Started</button>
    </div>
  )
}

export default Home
