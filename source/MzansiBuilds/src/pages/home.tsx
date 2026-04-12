import React from 'react'
import Navbar from '../components/navbar';
import About from '../components/about';
import Services from '../components/services';
import ContactUs from '../components/contactUs';
import Footer from '../components/footer';
import { useNavigate } from 'react-router';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div className='landingSection grid grid-col-2 sm:gap-[3vw] md:gap-[5vw] lg:gap-[8vw]'>
        <div className="slogan">
            <div className="sloganContainer">
                <h2 className="text-[70px] text-center font-heading font-bold mb-4">Build in Public,</h2>
                <p className="mb-8 max-w-2xl mx-auto text-center text-[40px]">Collaborate with Others</p>
            </div>
            <button onClick={() => navigate('/signin')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
              Get Started
            </button>
        </div>
        <div className="sloganImage">
            <img src='#' alt='landing page image'/>
        </div>
      </div>
      <About />
      <Services />
      <ContactUs />
      <Footer />
    </div>
  )
}

export default Home
