import Header from '../components/header';
import About from '../components/about';
import Services from '../components/services';
import ContactUs from '../components/contactUs';
import Footer from '../components/footer';
import { useNavigate } from 'react-router-dom';
import "../index.css";

// The images used in this page
import land from "../images/landingPage.jpg";

export default function Home() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-green-900 to-black">
      <Header />
      
      {/* The Hero Section */}
      <section id="homeSection" className="landingPage_Section relative min-h-screen w-full flex items-center justify-center py-20">
        <div className='flex flex-col lg:flex-row items-center justify-center sm:gap-[3vw] md:gap-[5vw] lg:gap-[8vw] px-4'>
          <div className="relative z-10 text-center lg:text-left px-4 max-w-2xl">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-heading font-bold mb-4 bg-gradient-to-r from-white to-green-400 bg-clip-text text-transparent">
              Build in Public,
            </h2>
            <p className="mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-[40px] text-green-300">
              Collaborate with Others
            </p>
            <p className="mb-6 text-base sm:text-lg text-gray-300 max-w-xl">
              Join a community of innovators, developers, and creators sharing their journey, 
              getting real-time feedback, and building amazing projects together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={() => navigate('/login')} 
                className="bg-green-600 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-md text-base sm:text-lg font-medium hover:bg-green-700 hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] transition-all duration-300 hover:scale-105 hover:cursor-pointer"
              >
                Get Started
              </button>
              <button 
                onClick={() => {
                  const el = document.getElementById('aboutSection');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }} 
                className="bg-transparent border-2 border-green-500 text-green-400 px-8 sm:px-10 py-3 sm:py-4 rounded-md text-base sm:text-lg font-medium hover:bg-green-600 hover:text-white hover:border-green-600 transition-all duration-300 hover:scale-105 hover:cursor-pointer"
              >
                Learn More
              </button>
            </div>
          </div>
          <div className="landingPage_Image mt-10 lg:mt-0">
            <img 
              src={land} 
              alt='Image for the landing page' 
              className="rounded-[15px] w-full max-w-lg md:max-w-xl lg:max-w-2xl shadow-2xl border-2 border-green-500/30 hover:border-green-500 transition-all duration-300 hover:scale-105"
            />
          </div>
        </div>
      </section>
      
      {/* Other sections of the landing page */}
      <About />
      <Services />
      <ContactUs />
      <Footer />
    </div>
  );
}