//============The testinomials section, containing customer feedback and reviews===========

// Constant details for customer reviews
// TODO: Replace constants with dynamic data
const reviews = [
    {
        name:'Sibongiseni Ndlovu',
        role:'Patient',
        rating: 5,
        text:'Since I started using MiHealth, I realised that not all illnesses require admission at a hospital. Through the AI-enhanced Diagnostics, I get homemade remedy suggestions, to cure short team illnesses like headache, running stomach, and flue.'
    },
    {
        name:'Dr. Amanda Smith',
        role:'Doctor',
        rating: 4,
        text:'This platform has helped me get more patients and revolutionized how I connect with them. It enabled me to fulfill my passion, allowing me to connect with other healthcare professionals and potential patients within the same platform. Th interface is intuitive. The security features give both me and my patients peace of mind '
    },
    {
        name:'MediClininc',
        role:'Hospital',
        rating: 5,
        text:'By referring some of our patients that normally suffer from short term and less-severe illnesses such as flu, tonsils and many more, we managed to reduce th number of patients coming to our facility for issues that they can solve on their own at home. This allowed us more time to focus on patients with more severe sicknesses'
    },
    {
        name:'Kopano Health',
        role:'Pharmacy',
        rating: 5,
        text:'By registering an account on this platform, we have managed to get and connect with more clients and other healthcare professionals. Our sales have also increased by a very good percentage.We would really recommend other companies to register an account.'
    }
]

export default function Reviews(){
    return(
        <section id='reviewsSection' className='landingPage_Section mt-20'>
            <div className="">
                <div className="sectionIntro">      {/*Introductory details to the section*/}
                    <h2 className="sectionHeading">Reviews</h2>
                    <p className="miniDescription">
                        What our users say about the platform.
                    </p>
                </div>
                {/* Mapping the elements from the services array into individual cards */}
                <div className="cardContainer grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 px-25">
                    {reviews.map((review,index) => (
                        <div key={index} className="reviewCard border border-white/10 w-70 rounded-lg shadow-md p-6 text-center shadow-[8px_8px_20px_0px_#2563eb] 
                            hover:shadow-[8px_8px_20px_0px_#00ff00] transition-shadow duration-300">
                            <div className="reviewRating text-yellow-400 text-[30px]">
                                 {/*TODO: Use a nice and neet icon for star */}
                                {Array.from({length : review.rating}).map((_,j)=>(
                                    <span key={j} className="rating">*</span>
                                ))}
                            </div>
                            <p className="reviewDescription">{review.text}</p>
                            <h4 className="reviewerName mt-2 border-t text-[20px] text-bold">{review.name}</h4>
                            <h5 className="reviewrRole">{review.role}</h5>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}