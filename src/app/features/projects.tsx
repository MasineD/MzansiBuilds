// ===== Projects page, containing a list of all the project a user has=========
import { useState } from 'react';
import "../app.css";

const userProjects =[
    {
        title: 'Lorem ipsum',
        description: 'iwubfofffffffoi osnvlm wnf  peeeee vmmmmmm  sssssss vv eewk vkv kmvi sonso sknvkvv eovn',
        progress: '67',
        collaborators: '2',
        startDate: '14/04/2026',
        endDate: '25/04/2026',
    },
    {
        title: 'Lorem ipsum',
        description: 'iwubfofffffffoi osnvlm wnf  peeeee vmmmmmm  sssssss vv eewk vkv kmvi sonso sknvkvv eovn',
        progress: '67',
        collaborators: '2',
        startDate: '14/04/2026',
        endDate: '25/04/2026',
    },
    {
        title: 'Lorem ipsum',
        description: 'iwubfofffffffoi osnvlm wnf  peeeee vmmmmmm  sssssss vv eewk vkv kmvi sonso sknvkvv eovn',
        progress: '67',
        collaborators: '2',
        startDate: '14/04/2026',
        endDate: '25/04/2026',
    }
]

export default function Projects(){
const [isAddNewProject, setAddNewProject] = useState(false);

    return(
        <div className="projectsContainer bg-black/50 h-[100%]">
            <div className="featureHeader">
                <h2 className="featureTitle">Projects</h2>
                <p className="featureDescription">Keeping track of your projects.</p>
            </div>
            <div className="projectsContent">
                <div className="personalProjects">
                    <button onClick={() => setAddNewProject(true)}className="newProjectButton ml-[84%] mb-6 bg-green-500 p-2 rounded-md hover:bg-[#00ff00] hover:shadow-[4px_4px_10px_0px_#00ff00] transition-shadow duration-300 hover:scale-105 cursor-pointer">New Project</button>
                    {userProjects.map((userProj,index) => (
                        <div key={index} className="userProject border-b">
                            <div className="titleAndProgress flex items-end justify-between">
                                <h4 className="projectTitle font-bold">{userProj.title}</h4>
                                <h4 className="projectProgress">{userProj.progress}%</h4>
                            </div>
                            <p className="projectDescription">{userProj.description}</p>
                            <p className="projectMembers">Collaborators: {userProj.collaborators}</p>
                            <div className="projectDuration">
                                {userProj.startDate} - {userProj.endDate}
                            </div>
                            <button className="projectDetails text-[14px] text-white/50 underline cursor-pointer hover:scale-105">read more</button>
                            <div className="collaborationRequests flex gap-8 my-2">
                                <button className="inviteCollaborators bg-[#90ee90] text-black px-2 rounded-md cursor-pointer hover:scale-105">Invite Collaborators</button>
                                <button className="edtiProject bg-white/50 px-2 rounded-md cursor-pointer hover:scale-105">Edit</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isAddNewProject && (
                <div className="newProjectContainer fixed inset-0 bg-[rgba(0,0,0,0.7)] flex items-center justify-center z-50 overflow-y">
                    <div className="closeProfileEdit w-[50vw] p-[24px] rounded-[16px] bg-black/90 relative">
                        <button onClick={() => setAddNewProject(false)} className="closeProfileBtn text-white/50 absolute top-2 right-6 p-[4px] rounded-full
                        cursor-pointer hover:bg-[rgba(255,255,255,0.5)] hover:text-white">
                            X
                        </button>
                        <div className="newProjectDetails grid grid-cols-1 mt-4">
                            <div className="newDetail">
                                <label htmlFor="" className='projectTitle'>Title: </label>
                                <input type='text' className='newProjectDetail_Input'></input>
                            </div>
                            <div className="newDetail">
                                <label htmlFor="" className='projectDescription'>Description: </label>
                                <input type='text' className='newProjectDetail_Input'></input>
                            </div>
                            <div className="newDetail">
                                <label htmlFor="" className='projectMilestone'>Milestone: </label>
                                <input type='text' className='newProjectDetail_Input'></input>
                            </div>
                            <button className=" w-[10%] ml-[84%] bg-white/50 rounded-md hover:scale-105 cursor-pointer">Add</button>
                            <div className="newDetail">
                                <label htmlFor="" className='projectTitle'>Start Date: </label>
                                <input type='date' className='newProjectDetail_Input'></input>
                            </div>
                            <div className="newDetail">
                                <label htmlFor="" className='projectTitle'>End Date: </label>
                                <input type='date' className='newProjectDetail_Input'></input>
                            </div>
                        </div>
                        <button className="newProjectButton ml-[80%] mb-6 bg-green-500 p-2 rounded-md hover:bg-[#00ff00] hover:shadow-[4px_4px_10px_0px_#00ff00] transition-shadow duration-300 hover:scale-105 cursor-pointer">Add Project</button>
                    </div>
                </div>
            )}
        </div>
    )
}