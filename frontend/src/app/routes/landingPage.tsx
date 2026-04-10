import Header from '../components/header';
import About from './about';
import Services from './services';
import Reviews from './reviews';
import ContactUs from './contactUs';
import Footer from '../components/footer';
import { useNavigate } from 'react-router';
import "../app.css";

// The images used in this page
import land from "../images/landingPage.jpg";

export default function LandingPage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen">
      < Header />
      
      {/* The Hero Section */}
      <section id="homeSection"className="landingPage_Section relative h-screen w-full flex items-center justify-center my-10">
        {/* <div className="absolute inset-0 bg-white text-black" /> */}
        <div className='flex flex-col-2 sm:gap-[3vw] md:gap-[5vw] lg:gap-[8vw]'>
            <div className="relative z-10 text-center text-black px-4">
            <h2 className="text-[70px] text-center font-heading font-bold mb-4">Build in Public,</h2>
            <p className="mb-8 max-w-2xl mx-auto text-center text-[40px]">Collaborate with Others</p>
            <button onClick={() => navigate('/userRegistration')} className="bg-green-500 text-white px-10 py-4 rounded-md text-lg font-medium hover:bg-[#00ff00] hover:shadow-[4px_4px_10px_0px_#00ff00] transition-shadow duration-300 hover:scale-105 hover:cursor-pointer">
                Get Started
            </button>
            </div>
            <div className="landingPage_Image">
                <img src={land} alt='Image for the landing page' className="rounded-[15px]"></img>
            </div>
        </div>
      </section>
      {/* Other sections of the landing page */}
      <About />
      <Services />
      <Reviews />
      <ContactUs />
      <Footer />
    </div>
  );
}