import React, { useState, useEffect } from 'react'
import supabase from '../client'

const CelebrationWall = () => {
  const [completedProjects, setCompletedProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    uniqueUsers: 0,
    mostRecent: null
  })

  useEffect(() => {
    fetchCompletedProjects()
  }, [])

  const fetchCompletedProjects = async () => {
    setLoading(true)
    
    try {
      // Fetch all completed projects
      const { data, error } = await supabase
        .from('completed_projects')
        .select('*')
        .order('completed_at', { ascending: false })

      if (error) {
        console.error('Error fetching completed projects:', error)
        alert('Error loading celebration wall: ' + error.message)
      } else {
        setCompletedProjects(data || [])
        
        // Calculate statistics
        if (data && data.length > 0) {
          const uniqueUsers = new Set(data.map(project => project.owner_username)).size
          setStats({
            total: data.length,
            uniqueUsers: uniqueUsers,
            mostRecent: data[0] // Most recent completed project
          })
        }
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error loading celebration wall: ' + error.message)
    }
    
    setLoading(false)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCompletedDate = (dateString) => {
    if (!dateString) return 'Recently'
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="celebration-loading">
        <div className="spinner"></div>
        <p>Loading celebrations...</p>
      </div>
    )
  }

  return (
    <div className="celebration-wall">
      <div className="celebration-header">
        <div className="confetti-icon">🎉</div>
        <h1>Celebration Wall</h1>
        <p>Celebrating completed projects and achievements!</p>
      </div>

      {/* Statistics Section */}
      {completedProjects.length > 0 && (
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Completed Projects</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-number">{stats.uniqueUsers}</div>
            <div className="stat-label">Contributors</div>
          </div>
          {stats.mostRecent && (
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-number">{formatCompletedDate(stats.mostRecent.completed_at)}</div>
              <div className="stat-label">Latest Completion</div>
            </div>
          )}
        </div>
      )}

      {/* Completed Projects Grid */}
      {completedProjects.length === 0 ? (
        <div className="empty-celebration">
          <div className="empty-icon">🎯</div>
          <h2>No Completed Projects Yet</h2>
          <p>When projects are marked as completed, they will appear here for celebration!</p>
          <button 
            className="goto-projects-btn"
            onClick={() => window.location.href = '/projects'}
          >
            Go to Projects
          </button>
        </div>
      ) : (
        <>
          <div className="celebration-grid">
            {completedProjects.map((project, index) => (
              <div key={project.id} className="celebration-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="celebration-badge">
                  <span className="badge-icon">🏆</span>
                  <span className="badge-text">Completed</span>
                </div>
                
                <div className="project-icon">
                  {getProjectIcon(index)}
                </div>
                
                <h3 className="project-title">{project.project_name}</h3>
                
                <div className="project-owner">
                  <div className="owner-info">
                    <span className="owner-icon">👤</span>
                    <span className="owner-name">{project.owner_username}</span>
                  </div>
                  {project.owner_role && (
                    <div className="role-info">
                      <span className="role-icon">💼</span>
                      <span className="role-name">{project.owner_role}</span>
                    </div>
                  )}
                </div>
                
                <div className="project-completion">
                  <div className="completion-date">
                    <span className="date-icon">📅</span>
                    <span>Completed on: {formatDate(project.end_date)}</span>
                  </div>
                  <div className="completed-ago">
                    {formatCompletedDate(project.completed_at)}
                  </div>
                </div>
                
                <div className="celebration-message">
                  🎊 Congratulations! 🎊
                </div>
              </div>
            ))}
          </div>
          
          {/* Celebration Message */}
          <div className="celebration-footer">
            <p>🎉 Keep up the amazing work! Every completed project is a step towards success! 🎉</p>
          </div>
        </>
      )}
    </div>
  )
}

// Helper function to get different project icons
const getProjectIcon = (index) => {
  const icons = ['🚀', '💡', '🎯', '🌟', '⚡', '🔥', '💎', '🏅', '🎨', '🔧']
  return icons[index % icons.length]
}

export default CelebrationWall