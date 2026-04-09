// ========Section about the service offered by MiHealth==============

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
     {   title:' Celebration Wall',
        image: celeb,
        description: 
            "A space where developers can celebrate their achievement alongside other achievers."
    }
]

export default function Services(){
    return(
        <section id='servicesSection' className='landingPage_Section'>
            <div className="">
                <div className="sectionIntro">      {/*Introductory details to the section*/}
                    <h2 className="sectionHeading">Our Services</h2>
                    <p className="miniDescription">
                        Keeping track of your projects, while collaborating with other developers 
                    </p>
                </div>
                {/* Mapping the elements from the services array into individual cards */}
                <div className="cardContainer ml-30 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-20">
                    {services.map((service,index) => (
                        <div key={index} className="serviceCard border border-white/10 w-70 rounded-lg shadow-md p-4 text-center shadow-[8px_8px_20px_0px_#2563eb] 
                            hover:shadow-[8px_8px_20px_0px_#00ff00] transition-shadow duration-300">
                            <h3 className="serviceTitle text-xl font-bold text-center mb-2">{service.title}</h3>
                            <img alt={service.title} src={service.image} className="serviceImage mx-auto mb-4 w-100 h-35 rounded-lg"/>
                            <p className="serviceDescription text-center">{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
    