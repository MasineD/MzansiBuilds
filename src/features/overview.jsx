import React, { useState, useEffect } from 'react'
import supabase from '../client'
import CommentsModal from './commentModal'

const Overview = () => {
  const [recentProjects, setRecentProjects] = useState([])
  const [communityProjects, setCommunityProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)
  const [raisedHands, setRaisedHands] = useState({})
  const [userInterests, setUserInterests] = useState({})

  useEffect(() => {
    getCurrentUser()
  }, [])

  useEffect(() => {
    if (currentUser) {
      fetchProjects()
      fetchUserInterests()
    }
  }, [currentUser])

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUser(user)
  }

  const fetchUserInterests = async () => {
    if (!currentUser) return
    
    const { data, error } = await supabase
      .from('project_interests')
      .select('project_id')
      .eq('user_id', currentUser.id)

    if (!error && data) {
      const interests = {}
      data.forEach(item => {
        interests[item.project_id] = true
      })
      setUserInterests(interests)
    }
  }

  const fetchProjects = async () => {
    setLoading(true)
    
    try {
      // Fetch current user's projects (last 2 added)
      const { data: userProjects, error: userError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false })
        .limit(2)

      if (userError) {
        console.error('Error fetching user projects:', userError)
      } else {
        setRecentProjects(userProjects || [])
      }

      // Fetch ALL projects from database for community projects
      // This includes projects from ALL users (including current user)
      const { data: allProjects, error: allError } = await supabase
        .from('projects')
        .select(`
          *
        `)
        .order('created_at', { ascending: false })

      if (allError) {
        console.error('Error fetching all projects:', allError)
        alert('Error loading projects: ' + allError.message)
      } else {
        console.log('All projects from database:', allProjects)
        setCommunityProjects(allProjects || [])
        
        // Fetch interest counts for all projects
        if (allProjects && allProjects.length > 0) {
          fetchInterestCounts(allProjects.map(p => p.id))
        }
      }
    } catch (error) {
      console.error('Error in fetchProjects:', error)
      alert('Error loading projects: ' + error.message)
    }
    
    setLoading(false)
  }

  const fetchInterestCounts = async (projectIds) => {
    if (!projectIds.length) return
    
    const { data, error } = await supabase
      .from('project_interests')
      .select('project_id')
      .in('project_id', projectIds)

    if (!error && data) {
      const counts = {}
      data.forEach(item => {
        counts[item.project_id] = (counts[item.project_id] || 0) + 1
      })
      setRaisedHands(counts)
    }
  }

  const toggleRaiseHand = async (projectId) => {
    if (!currentUser) {
      alert('Please login to raise hand')
      return
    }

    const isInterested = userInterests[projectId]

    if (isInterested) {
      // Remove interest
      const { error } = await supabase
        .from('project_interests')
        .delete()
        .eq('project_id', projectId)
        .eq('user_id', currentUser.id)

      if (error) {
        alert('Error removing interest: ' + error.message)
      } else {
        setUserInterests(prev => ({ ...prev, [projectId]: false }))
        setRaisedHands(prev => ({ 
          ...prev, 
          [projectId]: Math.max((prev[projectId] || 1) - 1, 0)
        }))
      }
    } else {
      // Add interest
      const { error } = await supabase
        .from('project_interests')
        .insert([
          {
            project_id: projectId,
            user_id: currentUser.id
          }
        ])

      if (error) {
        alert('Error raising hand: ' + error.message)
      } else {
        setUserInterests(prev => ({ ...prev, [projectId]: true }))
        setRaisedHands(prev => ({ 
          ...prev, 
          [projectId]: (prev[projectId] || 0) + 1 
        }))
      }
    }
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

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return <div className="loading">Loading overview...</div>
  }

  return (
    <div className="overview-container">
      <div className="overview-header">
        <h1>Overview</h1>
        <p>Browse and interact with all projects in the database</p>
      </div>

      <div className="overview-content">
        {/* Left Side - Current User's Recent Projects */}
        <div className="recent-projects-side">
          <div className="section-header">
            <h2>My Projects</h2>
          </div>
          
          {recentProjects.length === 0 ? (
            <div className="empty-state">
              <p>You haven't created any projects yet.</p>
              <button onClick={() => window.location.href = '/projects'}>
                + Create Your First Project
              </button>
            </div>
          ) : (
            <div className="recent-projects-list">
              {recentProjects.map(project => (
                <div key={project.id} className="recent-project-card">
                  <div className="project-card-header">
                    <h3>{project.title}</h3>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(project.status) }}
                    >
                      {project.status.replace('-', ' ')}
                    </span>
                  </div>
                  {project.description && (
                    <p className="project-description">
                      {project.description.length > 100 
                        ? project.description.substring(0, 100) + '...' 
                        : project.description}
                    </p>
                  )}
                  <div className="project-meta">
                    {project.start_date && (
                      <span>📅 Started: {formatDate(project.start_date)}</span>
                    )}
                    {project.end_date && (
                      <span>📅 Ends: {formatDate(project.end_date)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side - ALL Projects from Database */}
        <div className="community-projects-side">
          <div className="section-header">
            <h2>Collaborate</h2>
            <span className="project-count">Total Projects: {communityProjects.length}</span>
          </div>

          {communityProjects.length === 0 ? (
            <div className="empty-state">
              <p>No projects found in the database.</p>
              <button onClick={() => window.location.href = '/projects'}>
                + Create the First Project
              </button>
            </div>
          ) : (
            <div className="community-projects-list">
              {communityProjects.map(project => (
                <div key={project.id} className="community-project-card">
                  <div className="project-header-info">
                    <div className="project-title-section">
                      <h3>{project.title}</h3>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(project.status) }}
                      >
                        {project.status.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="project-author">
                      <strong>👤 Owner:</strong> {project.profiles?.username || 'Anonymous User'}
                      {project.profiles?.organisation && (
                        <span className="organisation-detail">
                          {' '}| 🏢 {project.profiles.organisation}
                        </span>
                      )}
                      {project.profiles?.department && (
                        <span className="department-detail">
                          {' '}| 📁 {project.profiles.department}
                        </span>
                      )}
                      {project.user_id === currentUser?.id && (
                        <span className="my-project-badge"> (Your Project)</span>
                      )}
                    </div>
                  </div>

                  {project.description && (
                    <p className="project-description">{project.description}</p>
                  )}

                  <div className="project-details">
                    {project.start_date && (
                      <span>📅 Start Date: {formatDate(project.start_date)}</span>
                    )}
                    {project.end_date && (
                      <span>📅 End Date: {formatDate(project.end_date)}</span>
                    )}
                  </div>

                  <div className="project-actions">
                    <button 
                      className="btn-comment"
                      onClick={() => setSelectedProject(project)}
                    >
                      💬 Comment
                    </button>
                    <button 
                      className={`btn-raise-hand ${userInterests[project.id] ? 'active' : ''}`}
                      onClick={() => toggleRaiseHand(project.id)}
                    >
                      ✋ Raise Hand 
                      {raisedHands[project.id] > 0 && ` (${raisedHands[project.id]})`}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedProject && (
        <CommentsModal 
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  )
}

export default Overview