import React,{ useState, useEffect } from 'react'
import supabase from '../client'
import Dashboard from './dashboard'
import { Link } from 'react-router-dom'
import { FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'
import '../index.css'

const UserAuthentication = ({setToken}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [user, setUser] = useState(null)

    // Allowing the user to navigate to the home page when they click on the home button
    const navigate = useNavigate()

  // Checking if the user wants to login or register
  const [isLogin, setIsLogin ] = useState(true);
  
  // Check if user is already logged in
  useEffect(() => {
    async function checkUser() {
      const { data, error} = await supabase.auth.getSession()
      setUser(data)
      if (data?.session) {
        setToken(true)
      }
    }
    checkUser();
  }, [setToken])

  // Function to handle user sign up
  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        }
      }
    })
    if (error) {
      alert('Error signing up:', error.message)
    } else {
      setUser(data);
      setToken(true);
      alert('User signed up successfully! Profile created automatically.')
    }
  }

  // Function to handle user login
  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password :password,
    })
    if (error) {
      alert('Error logging in:', error.message)
    } else {
      setUser(data);
      setToken(true);
    }
  }
  
  // function to handle user logout
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      alert('Error logging out:', error.message)
    } else {
      setUser(null)
      setToken(false)
    }
  }

  return user?.session != null ? (
    <div>
      <Dashboard
        username={user.session.user.user_metadata.username}
        email={user.session.user.email}
        onLogout={handleLogout}
      /> 
    </div>
  ):(
    <>
    <div className='flex items-center justify-center py-[22dvh]'>
      {!isLogin && (
        <div className="authContainer ">
            <button className="homeButton flex items-center text-black/50 hover:text-black/90 mr-80 transition-colors hover:cursor-pointer" onClick={()=>navigate('/')}>
                <FaHome className="mr-2"/> Home
            </button>
            <h1 className='authHeader'>Sign Up</h1>
            <input className='authInput' onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username" />
            <input className='authInput' onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" />
            <input className='authInput' onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
            <button className='authButton' onClick={handleSignUp}>Sign Up</button>
            <p>Already have an account? <button className='authLink' onClick={()=> setIsLogin(true)}>Sign In</button></p>
      </div>
      )}
      
      {isLogin && (
        <div className="authContainer ">
            <button className="homeButton flex items-center text-black/50 hover:text-black/90 mr-80 transition-colors hover:cursor-pointer" onClick={()=>navigate('/')}>
                <FaHome className="mr-2"/> Home
            </button>
            <h1 className='authHeader'>Sign In</h1>
            <input className='authInput' onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" />
            <input className='authInput' onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
            <p className='pr-65 my-4 text-black/50 hover:text-black hover:underline transition-colors'><Link>forgot password?</Link></p>
            <button className='authButton' onClick={handleLogin}>Login</button>
            <p>Don't have an account? <button className='authLink' onClick={()=> setIsLogin(false)}>Sign Up</button></p>
      </div>
      )}
    </div>
    </>
  );
}

export default UserAuthentication