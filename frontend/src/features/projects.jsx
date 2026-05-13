import React,{ useState, useEffect } from 'react'
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import ProjectForm from '../components/projectForm';
import ProjectDetails from '../components/projectDetails';
import { Link } from 'react-router-dom';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    projectUrl: '',
    completed: false
  });
  const [showForm, setShowForm] = useState(false);
  const [projectDetails, showProjectDetails] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null); // Add this state to store the selected project
  
  // Fetch all projects from the backend API when the component mounts
  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/projects/projects');
      setProjects(response.data);
      console.log('Fetched projects:', response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };
  
  useEffect(() => {
    fetchProjects();
  }, []);
  
  // Function to add a new project (for testing purposes)
  const addProject = async () => {
    try {
      const newProject = {
        title: 'New Project',
        description: 'This is a new project.',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        projectUrl: 'http://example.com',
        completed: false
      };
      const response = await axios.post('http://localhost:5000/api/projects/projects', newProject);
      setProjects([...projects, response.data]);
      fetchProjects();
      console.log('Project added:', response.data);
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  // Function to close the form when user clicks cancel, or after successfully adding/editing a project
  const handleCancelForm = () => {
    setShowForm(false);
    showProjectDetails(false);
    setSelectedProject(null); // Clear selected project when closing
  };
  
  // Function to handle "Read More" click
  const handleReadMore = (project) => {
    setSelectedProject(project); // Store the selected project
    showProjectDetails(true); // Show the details modal
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-black py-8 px-4">
      <div className="featureHeader text-center mb-12 border-b border-green-500/30 pb-6">
        <h1 className='featureTitle text-4xl md:text-5xl font-bold text-white mb-2'>My Projects</h1>
        <p className='featureSlogan text-green-200 text-lg'>Manage your projects and track their progress with milestones</p>
      </div>

      {projects.length === 0 ? (
        <div className="no-projects bg-white/10 backdrop-blur-sm rounded-2xl p-12 text-center max-w-md mx-auto border border-green-500/30">
          <p className="text-green-200 text-lg mb-6">You don't have any projects yet.</p>
          <button 
            className="btn-add bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2 mx-auto"
            onClick={() => {
              setShowForm(true)
            }}
          >
            <FaPlus /> New Project
          </button>
        </div>
      ) : (
        <>
        <div className="flex justify-end mb-6">
            <button className="btn-add bg-[#00ff00] text-white px-4 py-2 rounded-lg hover:scale-110 transition-colors font-semibold flex items-center gap-2 cursor-pointer"
              onClick={() => {
                setShowForm(true)
              }}>
              <FaPlus /> New Project
            </button>
          </div>
          <div className="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {projects.map(project => {
              return (
                <div key={project.id} className="project-card bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white mb-2">{project.title}</h2>
                    {project.completed && (
                      <div className='text-[#00ff00]'>completed</div>
                    )}
                    {!project.completed && (
                    <div className='text-[#ff4500]'>in progress</div>
                    )}
                  </div>
                  <p className="text-green-200 mb-2">{project.description.substring(0, 100)}{project.description.length > 100 ? '...' : ''}</p>
                  <p className="text-blue-500 underline mb-2">
                    <Link to={project.projecturl} target='_blank'>{project.projecturl}</Link>
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-300">Start Date: {project.startdate}</span>
                    <span className="text-sm text-green-300">End Date: {project.enddate}</span>
                  </div>
                  <div className="flex items-center justify-end">
                    <button onClick={() => handleReadMore(project)} className="bg-green-500 text-white p-1 rounded-lg mt-2 cursor-pointer transition-colors">
                      read more
                    </button>
                  </div>
                </div>
              );
            })}
            </div>
        </>
      )}
      {showForm && (
        <ProjectForm
          onCancel={handleCancelForm}
          setProjects={setProjects}
          projects={projects}
        />
      )}
      {projectDetails && selectedProject && (
        <ProjectDetails
          project={selectedProject}
          showProjectDetails={showProjectDetails}
          onCancel={handleCancelForm}
          fetchProjects={fetchProjects} // Pass the fetchProjects function to refresh the project list after editing/deleting
        />
      )}
    </div>
  )
}

export default Projects