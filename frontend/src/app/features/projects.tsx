// ===== Projects page, containing a list of all the project a user has=========
import { useState } from 'react';
import "../app.css";

const userProjects =[
    {
        id: 1,
        title: 'Lorem ipsum',
        description: 'iwubfofffffffoi osnvlm wnf  peeeee vmmmmmm  sssssss vv eewk vkv kmvi sonso sknvkvv eovn',
        progress: '67',
        collaborators: [
            { name: 'John Doe', role: 'Frontend Developer', email: 'john@example.com' },
            { name: 'Jane Smith', role: 'Backend Developer', email: 'jane@example.com' }
        ],
        startDate: '14/04/2026',
        endDate: '25/04/2026',
        milestones: [
            { title: 'Project Setup', completed: true },
            { title: 'Database Design', completed: true },
            { title: 'API Development', completed: false },
            { title: 'Frontend Integration', completed: false },
            { title: 'Testing', completed: false }
        ]
    },
    {
        id: 2,
        title: 'Lorem ipsum',
        description: 'iwubfofffffffoi osnvlm wnf  peeeee vmmmmmm  sssssss vv eewk vkv kmvi sonso sknvkvv eovn',
        progress: '67',
        collaborators: [
            { name: 'Alice Johnson', role: 'UI/UX Designer', email: 'alice@example.com' }
        ],
        startDate: '14/04/2026',
        endDate: '25/04/2026',
        milestones: [
            { title: 'Research', completed: true },
            { title: 'Wireframing', completed: false },
            { title: 'Prototyping', completed: false }
        ]
    },
    {
        id: 3,
        title: 'Lorem ipsum',
        description: 'iwubfofffffffoi osnvlm wnf  peeeee vmmmmmm  sssssss vv eewk vkv kmvi sonso sknvkvv eovn',
        progress: '67',
        collaborators: [
            { name: 'Bob Wilson', role: 'Project Manager', email: 'bob@example.com' },
            { name: 'Carol Brown', role: 'QA Engineer', email: 'carol@example.com' }
        ],
        startDate: '14/04/2026',
        endDate: '25/04/2026',
        milestones: [
            { title: 'Requirements Gathering', completed: true },
            { title: 'System Design', completed: true },
            { title: 'Implementation', completed: false }
        ]
    },
    {
        id: 4,
        title: 'Lorem ipsum',
        description: 'iwubfofffffffoi osnvlm wnf  peeeee vmmmmmm  sssssss vv eewk vkv kmvi sonso sknvkvv eovn',
        progress: '67',
        collaborators: [
            { name: 'David Lee', role: 'DevOps Engineer', email: 'david@example.com' }
        ],
        startDate: '14/04/2026',
        endDate: '25/04/2026',
        milestones: [
            { title: 'Infrastructure Setup', completed: true },
            { title: 'Deployment Pipeline', completed: false }
        ]
    }
]

