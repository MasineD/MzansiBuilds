// ========Section about the service offered by MzansiBuilds==============

// The images used in this section
import celeb from "../images/celebration.jpg";
import collab from "../images/collaboration.jpg";
import proj from "../images/projectManagement.jpg";

// Array of details about the services offered
const services =[
     {   title:'Project Management',
        image: proj,
        description: 
            "Making it possible for users to track and update the progress of their projects effortlessly"
    },
     {   title:'Collaboration',
        image: collab,
        description: 
            "Exposing users to an environment where they can view what other developers are working on and ask for collaboration. This influences team work amongst developers, while learning from others."
    },
     {   title:'Celebration Wall',
        image: celeb,
        description: 
            "A space where developers can celebrate their achievement alongside other achievers."
    }
]

export default function Services(){
    return(
        <section id='servicesSection' className='py-24 px-4 sm:px-8 lg:px-16 bg-gradient-to-b from-black via-green-900/50 to-black'>
            <div className="max-w-7xl mx-auto">
                <div className="sectionIntro text-center mb-12">      {/*Introductory details to the section*/}
                    <h2 className="sectionHeading text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4 bg-gradient-to-r from-white to-green-400 bg-clip-text text-transparent">
                        Our Services
                    </h2>
                    <div className="w-20 h-1 bg-green-500 mx-auto rounded-full mb-6"></div>
                    <p className="miniDescription text-base sm:text-lg text-green-300 max-w-3xl mx-auto">
                        Keeping track of your projects, while collaborating with other developers
                    </p>
                </div>
                
                {/* Mapping the elements from the services array into individual cards */}
                <div className="cardContainer grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service,index) => (
                        <div key={index} className="serviceCard bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-green-500/30 hover:border-green-500 group">
                            <div className="relative overflow-hidden h-48">
                                <img 
                                    alt={service.title} 
                                    src={service.image} 
                                    className="serviceImage w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                            </div>
                            <div className="p-6">
                                <h3 className="serviceTitle text-xl font-bold text-center mb-3 text-white group-hover:text-green-400 transition-colors duration-300">
                                    {service.title}
                                </h3>
                                <div className="w-12 h-0.5 bg-green-500 mx-auto mb-4 rounded-full"></div>
                                <p className="serviceDescription text-center text-gray-300 leading-relaxed">
                                    {service.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}