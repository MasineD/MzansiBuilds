import React, { useState, useEffect } from 'react'
import supabase from '../client'
import CommentsModal from '../components/commentModal'
import '../index.css'
import { MdFrontHand } from 'react-icons/md';
import { MdMessage } from 'react-icons/md';

const Overview = () => {
  const [recentProjects, setRecentProjects] = useState([])
  const [communityProjects, setCommunityProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)
  const [raisedHands, setRaisedHands] = useState({})
  const [userInterests, setUserInterests] = useState({})
  const [commentText, setCommentText] = useState({})

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
      const { data: allProjects, error: allError } = await supabase
        .from('projects')
        .select(`
          *,
          profiles:user_id (
            id, 
            username, 
            email, 
            organisation, 
            department,
            role
          )
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

  const handleCommentSubmit = async (projectId) => {
    if (!commentText[projectId]?.trim()) {
      alert('Please enter a comment')
      return
    }

    const { error } = await supabase
      .from('comments')
      .insert([
        {
          project_id: projectId,
          user_id: currentUser.id,
          comment: commentText[projectId]
        }
      ])

    if (error) {
      alert('Error adding comment: ' + error.message)
    } else {
      setCommentText(prev => ({ ...prev, [projectId]: '' }))
      alert('Comment added successfully!')
    }
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

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString('en-GB')
  }

  if (loading) {
    return <div className="loading">Loading overview...</div>
  }

  return (
    <div className="overview-container bg-black/10 min-h-screen">
      <div className="featureHeader">
        <h1 className='featureTitle'>Overview</h1>
        <p className='featureSlogan'>Browse and interact with all projects in the database</p>
      </div>

      <div className="overview-content grid grid-cols-1 md:grid-cols-2 gap-8 my-15 mx-15">
        {/* Left Side - Current User's Recent Projects */}
        <div className="recent-projects-side">
          <div className="section-header">
            <h2 className='text-center text-2xl font-semibold mb-2'>My Projects</h2>
          </div>
          
          {recentProjects.length === 0 ? (
            <div className="empty-state">
              <p>You haven't created any projects yet.</p>
            </div>
          ) : (
            <div className="recent-projects-list">
              {recentProjects.map(project => {
                const statusStyle = getStatusColor(project.status)
                return (
                  <div key={project.id} className="recent-project-card border p-4 rounded-md">
                    <div className="project-card-header">
                      <div className="flex items-center justify-between">
                        <h3 className='text-[18px] font-semibold'>{project.title}</h3>
                        <span 
                          className="status-badge rounded-md px-2 py-1 text-xs font-medium"
                          style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                        >
                          {project.status?.replace('-', ' ') || 'Planning'}
                        </span>
                      </div>
                    </div>
                    {project.description && (
                      <p className="project-description text-gray-600 text-sm mt-2">
                        {project.description.length > 100 
                          ? project.description.substring(0, 100) + '...' 
                          : project.description}
                      </p>
                    )}
                    <div className="project-meta grid grid-cols-2 gap-2 mt-3 text-xs text-gray-500">
                      {project.start_date && (
                        <span>Started: {formatDate(project.start_date)}</span>
                      )}
                      {project.end_date && (
                        <span>Ends: {formatDate(project.end_date)}</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right Side - ALL Projects from Database (Collaborate) */}
        <div className="community-projects-side">
          <div className="section-header">
            <h2 className='text-center text-2xl font-semibold mb-2'>Collaborate</h2>
            <span className="project-count text-sm text-gray-500 block text-center mb-2">Total Projects: {communityProjects.length}</span>
          </div>

          {communityProjects.length === 0 ? (
            <div className="empty-state">
              <p>No projects found in the database.</p>
            </div>
          ) : (
            <div className="community-projects-list space-y-4">
              {communityProjects.map(project => {
                const statusStyle = getStatusColor(project.status)
                return (
                  <div key={project.id} className="community-project-card border p-4 rounded-md">
                    <div className="project-header-info">
                      <div className="project-title-section flex items-center justify-between mb-2">
                        <h3 className='text-[18px] font-semibold'>{project.title}</h3>
                        <span 
                          className="status-badge rounded-md px-2 py-1 text-xs font-medium"
                          style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                        >
                          {project.status?.replace('-', ' ') || 'Planning'}
                        </span>
                      </div>
                      <div className="project-author text-xs text-gray-500 mb-2">
                        <strong> Owner:</strong> {project.profiles?.username || 'Anonymous User'}
                        {project.profiles?.organisation && (
                          <span className="organisation-detail">
                            {' '}| {project.profiles.organisation}
                          </span>
                        )}
                        {project.profiles?.department && (
                          <span className="department-detail">
                            {' '}| {project.profiles.department}
                          </span>
                        )}
                        {project.user_id === currentUser?.id && (
                          <span className="my-project-badge text-blue-500"> (Your Project)</span>
                        )}
                      </div>
                    </div>

                    {project.description && (
                      <p className="project-description text-gray-600 text-sm mt-2">
                        {project.description}
                      </p>
                    )}

                    <div className="project-details grid grid-cols-2 gap-2 mt-3 text-xs text-gray-500">
                      {project.start_date && (
                        <span>Start Date: {formatDate(project.start_date)}</span>
                      )}
                      {project.end_date && (
                        <span>End Date: {formatDate(project.end_date)}</span>
                      )}
                    </div>

                    {/* Comment Input Section */}
                    <div className="comment-input-section mt-4">
                      <textarea
                        className="comment-textarea w-full p-2 border rounded-md text-sm"
                        placeholder="Write your comment here"
                        value={commentText[project.id] || ''}
                        onChange={(e) => setCommentText(prev => ({ ...prev, [project.id]: e.target.value }))}
                        rows="2"
                      />
                      <button 
                        className="submit-comment-btn mt-2 px-4 py-1.5 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                        onClick={() => handleCommentSubmit(project.id)}
                      >
                        Submit Comment
                      </button>
                    </div>

                    <div className="project-actions flex gap-2 mt-3">
                      <button 
                        className="btn-comment px-3 py-1.5 bg-gray-200 rounded-md text-sm hover:bg-gray-300"
                        onClick={() => setSelectedProject(project)}
                      >
                        <MdMessage /> View Comments
                      </button>
                      <button 
                        className={`btn-raise-hand px-3 py-1.5 rounded-md text-sm ${
                          userInterests[project.id] 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        onClick={() => toggleRaiseHand(project.id)}
                      >
                        <MdFrontHand /> Raise Hand 
                        {raisedHands[project.id] > 0 && ` (${raisedHands[project.id]})`}
                      </button>
                    </div>
                  </div>
                )
              })}
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