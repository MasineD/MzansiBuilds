import Header from '../components/header';
import About from '../routes/about';
import Services from '../routes/services';
import Reviews from '../routes/reviews';
import ContactUs from '../routes/contactUs';
import Footer from '../components/footer';
import { useNavigate } from 'react-router';
import "../app.css";

export default function LandingPage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen">
      < Header />
      
      {/* The Hero Section */}
      <section id="homeSection"className="landingPage_Section relative h-screen w-full flex items-center justify-center">
        {/* <div className="absolute inset-0 bg-white text-black" /> */}
        <div className='flex flex-col-2 sm:gap-10 md:gap-35 lg:gap-[18vw]'>
            <div className="relative z-10 text-center text-black px-4">
            <h2 className="text-[70px] text-center font-heading font-bold mb-4">Build in Public,</h2>
            <p className="mb-8 max-w-2xl mx-auto text-center text-[40px]">Collaborate with Others</p>
            <button onClick={() => navigate('/login')} className="bg-green-500 text-white px-10 py-4 rounded-md text-lg font-medium hover:bg-primary/90 transition-all hover:scale-105 hover:cursor-pointer">
                Get Started
            </button>
            </div>
            <div className="landingPage_Image">
                <img src='#' alt='Image for the landing page'></img>
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