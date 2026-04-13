// =========The about section, containing details about MiHealth website=========
import "../index.css";
// The image used in this section
import aboutImage from "../images/aboutImage.jpg";

export default function About() {
    return(
        <section id='aboutSection' className="py-24 px-4 sm:px-8 lg:px-16 bg-gradient-to-b from-black via-green-900/50 to-black">
            <div className="max-w-7xl mx-auto">
                <div className="sectionIntro text-center mb-12">      {/*Introductory details to the section*/}
                    <h2 className="sectionHeading text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-4 bg-gradient-to-r from-white to-green-400 bg-clip-text text-transparent">
                        About
                    </h2>
                    <div className="w-20 h-1 bg-green-500 mx-auto rounded-full mb-6"></div>
                    <p className="miniDescription text-base sm:text-lg text-green-300 max-w-3xl mx-auto">
                        A digital platform that helps developers build publicly and keep up with what other developers are building. 
                    </p>
                </div>

                <div className="sectionDetails grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">     {/*mission statement and image separated into two columns */}
                        <h3 className="subsectionHeading text-2xl md:text-3xl font-semibold text-white">Our Mission</h3>
                        <p className="fullDescription text-gray-300 leading-relaxed">     {/*Full description about the website */}
                            MzansiBuilds is a digital platform dedicated to empower developers to build in the open by sharing their 
                            work transparently, staying informed on peers' ongoing projects, and seamlessly requesting collaboration
                            when an opportunity aligns with their skills. We believe that public development fosters accountability,
                            accelerates learning, and creates natural entry points for teamwork.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-green-300">Transparency</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-green-300">Collaboration</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-green-300">Innovation</span>
                            </div>
                        </div>
                    </div>
                    <div className="imageSection flex justify-center lg:justify-end">      {/*Container for the image*/}
                        <img 
                            src={aboutImage} 
                            alt='Developers collaborating on MzansiBuilds' 
                            className="rounded-[15px] w-full max-w-md lg:max-w-lg shadow-2xl border-2 border-green-500/30 hover:border-green-500 transition-all duration-300 hover:scale-105"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}