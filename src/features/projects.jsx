import React, { useState, useEffect } from 'react'
import supabase from '../client'
import ProjectForm from '../components/projectForm'
import '../index.css'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'

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
      case 'planning': return { bg: '#FFF3E0', text: '#E65100', dot: '#FF9800' }
      case 'in-progress': return { bg: '#E3F2FD', text: '#1565C0', dot: '#2196F3' }
      case 'completed': return { bg: '#E8F5E9', text: '#2E7D32', dot: '#4CAF50' }
      case 'on-hold': return { bg: '#FFEBEE', text: '#C62828', dot: '#F44336' }
      case 'cancelled': return { bg: '#ECEFF1', text: '#455A64', dot: '#9E9E9E' }
      default: return { bg: '#F5F5F5', text: '#616161', dot: '#757575' }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-black flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-300 border-t-green-600 rounded-full animate-spin"></div>
        <p className="text-green-200 mt-4 text-lg">Loading projects...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-black py-8 px-4">
      <div className="featureHeader text-center mb-12">
        <h1 className='featureTitle text-4xl md:text-5xl font-bold text-white mb-2'>My Projects</h1>
        <p className='featureSlogan text-green-200 text-lg'>Manage your projects and track their progress</p>
      </div>

      {projects.length === 0 ? (
        <div className="no-projects bg-white/10 backdrop-blur-sm rounded-2xl p-12 text-center max-w-md mx-auto border border-green-500/30">
          <p className="text-green-200 text-lg mb-6">You don't have any projects yet.</p>
          <button 
            className="btn-add bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2 mx-auto"
            onClick={() => {
              setEditingProject(null)
              setShowForm(true)
            }}
          >
            <FaPlus /> Add New Project
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-6">
            <button 
              className="btn-add bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2"
              onClick={() => {
                setEditingProject(null)
                setShowForm(true)
              }}
            >
              <FaPlus /> Add New Project
            </button>
          </div>
          
          <div className="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {projects.map(project => {
              const statusStyle = getStatusColor(project.status)
              return (
                <div key={project.id} className="project-card bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="project-header p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
                      <span 
                        className="status-badge rounded-full px-3 py-1 text-xs font-medium"
                        style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                      >
                        {project.status?.replace('-', ' ') || 'Planning'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    {project.description && (
                      <p className="project-description text-gray-600 text-sm mb-4">
                        {project.description.length > 150 
                          ? project.description.substring(0, 150) + '...' 
                          : project.description}
                      </p>
                    )}
                    
                    <div className="project-dates space-y-1 mb-4">
                      {project.start_date && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="font-medium">Start:</span>
                          <span>{new Date(project.start_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      {project.end_date && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="font-medium">End:</span>
                          <span>{new Date(project.end_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="project-actions flex gap-3">
                      <button 
                        className="btn-edit flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        onClick={() => handleEditClick(project)}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button 
                        className="btn-delete flex-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                        onClick={() => deleteProject(project.id)}
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
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