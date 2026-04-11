// ===========A registration page, which facilitates user registration and login================
import "../app.css";
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { FaHome } from 'react-icons/fa';
import { supabase } from "./supabaseClient";     //Importing the supabase client to perform user authentication

export default function Signup(){
    // Hooks to assist with navigation
    const navigate = useNavigate();     //Navigating to the home page
    const goToHome = (path:string)=>{
        navigate(path)
    }

    // Handling the user sign up
    // const [fullname, setFullname ] = useState('');
    // const [email, setEmail ] = useState('');
    // const [password, setPassword ] = useState('');
    // const [loading, setLoading ] = useState(true); 

    const [formData, setFormData ] = useState({     //Tracking the initial form data
        fullname: '',
        email: '',
        password: ''
  })
  // Updating the form data dynamically
  const handleChange = (event) =>{
    setFormData((prev)=>{
      return{
        ...prev,
        [event.target.name]:event.target.value
      }
    })
  }
  // Handling the form submission
  async function handleSubmit(event) {
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

    return(
        <div className="authContainer min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-white">        {/*Main container for the forms and buttons */}
            <div className="absolute inset-0" />

            <div className="relative z-10 w-full max-w-md bg-white rounded-lg p-5 text-black shadow-lg shadow-green-500/50">     {/*a container for the button */}
                <button className="homeButton flex items-center text-black/50 hover:text-black/90 mb-6 transition-colors hover:cursor-pointer" onClick={()=>goToHome('/')}>
                    <FaHome className="mr-2"/> Home
                </button>
                <form onSubmit={handleSubmit} className="loginCard space-y-5">       {/*card heading */}
                    <div className="text-center mb-6">       
                        <h1 className="text-[35px] font-bold">Sign Up</h1>
                    </div>
                    {/*-------- Fields for the sign-up card ---------*/}
                    <div className="fullName">
                        <label className="block text-sm mb-2">Fullname</label>
                        <input type="text" name='Fullname' onChange={handleChange} className="w-full px-4 py-3  border rounded-lg" placeholder='Sibusiso Ndlomo' required />
                    </div>
                    {/* ------------ Common fields across sign-in and sign-up card -----------*/}
                    <div className="emailField">
                        <label className="block text-sm mb-2">Email</label>
                        <input type="email" name='Email' onChange={handleChange} className="w-full px-4 py-3 border border-input rounded-lg" placeholder='example@gmail.com' required/>
                    </div>
                    <div className="passwordField">
                        <label className="block text-sm mb-2">Password</label>
                        <input type="password" name='Password' onChange={handleChange} className="w-full px-4 py-3 border border-input rounded-lg" placeholder='****************' required/>
                    </div>
                    {/*------------- Footer section for the sign up -----------*/}
                    <div>
                        <button type='submit' className="w-full text-white py-3 rounded-lg font-semibold bg-green-500 hover:cursor-pointer hover:bg-[#00ff00] hover:shadow-[4px_4px_10px_0px_#00ff00] transition-shadow duration-300 hover:scale-105">
                        Sign Up
                    </button>
                    <p className="accountExistence">
                        Already have an account?
                        <button className="underline hover:underline ml-1 text-blue-500 hover:cursor-pointer" onClick={()=>navigate('/signin')}>
                            Sign In
                        </button>
                    </p>
                    </div>
                </form>
            </div>

        </div>
    )
}