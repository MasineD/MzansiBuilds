// ========= An overview page, providing a summary of the user's projects and other developers' projects===========
import { MdFrontHand } from 'react-icons/md';
import { useState } from 'react';
import "../app.css";

// The user's projects
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
// Projects that belong to other developers
const otherProjects =[
    {
        title: 'Lorem ipsum',
        description: 'iwubfofffffffoi osnvlm wnf  peeeee vmmmmmm  sssssss vv eewk vkv kmvi sonso sknvkvv eovn',
        progress: '67',
        startDate: '14/04/2026',
        endDate: '25/04/2026',
    },
    {
        title: 'Lorem ipsum',
        description: 'iwubfofffffffoi osnvlm wnf  peeeee vmmmmmm  sssssss vv eewk vkv kmvi sonso sknvkvv eovn',
        progress: '67',
        startDate: '14/04/2026',
        endDate: '25/04/2026',
    },
    {
        title: 'Lorem ipsum',
        description: 'iwubfofffffffoi osnvlm wnf  peeeee vmmmmmm  sssssss vv eewk vkv kmvi sonso sknvkvv eovn',
        progress: '67',
        startDate: '14/04/2026',
        endDate: '25/04/2026',
    },
    {
        title: 'Lorem ipsum',
        description: 'iwubfofffffffoi osnvlm wnf  peeeee vmmmmmm  sssssss vv eewk vkv kmvi sonso sknvkvv eovn',
        progress: '67',
        startDate: '14/04/2026',
        endDate: '25/04/2026',
    }
]
export default function Overview(){
    const [sendComment, showCommentSection] = useState(false);
    return(
        <div className="overviewContainer bg-black/50 h-[100%]">
            <div className="featureHeader">
                <h2 className="featureTitle">Overview</h2>
                <p className="featureDescription">Keeping track of your projects, while collaborating with other developers.</p>
            </div>
            <div className="overviewContent">
                {/* TODO: Enable scroll functionality along the y */}
                <ul className="personalProjects grid grid-cols-1 gap-6 overflow-y-auto max-h-[500px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    <h4 className="overviewSubtitle flex items-center justify-center text-[24px] underline sticky top-0 backdrop-blur-sm rounded-md z-10 py-2">My Projects</h4>
                    {userProjects.map((userProj,index) => (
                        <li key={index} className="userProject border border-1 border-white/50 p-4 rounded-md">
                            <div className="titleAndProgress flex items-end justify-between">
                                <h4 className="projectTitle font-bold">{userProj.title}</h4>
                                <h4 className="projectProgress">{userProj.progress}%</h4>
                            </div>
                            <p className="projectDes">{userProj.description}</p>
                            <p className="projectMembers">Collaborators: {userProj.collaborators}</p>
                            <div className="projectDuration">
                                {userProj.startDate} - {userProj.endDate}
                            </div>
                            <button className="projectDetails text-[14px] text-white/50 underline cursor-pointer hover:scale-105">read more</button>
                        </li>
                    ))}
                </ul>
                {/* TODO: Enable scroll functionality along the y */}
                <div className="otherProjects grid grid-cols-1 gap-4 overflow-y-auto max-h-[500px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] mr-20">
                    <h4 className="overviewSubtitle flex items-center justify-center text-[24px] underline sticky top-0 backdrop-blur-sm rounded-md z-10 py-2">Collaborate</h4>
                    {otherProjects.map((project,index) => (
                        <div key={index} className="otherProject border-b">
                            <div className="titleAndProgress flex items-end justify-between">
                                <h4 className="projectTitle font-bold">{project.title}</h4>
                                <h4 className="projectProgress">{project.progress}%</h4>
                            </div>
                            <p className="projectDescription">{project.description}</p>
                            <div className="projectDuration">
                                {project.startDate} - {project.endDate}
                            </div>
                            <input type='text' placeholder='Write your comment here' className='border border-white/50 px-1 rounded-md'></input>
                            <div onClick={()=> showCommentSection(true) }className="collaborationRequest flex gap-8 my-2">
                                <button className="commentButton text-white bg-white/50 rounded-md cursor-pointer hover:scale-105 px-2">Comment</button>
                                <button className="raiseHand cursor-pointer hover:scale-150"><MdFrontHand/></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}