export default function Projects(){
    const [isAddNewProject, setAddNewProject] = useState(false);
    const [isReadMoreOpen, setIsReadMoreOpen] = useState(false);
    const [isInviteCollaboratorOpen, setIsInviteCollaboratorOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteMessage, setInviteMessage] = useState('');
    const [milestones, setMilestones] = useState(['']);
    const [editProjectData, setEditProjectData] = useState(null);

    const addMilestone = () => {
        setMilestones([...milestones, '']);
    };

    const updateMilestone = (index, value) => {
        const updatedMilestones = [...milestones];
        updatedMilestones[index] = value;
        setMilestones(updatedMilestones);
    };

    const deleteMilestone = (index) => {
        const updatedMilestones = milestones.filter((_, i) => i !== index);
        setMilestones(updatedMilestones);
    };

    const handleReadMore = (project) => {
        setSelectedProject(project);
        setIsReadMoreOpen(true);
        setIsEditMode(false);
    };

    const handleEditProject = () => {
        setEditProjectData({
            title: selectedProject.title,
            description: selectedProject.description,
            startDate: selectedProject.startDate,
            endDate: selectedProject.endDate,
            milestones: selectedProject.milestones.map(m => m.title)
        });
        setMilestones(selectedProject.milestones.map(m => m.title));
        setIsEditMode(true);
    };

    const handleSaveEdit = () => {
        // Here you would typically save the edited project data
        console.log('Saved project data:', editProjectData);
        setIsEditMode(false);
        setIsReadMoreOpen(false);
    };

    const handleSendInvite = () => {
        // Here you would typically send the email invitation
        console.log('Sending invite to:', inviteEmail, 'Message:', inviteMessage);
        setIsInviteCollaboratorOpen(false);
        setInviteEmail('');
        setInviteMessage('');
    };

    const toggleMilestoneComplete = (milestoneIndex) => {
        const updatedMilestones = [...selectedProject.milestones];
        updatedMilestones[milestoneIndex].completed = !updatedMilestones[milestoneIndex].completed;
        setSelectedProject({ ...selectedProject, milestones: updatedMilestones });
    };

    return(
        <div className="projectsContainer bg-black/50 h-[100%]">
            <div className="featureHeader">
                <h2 className="featureTitle">Projects</h2>
                <p className="featureDescription">Keeping track of your projects.</p>
            </div>
            <div className='projects h-[100%]'>
            <div className="projectsContent overflow-y-auto max-h-[calc(100vh-170px)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                <div className="personalProjects">
                    <button onClick={() => setAddNewProject(true)} className="newProjectButton ml-[84%] mb-6 bg-green-500 p-2 rounded-md hover:bg-[#00ff00] hover:shadow-[4px_4px_10px_0px_#00ff00] transition-shadow duration-300 hover:scale-105 cursor-pointer sticky top-0 z-10">New Project</button>
                    {userProjects.map((userProj,index) => (
                        <div key={index} className="userProject bg-black/50 mb-4 p-4 rounded-md border-b">
                            <div className="titleAndProgress flex items-end justify-between">
                                <h4 className="projectTitle font-bold">{userProj.title}</h4>
                                <h4 className="projectProgress">{userProj.progress}%</h4>
                            </div>
                            <p className="projectDescription">{userProj.description}</p>
                            <p className="projectMembers">Collaborators: {userProj.collaborators.length}</p>
                            <div className="projectDuration">
                                {userProj.startDate} - {userProj.endDate}
                            </div>
                            <button onClick={() => handleReadMore(userProj)} className="projectDetails text-[14px] text-white/50 underline cursor-pointer hover:scale-105">read more</button>
                            <div className="inviteCollaborator flex gap-8 my-2">
                                <button onClick={() => setIsInviteCollaboratorOpen(true)} className="inviteCollaborators bg-[#90ee90] text-black px-2 rounded-md cursor-pointer hover:scale-105">Invite Collaborator</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            </div>

            {/* Read More Modal */}
            {isReadMoreOpen && selectedProject && (
                <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] flex items-center justify-center z-50">
                    <div className="w-[60vw] max-h-[85vh] bg-black/90 relative flex flex-col">
                        <div className="sticky top-0 bg-black/90 z-10 pb-2 border-b border-white/20">
                            <button onClick={() => setIsReadMoreOpen(false)} className="closeProfileBtn text-white/50 absolute top-2 right-6 p-[4px] rounded-full
                            cursor-pointer hover:bg-[rgba(255,255,255,0.5)] hover:text-white">
                                X
                            </button>
                            <h3 className="text-white text-center text-2xl font-bold pt-4">{selectedProject.title}</h3>
                        </div>
                        
                        <div className="overflow-y-auto p-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                            {!isEditMode ? (
                                <>
                                    {/* Project Details */}
                                    <div className="mb-6">
                                        <h4 className="text-white font-bold text-lg mb-2">Description</h4>
                                        <p className="text-white/80">{selectedProject.description}</p>
                                    </div>

                                    <div className="mb-6">
                                        <h4 className="text-white font-bold text-lg mb-2">Timeline</h4>
                                        <p className="text-white/80">Start Date: {selectedProject.startDate}</p>
                                        <p className="text-white/80">End Date: {selectedProject.endDate}</p>
                                        <p className="text-white/80">Progress: {selectedProject.progress}%</p>
                                    </div>

                                    {/* Milestones */}
                                    <div className="mb-6">
                                        <h4 className="text-white font-bold text-lg mb-2">Milestones</h4>
                                        <div className="space-y-2">
                                            {selectedProject.milestones.map((milestone, idx) => (
                                                <div key={idx} className="flex items-center gap-3 p-2 bg-white/5 rounded-md">
                                                    <input
                                                        type="checkbox"
                                                        checked={milestone.completed}
                                                        onChange={() => toggleMilestoneComplete(idx)}
                                                        className="w-4 h-4 cursor-pointer"
                                                    />
                                                    <span className={`text-white/80 ${milestone.completed ? 'line-through text-white/50' : ''}`}>
                                                        {milestone.title}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Collaborators */}
                                    <div className="mb-6">
                                        <h4 className="text-white font-bold text-lg mb-2">Collaborators ({selectedProject.collaborators.length})</h4>
                                        <div className="space-y-2">
                                            {selectedProject.collaborators.map((collaborator, idx) => (
                                                <div key={idx} className="p-3 bg-white/5 rounded-md">
                                                    <p className="text-white font-semibold">{collaborator.name}</p>
                                                    <p className="text-white/60 text-sm">Role: {collaborator.role}</p>
                                                    <p className="text-white/60 text-sm">Email: {collaborator.email}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Edit Button */}
                                    <div className="flex justify-end">
                                        <button
                                            onClick={handleEditProject}
                                            className="editProjectBtn">
                                            Edit Project
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Edit Form */}
                                    <div className="space-y-4">
                                        <div className="newDetail">
                                            <label className='block text-white mb-1'>Title: </label>
                                            <input 
                                                type='text' 
                                                value={editProjectData.title}
                                                onChange={(e) => setEditProjectData({...editProjectData, title: e.target.value})}
                                                className='w-full p-2 rounded-md bg-white/10 text-white'
                                            />
                                        </div>
                                        
                                        <div className="newDetail">
                                            <label className='block text-white mb-1'>Description: </label>
                                            <textarea 
                                                value={editProjectData.description}
                                                onChange={(e) => setEditProjectData({...editProjectData, description: e.target.value})}
                                                className='w-full p-2 rounded-md bg-white/10 text-white' 
                                                rows="3"
                                            />
                                        </div>
                                        
                                        <div className="newDetail">
                                            <label className='block text-white mb-1'>Start Date: </label>
                                            <input 
                                                type='date' 
                                                value={editProjectData.startDate.split('/').reverse().join('-')}
                                                onChange={(e) => setEditProjectData({...editProjectData, startDate: e.target.value.split('-').reverse().join('/')})}
                                                className='w-full p-2 rounded-md bg-white/10 text-white'
                                            />
                                        </div>
                                        
                                        <div className="newDetail">
                                            <label className='block text-white mb-1'>End Date: </label>
                                            <input 
                                                type='date' 
                                                value={editProjectData.endDate.split('/').reverse().join('-')}
                                                onChange={(e) => setEditProjectData({...editProjectData, endDate: e.target.value.split('-').reverse().join('/')})}
                                                className='w-full p-2 rounded-md bg-white/10 text-white'
                                            />
                                        </div>

                                        {/* Edit Milestones */}
                                        <div className="milestonesSection">
                                            <div className="flex justify-between items-center mb-2">
                                                <label className='block text-white'>Milestones: </label>
                                                <button 
                                                    onClick={addMilestone}
                                                    className="bg-green-500 px-3 py-1 rounded-md hover:bg-[#00ff00] cursor-pointer text-sm">
                                                    Add Milestone
                                                </button>
                                            </div>
                                            {milestones.map((milestone, idx) => (
                                                <div key={idx} className="milestoneField mb-2 flex gap-2 items-center">
                                                    <input 
                                                        type='text' 
                                                        value={milestone}
                                                        onChange={(e) => updateMilestone(idx, e.target.value)}
                                                        placeholder={`Milestone ${idx + 1}`}
                                                        className='flex-1 p-2 rounded-md bg-white/10 text-white'
                                                    />
                                                    <button
                                                        onClick={() => deleteMilestone(idx)}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md cursor-pointer">
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex justify-end gap-3 mt-4">
                                            <button
                                                onClick={() => setIsEditMode(false)}
                                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md cursor-pointer">
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSaveEdit}
                                                className="bg-green-500 hover:bg-[#00ff00] text-white px-4 py-2 rounded-md cursor-pointer">
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Invite Collaborator Modal */}
            {isInviteCollaboratorOpen && (
                <div className="fixed inset-0 bg-[rgba(0,0,0,0.7)] flex items-center justify-center z-50">
                    <div className="w-[40vw] bg-black/90 relative">
                        <div className="sticky top-0 bg-black/90 z-10 pb-2 border-b border-white/20">
                            <button onClick={() => setIsInviteCollaboratorOpen(false)} className="closeProfileBtn text-white/50 absolute top-2 right-6 p-[4px] rounded-full
                            cursor-pointer hover:bg-[rgba(255,255,255,0.5)] hover:text-white">
                                X
                            </button>
                            <h3 className="text-white text-center text-2xl font-bold pt-4">Invite Collaborator</h3>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            <div className="newDetail">
                                <label className='block text-white mb-1'>Email Address: </label>
                                <input 
                                    type='email' 
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    placeholder="collaborator@example.com"
                                    className='w-full p-2 rounded-md bg-white/10 text-white'
                                />
                            </div>
                            
                            <div className="newDetail">
                                <label className='block text-white mb-1'>Message: </label>
                                <textarea 
                                    value={inviteMessage}
                                    onChange={(e) => setInviteMessage(e.target.value)}
                                    placeholder="Hi, I'd like to invite you to collaborate on this project..."
                                    className='w-full p-2 rounded-md bg-white/10 text-white' 
                                    rows="4"
                                />
                            </div>
                            
                            <button
                                onClick={handleSendInvite}
                                className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded-md cursor-pointer transition-colors duration-200">
                                Send Invitation
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* New Project Modal */}
            {isAddNewProject && (
                <div className="newProjectContainer fixed inset-0 bg-[rgba(0,0,0,0.7)] flex items-center justify-center z-50">
                    <div className="closeProfileEdit w-[50vw] max-h-[80vh] bg-black/90 relative flex flex-col">
                        <div className="sticky top-0 bg-black/90 z-10 pb-2 border-b border-white/20">
                            <button onClick={() => setAddNewProject(false)} className="closeProfileBtn text-white/50 absolute top-2 right-6 p-[4px] rounded-full
                            cursor-pointer hover:bg-[rgba(255,255,255,0.5)] hover:text-white">
                                X
                            </button>
                            <h3 className="text-white text-center text-2xl font-bold pt-4">New Project</h3>
                        </div>
                        
                        <div className="newProjectDetails grid grid-cols-1 gap-4 p-[24px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                            <div className="newDetail">
                                <label htmlFor="projectTitle" className='projectTitle block text-white mb-1'>Title: </label>
                                <input type='text' id="projectTitle" className='newProjectDetail_Input w-full p-2 rounded-md bg-white/10 text-white'></input>
                            </div>
                            <div className="newDetail">
                                <label htmlFor="projectDescription" className='projectDescription block text-white mb-1'>Description: </label>
                                <textarea id="projectDescription" className='newProjectDetail_Input w-full p-2 rounded-md bg-white/10 text-white' rows="3"></textarea>
                            </div>
                            
                            {/* Dynamic Milestone Fields */}
                            <div className="milestonesSection">
                                <div className="flex justify-between items-center mb-2">
                                    <label className='projectMilestone block text-white'>Milestones: </label>
                                    <button 
                                        onClick={addMilestone}
                                        className="bg-green-500 px-3 py-1 rounded-md hover:bg-green-600 cursor-pointer text-sm">
                                        Add Milestone
                                    </button>
                                </div>
                                {milestones.map((milestone, idx) => (
                                    <div key={idx} className="milestoneField mb-2 flex gap-2 items-center">
                                        <input 
                                            type='text' 
                                            value={milestone}
                                            onChange={(e) => updateMilestone(idx, e.target.value)}
                                            placeholder={`Milestone ${idx + 1}`}
                                            className='newProjectDetail_Input flex-1 p-2 rounded-md bg-white/10 text-white'
                                        />
                                        <button
                                            onClick={() => deleteMilestone(idx)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md cursor-pointer transition-colors duration-200"
                                            title="Delete milestone">
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="newDetail">
                                <label htmlFor="startDate" className='projectTitle block text-white mb-1'>Start Date: </label>
                                <input type='date' id="startDate" className='newProjectDetail_Input w-full p-2 rounded-md bg-white/10 text-white'></input>
                            </div>
                            <div className="newDetail">
                                <label htmlFor="endDate" className='projectTitle block text-white mb-1'>End Date: </label>
                                <input type='date' id="endDate" className='newProjectDetail_Input w-full p-2 rounded-md bg-white/10 text-white'></input>
                            </div>
                        </div>
                        
                        <div className="sticky bottom-0 bg-black/90 p-4 pt-0">
                            <button className="newProjectButton w-full bg-green-500 p-2 rounded-md hover:bg-[#00ff00] hover:shadow-[4px_4px_10px_0px_#00ff00] transition-shadow duration-300 hover:scale-105 cursor-pointer">
                                Add Project
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}