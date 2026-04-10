// ========== The footer section, containing extra details about the website and the developer=========

// An array containing details for the footer section
const footerDetails = [
    {
        label:'About',
        id:'aboutSection'
    },
    {
        label:'Services',
        id:'servicesSection'
    },
    {
        label:'Reviews',
        id:'reviewsSection'
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
    // Allowing the user to scroll to a section when cliking under the Navigate
    const scrollToSection = (id:string) =>{
        const element = document.getElementById(id);    //Using the id to scroll to the section
        if (element) element.scrollIntoView({behavior:'smooth'});   //Allowing for smooth scroll
    }
    return(
        <footer className="landingPage_Section py-16 mt-15 sm:px-4 lg:px-18">
            <div className="footerContainer max-w-7xl mx-auto">
                <div className="cardContainer grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    <div className="websiteSummary space-y-4 border-r">
                        <div className="flex items-center space-x-2">
                            <span className="websiteName text-xl font-bold">MzansiBuilds</span>
                        </div>
                        <p className="text-sm">Helping developers to build publicly</p>
                    </div>
                    <div className="websiteSections border-r">       
                        <h5 className="mb-4">Navigate</h5>
                        <ul className="space-y-3">
                            {/*Mapping the elements of the constant array into individual list items */}
                            {footerDetails.map((item)=>(        
                                <li key={item.id}>
                                    <button className='text-sm cursor-pointer' onClick={()=>scrollToSection(item.id)}>
                                        {item.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="resources border-r">
                        <h5 className="mb-4">Resources</h5>
                        <ul className="space-y-3">
                            {resources.map((item)=>(
                                <li key={item.label}>
                                    <a href={item.link} className="text-sm">
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul> 
                    </div>
                    <div className="legal">
                        <h5 className="mb-4">Legal</h5>
                        <ul className="space-y-3">
                            {legalDetials.map((item)=>(
                                <li key={item.label}>
                                    <a href={item.link} className="text-sm">
                                        {item.label}
                                    </a>
                                </li>
                            ))}
                        </ul> 
                    </div>
                </div>
                <div className="copyright pt-8 border-t items-center justify-center">
                    <p className="copyrightDetails">
                        @{new Date().getFullYear()} MzansiBuilds. All rights reserved
                    </p>
                </div>
            </div>
        </footer>
    )
}