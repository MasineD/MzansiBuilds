// ========== The footer section, containing extra details about the website and the developer=========

import { FaHandsHelping, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

// An array containing details for the footer section
const footerDetails = [
    {
        label:'Home',
        id:'homeSection'
    },
    {
        label:'About',
        id:'aboutSection'
    },
    {
        label:'Services',
        id:'servicesSection'
    },
    {
        label:'Contact Us',
        id:'contactSection'
    }
]
// Array of resources
const resources = [
    {
        label:'Documentation',
        link:""
    },
     {
        label:'Support',
        link:""
    }
]
// Array of the legal details
const legalDetials = [
    {
        label: 'Privacy Policy',
        link: "#"
    },
    {
        label: 'Terms of Service',
        link: "#"
    }
]

export default function Footer(){
    // Allowing the user to scroll to a section when clicking under Navigate
    const scrollToSection = (id) =>{
        const element = document.getElementById(id);    //Using the id to scroll to the section
        if (element) element.scrollIntoView({behavior:'smooth'});   //Allowing for smooth scroll
    }
    
    return(
        <footer className="bg-gradient-to-t from-black via-green-900 to-black py-16 mt-15 px-4 sm:px-8 lg:px-16">
            <div className="footerContainer max-w-7xl mx-auto">
                <div className="cardContainer grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
                    {/* Website Summary */}
                    <div className="websiteSummary space-y-4">
                        <div className="flex items-center space-x-2">
                            <span className="websiteName text-xl md:text-2xl font-heading font-bold bg-gradient-to-r from-white to-green-400 bg-clip-text text-transparent">
                                MzansiBuilds
                            </span>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">
                            Helping developers to build publicly, collaborate effectively, and celebrate achievements together.
                        </p>
                        <div className="flex gap-3 pt-2">
                            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center hover:bg-green-500/40 transition-colors cursor-pointer">
                                <FaTwitter className="w-4 h-4 text-green-400" />
                            </div>
                            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center hover:bg-green-500/40 transition-colors cursor-pointer">
                                <FaLinkedin className="w-4 h-4 text-green-400" />
                            </div>
                            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center hover:bg-green-500/40 transition-colors cursor-pointer">
                                <FaGithub className="w-4 h-4 text-green-400" />
                            </div>
                        </div>
                    </div>
                    
                    {/* Navigate Section */}
                    <div className="websiteSections">
                        <h5 className="text-lg font-semibold text-white mb-4 relative inline-block">
                            Navigate
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 rounded-full"></div>
                        </h5>
                        <ul className="space-y-3">
                            {footerDetails.map((item)=>(
                                <li key={item.id}>
                                    <button 
                                        className='text-sm text-gray-300 hover:text-green-400 transition-colors duration-300 cursor-pointer'
                                        onClick={()=>scrollToSection(item.id)}
                                    >
                                        {item.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Resources Section */}
                    <div className="resources">
                        <h5 className="text-lg font-semibold text-white mb-4 relative inline-block">
                            Resources
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 rounded-full"></div>
                        </h5>
                        <ul className="space-y-3">
                            {resources.map((item)=>(
                                <li key={item.label}>
                                    <a href={item.link} className="text-sm text-gray-300 hover:text-green-400 transition-colors duration-300">
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Legal Section */}
                    <div className="legal">
                        <h5 className="text-lg font-semibold text-white mb-4 relative inline-block">
                            Legal
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 rounded-full"></div>
                        </h5>
                        <ul className="space-y-3">
                            {legalDetials.map((item)=>(
                                <li key={item.label}>
                                    <a href={item.link} className="text-sm text-gray-300 hover:text-green-400 transition-colors duration-300">
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                
                {/* Copyright Section */}
                <div className="copyright pt-8 border-t border-green-500/30 text-center">
                    <p className="copyrightDetails text-sm text-gray-400 flex items-center justify-center gap-2">
                        © {new Date().getFullYear()} MzansiBuilds. All rights reserved. Built with{' '}
                        <FaHandsHelping className="text-green-400 inline-block w-4 h-4" />{' '}
                        for the developer community.
                    </p>
                </div>
            </div>
        </footer>
    )
}