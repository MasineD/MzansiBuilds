// import React from 'react'
import { useState } from 'react';
import { supabase } from '../client';
import { Link } from 'react-router-dom';

const SignUp = () => {

  const [formData, setFormData ] = useState({     //Tracking the initial form data
    fullname: '',
    email: '',
    password: ''
  })
  console.log(formData);
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
      const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          fullname: formData.fullname
        }
      }
    })
    alert('User created successfully,check your email for confirmation link');
  } catch (error) {
    alert(error);
  }
  }

  return (
    <div>
        <form onSubmit={handleSubmit}>
          <input placeholder='Fullname' name='fullname' onChange={handleChange}
          />

          <input placeholder='Email' name='email' onChange={handleChange}
          />

          <input placeholder='Password' name='password' type='password' onChange={handleChange}
          />
          <button type='submit'>Sign Up</button>
          <p>Already have an account? <Link to='/signin'>Sign In</Link></p>
        </form>
    </div>
  )
}

export default SignUp
