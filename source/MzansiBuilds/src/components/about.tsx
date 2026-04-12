import React from 'react'

const About = () => {
  return (
    <section id='aboutSection' className=" landingPage_Section py-24 sm:px-8 lg:px-16">
            <div className="max-w-7xl mx-auto">
                <div className="sectionIntro">      {/*Introductory details to the section*/}
                    <h2 className="sectionHeading">About</h2>
                    <p className="miniDescription">
                        A digital platform that helps developers build publicly and keep up with what other developers are building. 
                    </p>
                </div>

                <div className="sectionDetails grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">     {/*mission statement and image separated into two columns */}
                        <h3 className="subsectionHeading text-2xl font-semibold">Our Mission</h3>
                        <p className="fullDescription">     {/*Full description about the website */}
                            MzansiBuilds is a digital platform dedicated to empower developers to build in the open by sharing their 
                            work transparently, staying informed on peers’ ongoing projects, and seamlessly requesting collaboration
                             when an opportunity aligns with their skills. We believe that public development fosters accountability,
                            accelerates learning, and creates natural entry points for teamwork
                        </p>
                    </div>
                    <div className="imageSection">      {/*Container for the image*/}
                            <img src='#' alt='Developers collaborating on MzansiBuilds' className="rounded-[15px]"/>
                        </div>
                </div>
            </div>
        </section>
  )
}

export default About
