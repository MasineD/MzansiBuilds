import React, { useState, useEffect } from 'react'
import supabase from '../client'
import ProjectForm from '../components/projectForm'
import '../index.css'
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa'

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [viewingProject, setViewingProject] = useState(null)
  const [userId, setUserId] = useState(null)
  const [projectMilestones, setProjectMilestones] = useState({})

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
    try {
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
        // Fetch milestones for all projects
        if (data && data.length > 0) {
          await fetchAllMilestones(data.map(p => p.id))
        }
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error loading projects: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllMilestones = async (projectIds) => {
    try {
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .in('project_id', projectIds)
        .order('display_order', { ascending: true })

      if (!error && data) {
        const milestonesByProject = {}
        data.forEach(milestone => {
          if (!milestonesByProject[milestone.project_id]) {
            milestonesByProject[milestone.project_id] = []
          }
          milestonesByProject[milestone.project_id].push(milestone)
        })
        setProjectMilestones(milestonesByProject)
      }
    } catch (error) {
      console.error('Error fetching milestones:', error)
    }
  }

  const validateProjectDates = (startDate, endDate) => {
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      if (start > end) {
        alert('Start date cannot be later than end date. Please correct the dates.')
        return false
      }
    }
    return true
  }

  const addProject = async (projectData, milestones) => {
    // Validate dates before adding
    if (!validateProjectDates(projectData.start_date, projectData.end_date)) {
      return false
    }

    try {
      // Insert project
      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            title: projectData.title,
            description: projectData.description,
            start_date: projectData.start_date,
            end_date: projectData.end_date,
            status: projectData.status,
            user_id: userId
          }
        ])
        .select()

      if (error) {
        throw new Error(error.message)
      }

      if (data && data[0]) {
        const newProjectId = data[0].id
        
        // Insert milestones for the new project
        if (milestones && milestones.length > 0) {
          const milestoneInserts = milestones.map((milestone, index) => ({
            project_id: newProjectId,
            title: milestone.title,
            description: milestone.description || '',
            status: milestone.status || 'incomplete',
            display_order: index
          }))

          const { error: milestoneError } = await supabase
            .from('milestones')
            .insert(milestoneInserts)

          if (milestoneError) {
            console.error('Error adding milestones:', milestoneError)
            alert('Project added but there was an error adding milestones.')
          }
        }
      }

      alert('Project added successfully!')
      setShowForm(false)
      await fetchProjects()
      return true
    } catch (error) {
      console.error('Error adding project:', error)
      alert('Error adding project: ' + error.message)
      return false
    }
  }

  const updateProject = async (projectData, milestones) => {
    // Validate dates before updating
    if (!validateProjectDates(projectData.start_date, projectData.end_date)) {
      return false
    }

    try {
      // Update project
      const { error } = await supabase
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

      if (error) {
        throw new Error(error.message)
      }

      // Update milestones - delete existing and insert new ones
      if (milestones) {
        // First, delete existing milestones for this project
        const { error: deleteError } = await supabase
          .from('milestones')
          .delete()
          .eq('project_id', editingProject.id)

        if (deleteError) {
          console.error('Error deleting old milestones:', deleteError)
        }

        // Insert updated milestones
        if (milestones.length > 0) {
          const milestoneInserts = milestones.map((milestone, index) => ({
            project_id: editingProject.id,
            title: milestone.title,
            description: milestone.description || '',
            status: milestone.status || 'incomplete',
            display_order: index
          }))

          const { error: milestoneError } = await supabase
            .from('milestones')
            .insert(milestoneInserts)

          if (milestoneError) {
            console.error('Error updating milestones:', milestoneError)
            alert('Project updated but there was an error updating milestones.')
          }
        }
      }

      alert('Project updated successfully!')
      setEditingProject(null)
      setShowForm(false)
      await fetchProjects()
      return true
    } catch (error) {
      console.error('Error updating project:', error)
      alert('Error updating project: ' + error.message)
      return false
    }
  }

  const deleteProject = async (projectId) => {
    const confirmed = window.confirm('Are you sure you want to delete this project? This will also delete all associated milestones.')
    if (!confirmed) return

    try {
      // Delete milestones first (cascade will handle, but explicit for safety)
      const { error: milestoneError } = await supabase
        .from('milestones')
        .delete()
        .eq('project_id', projectId)

      if (milestoneError) {
        console.error('Error deleting milestones:', milestoneError)
      }

      // Delete project
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('user_id', userId)

      if (error) {
        throw new Error(error.message)
      }

      alert('Project deleted successfully!')
      await fetchProjects()
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Error deleting project: ' + error.message)
    }
  }

  const handleEditClick = (project) => {
    setEditingProject(project)
    setViewingProject(null)
    setShowForm(true)
  }

  const handleViewClick = (project) => {
    setViewingProject(project)
    setEditingProject(null)
    setShowForm(true)
  }

  const handleFormSubmit = async (formData, milestones) => {
    if (editingProject) {
      return await updateProject(formData, milestones)
    } else {
      return await addProject(formData, milestones)
    }
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingProject(null)
    setViewingProject(null)
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

  const getMilestoneProgress = (projectId) => {
    const milestones = projectMilestones[projectId] || []
    const total = milestones.length
    const completed = milestones.filter(m => m.status === 'complete').length
    return { total, completed, percentage: total > 0 ? (completed / total) * 100 : 0 }
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
        <p className='featureSlogan text-green-200 text-lg'>Manage your projects and track their progress with milestones</p>
      </div>

      {projects.length === 0 ? (
        <div className="no-projects bg-white/10 backdrop-blur-sm rounded-2xl p-12 text-center max-w-md mx-auto border border-green-500/30">
          <p className="text-green-200 text-lg mb-6">You don't have any projects yet.</p>
          <button 
            className="btn-add bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2 mx-auto"
            onClick={() => {
              setEditingProject(null)
              setViewingProject(null)
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
                setViewingProject(null)
                setShowForm(true)
              }}
            >
              <FaPlus /> Add New Project
            </button>
          </div>
          
          <div className="projects-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {projects.map(project => {
              const statusStyle = getStatusColor(project.status)
              const progress = getMilestoneProgress(project.id)
              const isCompleted = project.status === 'completed'
              
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
                    
                    {/* Milestone Progress Bar */}
                    {progress.total > 0 && (
                      <div className="milestone-progress mb-4">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Milestone Progress</span>
                          <span>{progress.completed}/{progress.total} Complete</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress.percentage}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    {progress.total === 0 && (
                      <div className="mb-4 text-xs text-gray-500 italic">
                        No milestones added yet
                      </div>
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
                      {isCompleted ? (
                        <button 
                          className="btn-view flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                          onClick={() => handleViewClick(project)}
                        >
                          <FaEye /> Read More
                        </button>
                      ) : (
                        <>
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
                        </>
                      )}
                    </div>
                    
                    {isCompleted && (
                      <div className="mt-3 text-center text-xs text-gray-500">
                        <span className="inline-flex items-center gap-1">
                          <FaEye size={12} /> This project is completed and cannot be edited
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {showForm && (
        <ProjectForm
          project={viewingProject || editingProject}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
          isReadOnly={!!viewingProject}
        />
      )}
    </div>
  )
}

export default Projects