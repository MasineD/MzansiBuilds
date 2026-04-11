import React, { useEffect, useState } from 'react'
import { SignUp, SignIn, Dashboard} from './pages'
import { Overview, Projects, CelebrationWall } from './pages'
import { Routes, Route, useNavigate } from 'react-router-dom'

const App = () => {
  const navigate = useNavigate()
  // Tokens for user session handling
  let [token, setToken] = useState(false)

  if(token){
    sessionStorage.setItem('token',JSON.stringify(token))
  }
  useEffect(()=>{
    if(sessionStorage.getItem('token')){
      let data = JSON.parse(sessionStorage.getItem('token'))
      setToken(data)
    }
  },[])

  return (
    <div>
      <Routes>
        {/* TODO:Change the default route to the main page */}
        <Route path="/" element={<div><h1>Welcome to Mzansi Builds</h1> <button onClick={()=>navigate('/signin')}>Get Started</button></div>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn setToken={setToken}/>} />
        {/* Protected routes, only accessible to authenticated users */}
        {token?<Route path="/dashboard" element={<Dashboard />}/>:''}
        {token?<Route path='/overview' element={<Overview />} />:''}
        {token?<Route path='/projects' element={<Projects />} />  :''}
        {token?<Route path='/celebration' element={<CelebrationWall />} />:''}  
      </Routes>
    </div>
  )
}

export default App
