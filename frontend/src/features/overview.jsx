import React,{ useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import ProjectDetails from '../components/projectDetails';
import { MdFrontHand, MdMessage, MdNotifications, MdClose, MdPerson } from 'react-icons/md'
import CommentsModal from '../components/commentModal'

const Overview = () => {
  const [myProjects, setMyProjects] = useState([]);
  const [otherProjects, setOtherProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null); // Add this state to store the selected project
  const [projectDetails, showProjectDetails] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showComments, setShowComments] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  
  // Fetch projects that belong to the current user (owner + collaborator)
const fetchMyProjects = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/myprojects');  // This now includes collaborator projects
    setMyProjects(response.data);
  } catch (error) {
    console.error('Error fetching my projects:', error);
  }
};

// Fetch other projects from the backend (excluding user's own and collaborator projects)
const fetchOtherProjects = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/otherprojects');
    setOtherProjects(response.data);
  } catch (error) {
    console.error('Error fetching other projects:', error);
  }
};
  
  useEffect(() => {
    fetchMyProjects();
    fetchOtherProjects();
  }, []);

  // Function to view more project details
  const handleReadMore = (project) => {
    setSelectedProject(project); // Store the selected project
    showProjectDetails(true); // Show the details modal
  };
  const handleShowComments = (project) =>{
    setSelectedProject(project);
    setShowComments(true);
  }
  // Function to close the read more
  const handleCancelForm = () => {
    setShowForm(false);
    showProjectDetails(false);
    setSelectedProject(null); // Clear selected project when closing
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-black py-8 px-4">
      <div className="featureHeader text-center mb-12 border-b border-green-500/30 pb-6 sticky top-0 z-20 bg-transparent">
        <h1 className='featureTitle text-4xl md:text-5xl font-bold text-white mb-2'>Overview</h1>
        <p className='featureSlogan text-green-200 text-lg'>Browse and interact with all projects in the database</p>

        <div className="absolute top-0 right-0">
          <button onClick={()=>setShowNotifications(!showNotifications)} className="bg-white/10 backdrop-blur-sm p-2 rounded-full hover:bg-white/20 transition-colors relative cursor-pointer">
            <MdNotifications size={24} className="text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Notifications Dropdown */}
        {showNotifications && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setShowNotifications(false)}
            />
            
            {/* Notification Container */}
            <div className="absolute top-12 right-15 w-96 bg-white rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="bg-gradient-to-r from-green-700 to-green-900 p-4 flex justify-between items-center">
                <h3 className="text-white font-semibold">Notifications</h3>
                <div className="flex gap-2">
                  {unreadCount > 0 && (
                    <button
                      // onClick={markAllNotificationsAsRead}
                      className="text-xs text-green-200 hover:text-white transition-colors"
                    >
                      Mark all as read
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-white/70 hover:text-white hover:scale-110 transition-colors cursor-pointer"
                  >
                    <MdClose size={20} />
                  </button>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    No notifications yet
                  </div>
                ) : (
                  notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !notification.is_read ? 'bg-green-50' : ''
                      }`}
                      // onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          notification.type === 'comment' ? 'bg-blue-500' : 'bg-green-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">
                            {notification.type === 'comment' ? 'New Comment' : 'Collaboration Request'}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            Project: {notification.project_title}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {/* {formatNotificationDate(notification.created_at)} */}
                          </p>
                        </div>
                        {!notification.is_read && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

      {/* Projects container */}
      <div className="overview-content flex flex-col gap-2">
        {/* Left Side - Current User's Recent Projects (20% height) */}
        <div className="recent-projects-side h-[15%]">
          <div className="section-header mb-6">
            <h2 className='text-2xl font-semibold text-white mb-2'>My Projects</h2>
            <p className="text-green-300 text-sm mt-2">Your lastest 5 projects</p>
          </div>

          {myProjects.length === 0 ? (
            <div className="empty-state bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center border border-green-500/30">
              <p className="text-green-200">You haven't created any projects yet.</p>
            </div>
          ) : (
            <div className="relative h-full">
              {/* Horizontal carousel container with hidden scrollbar */}
              <div className="recent-projects-list flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory h-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <style>
                  {`.recent-projects-list::-webkit-scrollbar { display: none; }`}
                </style>
                {myProjects.map(project => {
                  return (
                    <div key={project.id} className="recent-project-card bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 w-[350px] flex-shrink-0 snap-start">
                      <div className="project-card-header">
                        <div className="flex items-center justify-between">
                          <h2 className="text-lg font-semibold text-gray-800">{project.title}</h2>
                          {project.completed && (
                            <div className='text-[#00ff00]'>completed</div>
                          )}
                          {!project.completed && (
                          <div className='text-[#ff4500]'>in progress</div>
                          )}
                        </div>
                      </div>
                      <div className="project-description">
                        <p className="project-description text-gray-600 text-sm mt-2">
                          {project.description}
                        </p>
                      </div>
                      <p className="project-url text-blue-500 font-[16px] underline"><Link to={project.projecturl} target='_black'>{project.projecturl}</Link></p>
                      <div className="project-meta grid grid-cols-2 gap-2 mt-3 text-xs text-gray-500">
                        {project.startdate && (
                          <span>📅 Started: {project.startdate}</span>
                        )}
                        {project.enddate && (
                          <span>📅 Ends: {project.enddate}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-end">
                        <button onClick={() => handleReadMore(project)} className="bg-green-500 text-white p-1 rounded-lg mt-2 cursor-pointer transition-colors">
                          read more
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
        
        {/* Right Side - ALL Projects from Database (Collaborate) - 80% height with grid layout */}
        <div className="community-projects-side" style={{ height: '80%', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style>
            {`.community-projects-side::-webkit-scrollbar { display: none; }`}
          </style>
          <div className="section-header mb-6">
            <h2 className='text-2xl font-semibold text-white mb-2'>Collaborate</h2>
            <span className="project-count text-sm text-green-300 block">Total Projects: {otherProjects.length}</span>
          </div>
          {otherProjects.length === 0 ? (
            <div className="empty-state bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center border border-green-500/30">
              <p className="text-green-200">No community projects available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherProjects.map(project => {
                return (
                  <div key={project.id} className="recent-project-card bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="project-owner-header">
                      <div className="mb-2 flex items-center justify-center">
                        <h3 className='text-lg font-semibold text-gray-800 flex items-center gap-2'>
                          <MdPerson /> 
                          {project.name}
                        </h3>
                        <p>{project.role}</p>
                      </div>
                    </div>
                    <div className="project-details">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">{project.title}</h2>
                        {project.completed && (
                          <div className='text-[#00ff00]'>completed</div>
                        )}
                        {!project.completed && (
                        <div className='text-[#ff4500]'>in progress</div>
                        )}
                      </div>
                      <p className="project-description text-gray-600 text-sm mt-2">
                        {project.description}
                      </p>
                    </div>
                    <p className="project-url text-blue-500 font-[16px] underline"><Link to={project.projecturl} target='_black'>{project.projecturl}</Link></p>
                    <div className="project-meta grid grid-cols-2 gap-2 mt-3 text-xs text-gray-500">
                      {project.startdate && (
                        <span>📅 Started: {project.startdate}</span>
                      )}
                      {project.enddate && (
                        <span>📅 Ends: {project.enddate}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={()=> handleShowComments(project)} className="btn-comment px-3 py-1.5 text-gray-700 rounded-lg text-sm cursor-pointer hover:scale-110 transition-colors flex items-center">
                        <MdMessage size={20}/>
                      </button>   
                      <button className='cursor-pointer hover:scale-110'>
                        <MdFrontHand /> 
                      </button>
                    </div>
                  </div>
                )
              })} 
            </div>
          )}
        </div>
      </div>
      {projectDetails && selectedProject && (
        <ProjectDetails
          project={selectedProject}
          showProjectDetails={showProjectDetails}
          onCancel={handleCancelForm}
          fetchProjects={fetchMyProjects} // Pass the fetchProjects function to refresh the project list after editing/deleting
        />
      )}
      {showComments && selectedProject &&(
        <CommentsModal
          project={selectedProject}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  )
}

export default Overview