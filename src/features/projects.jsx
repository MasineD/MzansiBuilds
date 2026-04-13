import React, { useState, useEffect } from 'react'
import supabase from '../client'
import ProjectForm from '../components/projectForm'
import '../index.css'

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [userId, setUserId] = useState(null)

  // Get current user ID
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      }
    }
    getCurrentUser()
  }, [])

  // Fetch projects when user ID is available
  useEffect(() => {
    if (userId) {
      fetchProjects()
    }
  }, [userId])

  const fetchProjects = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching projects:', error)
      alert('Error loading projects: ' + error.message)
    } else {
      setProjects(data || [])
    }
    setLoading(false)
  }

  const addProject = async (projectData) => {
    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          ...projectData,
          user_id: userId
        }
      ])
      .select()

    if (error) {
      alert('Error adding project: ' + error.message)
    } else {
      alert('Project added successfully!')
      setShowForm(false)
      fetchProjects()
    }
  }

  const updateProject = async (projectData) => {
    const { data, error } = await supabase
      .from('projects')
      .update({
        title: projectData.title,
        description: projectData.description,
        start_date: projectData.start_date,
        end_date: projectData.end_date,
        status: projectData.status
      })
      .eq('id', editingProject.id)
      .eq('user_id', userId)
      .select()

    if (error) {
      alert('Error updating project: ' + error.message)
    } else {
      alert('Project updated successfully!')
      setEditingProject(null)
      setShowForm(false)
      fetchProjects()
    }
  }

  const deleteProject = async (projectId) => {
    const confirmed = window.confirm('Are you sure you want to delete this project?')
    if (!confirmed) return

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
      .eq('user_id', userId)

    if (error) {
      alert('Error deleting project: ' + error.message)
    } else {
      alert('Project deleted successfully!')
      fetchProjects()
    }
  }

  const handleEditClick = (project) => {
    setEditingProject(project)
    setShowForm(true)
  }

  const handleFormSubmit = (formData) => {
    if (editingProject) {
      updateProject(formData)
    } else {
      addProject(formData)
    }
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingProject(null)
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'planning': return '#ffc107'
      case 'in-progress': return '#17a2b8'
      case 'completed': return '#28a745'
      case 'on-hold': return '#fd7e14'
      case 'cancelled': return '#dc3545'
      default: return '#6c757d'
    }
  }

  if (loading) {
    return <div className="loading">Loading projects...</div>
  }

  return (
    <div className="projects-container">
      <div className="featureHeader">
        <h1 className='featureTitle'>My Projects</h1>
        <p className='featureSlogan'>Manage your projects and track their progress</p>
      </div>

      {projects.length === 0 ? (
        <div className="no-projects">
          <p>You don't have any projects yet.</p>
          <button 
            className="btn-add"
            onClick={() => {
              setEditingProject(null)
              setShowForm(true)
            }}
          >
            + Add New Project
          </button>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map(project => (
            <div key={project.id} className="project-card">
              <div className="project-header">
                <h3>{project.title}</h3>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(project.status) }}
                >
                  {project.status.replace('-', ' ')}
                </span>
              </div>
              
              {project.description && (
                <p className="project-description">{project.description}</p>
              )}
              
              <div className="project-dates">
                {project.start_date && (
                  <span>Start: {new Date(project.start_date).toLocaleDateString()}</span>
                )}
                {project.end_date && (
                  <span>End: {new Date(project.end_date).toLocaleDateString()}</span>
                )}
              </div>
              
              <div className="project-actions">
                <button 
                  className="btn-edit"
                  onClick={() => handleEditClick(project)}
                >
                  Edit
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => deleteProject(project.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ProjectForm
          project={editingProject}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  )
}

export default Projects
