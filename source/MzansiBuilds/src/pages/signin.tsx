// ===========A registration page, which facilitates user registration and login================
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { FaHome } from 'react-icons/fa';

export default function Signin(){
    // Hooks to assist with navigation
    const navigate = useNavigate();     //Navigating to the home page
    const goToHome = (path:string)=>{
        navigate(path)
    }
    // const [isLogin,setIsLogin] = useState(true);        //Toggling between sign-in and sign-up cards

    // Handling the user sign up
    const [fullname, setFullname ] = useState('');
    const [email, setEmail ] = useState('');
    const [password, setPassword ] = useState('');
    const [loading, setLoading ] = useState(true); 

    return(
        <div className="authContainer min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-white">        {/*Main container for the forms and buttons */}
            <div className="absolute inset-0" />

            <div className="relative z-10 w-full max-w-md bg-white rounded-lg p-5 text-black shadow-lg shadow-green-500/50">     {/*a container for the button */}
                <button className="homeButton flex items-center text-black/50 hover:text-black/90 mb-6 transition-colors hover:cursor-pointer" onClick={()=>goToHome('/')}>
                    <FaHome className="mr-2"/> Home
                </button>
                <form className="loginCard space-y-5">       {/*card heading */}
                    <div className="text-center mb-6">       
                        <h1 className="text-[35px] font-bold">Sign In</h1>
                    </div>
                    {/* ------------ Common fields across sign-in and sign-up card -----------*/}
                    <div className="emailField">
                        <label className="block text-sm mb-2">Email</label>
                        <input type="email" className="w-full px-4 py-3 border border-input rounded-lg" placeholder='example@gmail.com' required/>
                    </div>
                    <div className="passwordField">
                        <label className="block text-sm mb-2">Password</label>
                        <input type="password" className="w-full px-4 py-3 border border-input rounded-lg" placeholder='****************' required/>
                    </div>
                     <div className="forgotPasswordField">    {/* Link this to send email to the user */}
                        <a href='#' className='text-sm text-black/50 hover:underline hover:text-black'>
                            Forgot Password
                        </a>
                    </div>
                   {/* ----------- Footer section for the sign-in page ------------*/}
                    {/* TODO: Perform proper user-authentication without automatically navigating to the dashboard */}
                    <div>
                        <button onClick={() => navigate('/dashboard')} className="w-full text-white py-3 rounded-lg font-semibold bg-green-500 hover:cursor-pointer hover:bg-[#00ff00] hover:shadow-[4px_4px_10px_0px_#00ff00] transition-shadow duration-300 hover:scale-105">
                        Sign In
                    </button>
                    <p className="accountExistence">
                        Don't have an account?
                        <button className="underline hover:underline ml-1 text-blue-500 hover:cursor-pointer" onClick={()=>navigate('/signup')}>
                            Sign Up
                        </button>
                    </p>
                    </div>
                </form>
            </div>

        </div>
    )
}