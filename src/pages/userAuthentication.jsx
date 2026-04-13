import React,{ useState, useEffect } from 'react'
import supabase from '../client'
// import Dashboard from './dashboard'

const UserAuthentication = ({setToken}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [user, setUser] = useState(null)

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
      {/* <Dashboard
        username={user.session.user.user_metadata.username}
        email={user.session.user.email}
        onLogout={handleLogout}
      />  */}
      not logged in
    </div>
  ):(
    <>
    <div>
      {!isLogin && (
        <div className="signupContainer">
          <h1>Sign Up</h1>
          <input onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username" />
          <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" />
          <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
          <button onClick={handleSignUp}>Sign Up</button>
          <p>Already have an account? <button onClick={()=> setIsLogin(true)}>Sign In</button></p>
      </div>
      )}
      
      {isLogin && (
        <div className="loginContainer">
          <h1>Login</h1>
          <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" />
          <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
          <button onClick={handleLogin}>Login</button>
          <p>Don't have an account? <button onClick={()=> setIsLogin(false)}>Sign Up</button></p>
      </div>
      )}
    </div>
    </>
  );
}

export default UserAuthentication