import { supabase } from '../client';
import React, { useState, useEffect } from 'react'

const Projects = () => {
  // List of projects from the database
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // State for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // State for modals
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [])

  // Fetching the projects from the database
  async function fetchProjects() {
    const { data, error } = await supabase.from('Project').select('*').order('created_at', { ascending: false });
    if (error) {
      alert(error.message)
    } else {
      setProjects(data);
    }
  }

  // Handling the form submission for adding a new project
  async function handleSubmit() {
    if (!title.trim()) {
      alert('Please enter a project title');
      return;
    }
    
    if (isEditing && editingId) {
      // Update existing project
      await editProject(editingId);
    } else {
      // Create new project
      const { error } = await supabase.from("Project").insert([{ title, description, startDate, endDate }]);
      if (error) {
        alert(error.message)
      } else {
        clearForm();
        setShowProjectForm(false);
        fetchProjects();
      }
    }
  }

  // Functionality to update or edit a project
  async function editProject(id) {
    const { error } = await supabase
      .from("Project")
      .update({ 
        title, 
        description, 
        startDate, 
        endDate 
      })
      .eq('id', id);
    
    if (error) {
      alert(error.message);
    } else {
      clearForm();
      setIsEditing(false);
      setEditingId(null);
      setShowProjectForm(false);
      fetchProjects();
      // If the edited project is currently open in details view, update it
      if (selectedProject && selectedProject.id === id) {
        const updatedProject = projects.find(p => p.id === id);
        setSelectedProject(updatedProject);
      }
    }
  }

  // Function to populate form with project data for editing
  function startEditing(project) {
    setTitle(project.title);
    setDescription(project.description);
    setStartDate(project.startDate);
    setEndDate(project.endDate);
    setIsEditing(true);
    setEditingId(project.id);
    // Close the details view when editing starts
    setShowDetails(false);
    setSelectedProject(null);
    // Open the project form modal
    setShowProjectForm(true);
  }

  // Function to cancel editing
  function cancelEditing() {
    clearForm();
    setIsEditing(false);
    setEditingId(null);
    setShowProjectForm(false);
  }

  // Function to clear form
  function clearForm() {
    setTitle('');
    setDescription('');
    setStartDate('');
    setEndDate('');
  }

  // Function to open new project form
  function openNewProjectForm() {
    clearForm();
    setIsEditing(false);
    setEditingId(null);
    setShowProjectForm(true);
  }

  // Functionality to complete a project
  async function completeProject(id) {
    const { error } = await supabase.from("Project").update({ completed: true }).eq('id', id);
    if (error) {
      alert(error.message);
    } else {
      fetchProjects();
      // Close details view if the completed project was open
      if (selectedProject && selectedProject.id === id) {
        setShowDetails(false);
        setSelectedProject(null);
      }
    }
  }

  // Functionality to delete a project
  async function deleteProject(id) {
    const { error } = await supabase.from("Project").delete().eq('id', id);
    if (error) {
      alert(error.message);
    } else {
      fetchProjects();
      // Close details view if the deleted project was open
      if (selectedProject && selectedProject.id === id) {
        setShowDetails(false);
        setSelectedProject(null);
      }
    }
  }

  // Function to open project details
  function openProjectDetails(project) {
    setSelectedProject(project);
    setShowDetails(true);
  }

  // Function to close project details
  function closeProjectDetails() {
    setShowDetails(false);
    setSelectedProject(null);
  }

  return (
    <div>
      <h2 className="featureName">Projects</h2>
      
      {/* Only the New Project button on main page */}
      <div className="new-project-button-container">
        <button className="new-project-btn" onClick={openNewProjectForm}>
          + New Project
        </button>
      </div>

      <h2>Incompleted Projects</h2>
      <div className="incomplete">
        {projects.filter(proj => !proj.completed).map((proj) => (
          <div key={proj.id} className="project">
            <h3>{proj.title}</h3>
            <p>{proj.description}</p>
            <div className="projectDuration">
              {proj.startDate} - {proj.endDate}
            </div>
            <div className="collaborationBtns">
              <button onClick={() => openProjectDetails(proj)}>Read more</button>
            </div>
          </div>
        ))}
      </div>

      <h2>Completed Projects</h2>
      <div className="completed">
        {projects.filter(proj => proj.completed).map((proj) => (
          <div key={proj.id} className="project">
            <h3>{proj.title}</h3>
            <p>{proj.description}</p>
            <div className="projectDuration">
              {proj.startDate} - {proj.endDate}
            </div>
            <div className="collaborationBtns">
              <button onClick={() => openProjectDetails(proj)}>Read more</button>
            </div>
          </div>
        ))}
      </div>

      {/* Project Form Modal (for both new and edit) */}
      {showProjectForm && (
        <div className="modal-overlay" onClick={() => setShowProjectForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isEditing ? 'Edit Project' : 'Create New Project'}</h2>
              <button className="close-button" onClick={() => setShowProjectForm(false)}>×</button>
            </div>
            
            <div className="project-form">
              <div className="form-group">
                <label>Title *</label>
                <input 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  placeholder='Enter project title' 
                  type="text" 
                  autoFocus
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  placeholder='Enter project description'
                  rows="4"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input 
                    value={startDate} 
                    onChange={e => setStartDate(e.target.value)} 
                    type="date" 
                  />
                </div>
                
                <div className="form-group">
                  <label>End Date</label>
                  <input 
                    value={endDate} 
                    onChange={e => setEndDate(e.target.value)} 
                    type="date" 
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button className="cancel-btn" onClick={cancelEditing}>
                  Cancel
                </button>
                <button className="submit-btn" onClick={handleSubmit}>
                  {isEditing ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Details Modal */}
      {showDetails && selectedProject && (
        <div className="modal-overlay" onClick={closeProjectDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Project Details</h2>
              <button className="close-button" onClick={closeProjectDetails}>×</button>
            </div>
            
            <div className="project-details">
              <h3>{selectedProject.title}</h3>
              <p><strong>Description:</strong> {selectedProject.description}</p>
              <p><strong>Start Date:</strong> {selectedProject.startDate}</p>
              <p><strong>End Date:</strong> {selectedProject.endDate}</p>
              <p><strong>Status:</strong> {selectedProject.completed ? 'Completed' : 'In Progress'}</p>
              
              <div className="details-actions">
                {!selectedProject.completed ? (
                  <>
                    <button className="complete-btn" onClick={() => completeProject(selectedProject.id)}>
                      Complete Project
                    </button>
                    <button className="edit-btn" onClick={() => startEditing(selectedProject)}>
                      Edit Project
                    </button>
                    <button className="invite-btn" onClick={() => {
                      if (window.confirm('Are you sure you want to invite collaborators?')) {
                        alert('Invite collaborators functionality coming soon!');
                      }
                    }}>
                      Invite Collaborators
                    </button>
                  </>
                ) : (
                  <button className="delete-btn" onClick={() => {
                    if (window.confirm('Are you sure you want to delete this project?')) {
                      deleteProject(selectedProject.id);
                    }
                  }}>
                    Delete Project
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .new-project-button-container {
          margin-bottom: 30px;
          text-align: right;
        }
        
        .new-project-btn {
          background-color: #4CAF50;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
        }
        
        .new-project-btn:hover {
          background-color: #45a049;
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .modal-content {
          background-color: white;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .modal-header h2 {
          margin: 0;
        }
        
        .close-button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
        }
        
        .close-button:hover {
          color: #333;
        }
        
        .project-form {
          padding: 20px;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
          color: #333;
        }
        
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #4CAF50;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        
        .form-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 20px;
        }
        
        .cancel-btn {
          padding: 8px 16px;
          background-color: #f44336;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .cancel-btn:hover {
          background-color: #da190b;
        }
        
        .submit-btn {
          padding: 8px 16px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .submit-btn:hover {
          background-color: #45a049;
        }
        
        .project-details {
          padding: 20px;
        }
        
        .project-details h3 {
          margin-top: 0;
          color: #333;
        }
        
        .project-details p {
          margin: 10px 0;
          line-height: 1.5;
        }
        
        .details-actions {
          margin-top: 20px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        
        .complete-btn {
          background-color: #4CAF50;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .complete-btn:hover {
          background-color: #45a049;
        }
        
        .edit-btn {
          background-color: #2196F3;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .edit-btn:hover {
          background-color: #0b7dda;
        }
        
        .invite-btn {
          background-color: #ff9800;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .invite-btn:hover {
          background-color: #e68a00;
        }
        
        .delete-btn {
          background-color: #f44336;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .delete-btn:hover {
          background-color: #da190b;
        }
        
        .collaborationBtns {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }
        
        .collaborationBtns button {
          padding: 5px 10px;
          cursor: pointer;
        }
        
        .project {
          border: 1px solid #ddd;
          padding: 15px;
          margin-bottom: 15px;
          border-radius: 4px;
        }
        
        .projectDuration {
          color: #666;
          font-size: 14px;
          margin: 10px 0;
        }
        
        @media (max-width: 600px) {
          .form-row {
            grid-template-columns: 1fr;
            gap: 10px;
          }
          
          .details-actions {
            flex-direction: column;
          }
          
          .details-actions button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

export default Projects