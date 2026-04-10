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
        link: 'https://wa.me/27647266704"'
    }
]

export default function ContactUs(){
    return(
        <section id='contactSection' className='landingPage_Section mt-20'>
            <div className="">
                <div className="sectionIntro">      {/*Introductory details to the section*/}
                    <h2 className="sectionHeading">Contact Us</h2>
                    <p className="miniDescription">
                        Have questions? We would love to hear from you. Send us a message and we will respond as soon as possible.
                    </p>
                </div>
                {/* Mapping the elements from the developerDetails array into individual cards */}
                <div className="contactSection_Details flex flex-cols-2 gap-20 mx-[25%]">
                    <div className="sendMessage_field grid grid-rows-3 gap-2">
                        <div className="userDetails_ContactUs">
                            <label htmlFor="">Email:</label>
                            <input type="text" className="border border-black/50 ml-5 w-100 p-2 rounded-md" placeholder="youremailaddress@example.com"/>
                        </div>
                        <input type="text" className="border border-black/50 p-2 rounded-md" placeholder="Write your message here"/>
                        <button type='submit' className="w-20 h-8 bg-green-500 rounded-md cursor-pointer hover:scale-105 text-white hover:bg-[#00ff00] hover:shadow-[4px_4px_10px_0px_#00ff00] transition-shadow duration-300">Send</button>
                    </div>
                    <div className="cardContainer items-center justify-center grid grid-rows-3 gap-[2dvh]">
                        {/* TODO: Add icons from lucide */}
                        {developerDetails.map((detail,index) => (
                            <div key={index} className="contactDetailsCard border border-black/50 rounded-md p-2">
                                <a href={detail.link} target='_blank'>      {/*Wrapping details in a link tag,so the user can just click*/}
                                    <h4 className="contactPlatform">{detail.label}</h4>
                                    <p className="contactName">{detail.value}</p>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}