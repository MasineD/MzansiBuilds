// =========The contacts section,containing contact details of the developer=============

// A constant array of contact details
const developerDetails = [
    {
        label:'Email',
        value:'masinedonald@gmail.com',
        link: 'mailto:masinedonald@gmail.com'
    },
    {
        label:'LinkedIn',
        value:'Donald Masine',
        link: 'https://www.linkedin.com/in/donald-masine-17a430270/'
    },
    {
        label:'Whatsapp',
        value:'Main_Dee',
        link: 'https://wa.me/27647266704'
    }
]

export default function ContactUs(){
    return(
        <section id='contactSection' className='py-24 px-4 sm:px-8 lg:px-16 bg-gradient-to-b from-black via-green-900/50 to-black'>
            <div className="max-w-7xl mx-auto">
                <div className="sectionIntro text-center mb-12">      {/*Introductory details to the section*/}
                    <h2 className="sectionHeading text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4 bg-gradient-to-r from-white to-green-400 bg-clip-text text-transparent">
                        Contact Us
                    </h2>
                    <div className="w-20 h-1 bg-green-500 mx-auto rounded-full mb-6"></div>
                    <p className="miniDescription text-base sm:text-lg text-green-300 max-w-3xl mx-auto">
                        Have questions? We would love to hear from you. Send us a message and we will respond as soon as possible.
                    </p>
                </div>
                
                {/* Mapping the elements from the developerDetails array into individual cards */}
                <div className="contactSection_Details flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-center">
                    {/* Send Message Form */}
                    <div className="sendMessage_field flex-1 bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-green-500/30">
                        <h3 className="text-xl font-semibold text-white mb-4 text-center">Send us a message</h3>
                        <div className="space-y-4">
                            <div className="userDetails_ContactUs">
                                <label className="block text-green-300 text-sm font-medium mb-2">Email:</label>
                                <input 
                                    type="email" 
                                    className="w-full px-4 py-2 bg-gray-800 border border-green-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400" 
                                    placeholder="youremailaddress@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-green-300 text-sm font-medium mb-2">Message:</label>
                                <textarea 
                                    rows="4"
                                    className="w-full px-4 py-2 bg-gray-800 border border-green-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 resize-y" 
                                    placeholder="Write your message here..."
                                />
                            </div>
                            <button 
                                type='submit' 
                                className="w-full bg-green-600 text-white py-2 rounded-lg cursor-pointer hover:bg-green-700 hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] transition-all duration-300 hover:scale-105 font-medium"
                            >
                                Send Message
                            </button>
                        </div>
                    </div>
                    
                    {/* Contact Cards */}
                    <div className="cardContainer flex-1 space-y-4">
                        <h3 className="text-xl font-semibold text-white mb-4 text-center">Connect with us</h3>
                        {developerDetails.map((detail,index) => (
                            <div key={index} className="contactDetailsCard bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-green-500/30 hover:border-green-500 group">
                                <a href={detail.link} target='_blank' rel="noopener noreferrer" className="block">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="contactPlatform text-green-400 font-semibold text-lg group-hover:text-green-300 transition-colors">
                                                {detail.label}
                                            </h4>
                                            <p className="contactName text-gray-300 text-sm mt-1">
                                                {detail.value}
                                            </p>
                                        </div>
                                        <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center group-hover:bg-green-500/40 transition-colors">
                                            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}