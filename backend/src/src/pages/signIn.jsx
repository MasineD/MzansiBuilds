// import React from 'react'
import { useState } from 'react';
import { supabase } from '../client';
import { Link, useNavigate } from 'react-router-dom';

const SignIn = ({ setToken }) => {

    const navigate = useNavigate();         //Used to navigate to the dashboard after logging in

  const [formData, setFormData ] = useState({     //Tracking the initial form data
    email: '',
    password: ''
  })
  // Updating the form data synamically
  const handleChange = (event) =>{
    setFormData((prev)=>{
      return{
        ...prev,
        [event.target.name]:event.target.value
      }
    })
  }
  // Handling the form submission
  async function handleSubmit(event){
    event.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
      email: 'example@gmail.com',
      password: 'example'
    })
    setToken(data)      //Making only autheticated users be directed to the dashboard
    navigate('/dashboard')
  } catch (error) {
    alert(error);
  }
  }

  return (
    <div>
        <form onSubmit={handleSubmit}>
          <input placeholder='Email' name='email' onChange={handleChange}
          />

          <input placeholder='Password' name='password' type='password' onChange={handleChange}
          />
          <button type='submit'>Sign In</button>
          <p>Don't have an account? <Link to='/signup'>Sign Up</Link></p>
        </form>
    </div>
  )
}

export default SignIn
