// import React, { useState, useEffect } from 'react'
// import supabase from '../client'
// import CommentsModal from '../components/commentModal'
// import '../index.css'
// import { MdFrontHand, MdMessage, MdNotifications, MdCheckCircle, MdDelete, MdClose } from 'react-icons/md';

// const Overview = () => {
//   const [recentProjects, setRecentProjects] = useState([])
//   const [communityProjects, setCommunityProjects] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [currentUser, setCurrentUser] = useState(null)
//   const [selectedProject, setSelectedProject] = useState(null)
//   const [raisedHands, setRaisedHands] = useState({})
//   const [userInterests, setUserInterests] = useState({})
//   const [commentText, setCommentText] = useState({})
//   const [notifications, setNotifications] = useState([])
//   const [showNotifications, setShowNotifications] = useState(false)
//   const [unreadCount, setUnreadCount] = useState(0)

//   useEffect(() => {
//     getCurrentUser()
//   }, [])

//   useEffect(() => {
//     if (currentUser) {
//       fetchProjects()
//       fetchUserInterests()
//       fetchNotifications()
      
//       // Set up real-time subscription for notifications
//       const subscription = supabase
//         .channel('notifications-channel')
//         .on('postgres_changes', 
//           { 
//             event: 'INSERT', 
//             schema: 'public', 
//             table: 'notifications',
//             filter: `recipient_id=eq.${currentUser.id}`
//           }, 
//           (payload) => {
//             // Add new notification to the list
//             setNotifications(prev => [payload.new, ...prev])
//             setUnreadCount(prev => prev + 1)
//           }
//         )
//         .subscribe()

//       return () => {
//         subscription.unsubscribe()
//       }
//     }
//   }, [currentUser])

//   const getCurrentUser = async () => {
//     const { data: { user } } = await supabase.auth.getUser()
//     setCurrentUser(user)
//   }

//   const fetchNotifications = async () => {
//     if (!currentUser) return

//     const { data, error } = await supabase
//       .from('notifications')
//       .select(`
//         *,
//         sender:sender_id (username, email),
//         project:project_id (title)
//       `)
//       .eq('recipient_id', currentUser.id)
//       .order('created_at', { ascending: false })
//       .limit(50)

//     if (!error && data) {
//       setNotifications(data)
//       const unread = data.filter(n => !n.is_read).length
//       setUnreadCount(unread)
//     }
//   }

//   const markNotificationAsRead = async (notificationId) => {
//     const { error } = await supabase
//       .from('notifications')
//       .update({ is_read: true })
//       .eq('id', notificationId)

//     if (!error) {
//       setNotifications(prev => 
//         prev.map(n => 
//           n.id === notificationId ? { ...n, is_read: true } : n
//         )
//       )
//       setUnreadCount(prev => Math.max(0, prev - 1))
//     }
//   }

//   const markAllNotificationsAsRead = async () => {
//     const unreadNotifications = notifications.filter(n => !n.is_read)
    
//     for (const notification of unreadNotifications) {
//       await supabase
//         .from('notifications')
//         .update({ is_read: true })
//         .eq('id', notification.id)
//     }

//     setNotifications(prev => 
//       prev.map(n => ({ ...n, is_read: true }))
//     )
//     setUnreadCount(0)
//   }

//   const createNotification = async (recipientId, senderId, projectId, projectTitle, type, message) => {
//     const { error } = await supabase
//       .from('notifications')
//       .insert([
//         {
//           recipient_id: recipientId,
//           sender_id: senderId,
//           project_id: projectId,
//           project_title: projectTitle,
//           type: type,
//           message: message
//         }
//       ])

//     if (error) {
//       console.error('Error creating notification:', error)
//     }
//   }

//   const fetchUserInterests = async () => {
//     if (!currentUser) return
    
//     const { data, error } = await supabase
//       .from('project_interests')
//       .select('project_id')
//       .eq('user_id', currentUser.id)

//     if (!error && data) {
//       const interests = {}
//       data.forEach(item => {
//         interests[item.project_id] = true
//       })
//       setUserInterests(interests)
//     }
//   }

//   const fetchProjects = async () => {
//     setLoading(true)
    
//     try {
//       // Fetch current user's projects (last 2 added) - only projects belonging to current user
//       const { data: userProjects, error: userError } = await supabase
//         .from('projects')
//         .select('*')
//         .eq('user_id', currentUser.id)
//         .order('created_at', { ascending: false })
//         .limit(2)

//       if (userError) {
//         console.error('Error fetching user projects:', userError)
//       } else {
//         console.log('User projects (only current user):', userProjects)
//         setRecentProjects(userProjects || [])
//       }

//       // Fetch ALL projects from database for community projects (all users)
//       const { data: allProjects, error: allError } = await supabase
//         .from('projects')
//         .select(`
//           *,
//           profiles(
//             id, 
//             username, 
//             email, 
//             organisation, 
//             department,
//             role
//           )
//         `)
//         .order('created_at', { ascending: false })

//       if (allError) {
//         console.error('Error fetching all projects:', allError)
//         alert('Error loading projects: ' + allError.message)
//       } else {
//         console.log('All projects from database (all users):', allProjects)
//         setCommunityProjects(allProjects || [])
        
//         // Fetch interest counts for all projects
//         if (allProjects && allProjects.length > 0) {
//           fetchInterestCounts(allProjects.map(p => p.id))
//         }
//       }
//     } catch (error) {
//       console.error('Error in fetchProjects:', error)
//       alert('Error loading projects: ' + error.message)
//     }
    
//     setLoading(false)
//   }

//   const fetchInterestCounts = async (projectIds) => {
//     if (!projectIds.length) return
    
//     const { data, error } = await supabase
//       .from('project_interests')
//       .select('project_id')
//       .in('project_id', projectIds)

//     if (!error && data) {
//       const counts = {}
//       data.forEach(item => {
//         counts[item.project_id] = (counts[item.project_id] || 0) + 1
//       })
//       setRaisedHands(counts)
//     }
//   }

//   const toggleRaiseHand = async (projectId) => {
//     if (!currentUser) {
//       alert('Please login to raise hand')
//       return
//     }

//     // Get project details for notification
//     const project = communityProjects.find(p => p.id === projectId)
    
//     const isInterested = userInterests[projectId]

//     if (isInterested) {
//       // Remove interest
//       const { error } = await supabase
//         .from('project_interests')
//         .delete()
//         .eq('project_id', projectId)
//         .eq('user_id', currentUser.id)

//       if (error) {
//         alert('Error removing interest: ' + error.message)
//       } else {
//         setUserInterests(prev => ({ ...prev, [projectId]: false }))
//         setRaisedHands(prev => ({ 
//           ...prev, 
//           [projectId]: Math.max((prev[projectId] || 1) - 1, 0)
//         }))
//       }
//     } else {
//       // Add interest
//       const { error } = await supabase
//         .from('project_interests')
//         .insert([
//           {
//             project_id: projectId,
//             user_id: currentUser.id
//           }
//         ])

//       if (error) {
//         alert('Error raising hand: ' + error.message)
//       } else {
//         setUserInterests(prev => ({ ...prev, [projectId]: true }))
//         setRaisedHands(prev => ({ 
//           ...prev, 
//           [projectId]: (prev[projectId] || 0) + 1 
//         }))
        
//         // Create notification for project owner
//         if (project && project.user_id !== currentUser.id) {
//           await createNotification(
//             project.user_id,
//             currentUser.id,
//             projectId,
//             project.title,
//             'raised_hand',
//             `${currentUser.email} is interested in collaborating on your project`
//           )
//         }
//       }
//     }
//   }

//   const handleCommentSubmit = async (projectId) => {
//     if (!commentText[projectId]?.trim()) {
//       alert('Please enter a comment')
//       return
//     }

//     // Get project details for notification
//     const project = communityProjects.find(p => p.id === projectId)

//     const { error } = await supabase
//       .from('comments')
//       .insert([
//         {
//           project_id: projectId,
//           user_id: currentUser.id,
//           comment: commentText[projectId]
//         }
//       ])

//     if (error) {
//       alert('Error adding comment: ' + error.message)
//     } else {
//       setCommentText(prev => ({ ...prev, [projectId]: '' }))
//       alert('Comment added successfully!')
      
//       // Create notification for project owner
//       if (project && project.user_id !== currentUser.id) {
//         await createNotification(
//           project.user_id,
//           currentUser.id,
//           projectId,
//           project.title,
//           'comment',
//           `${currentUser.email} commented: "${commentText[projectId].substring(0, 100)}${commentText[projectId].length > 100 ? '...' : ''}"`
//         )
//       }
//     }
//   }

//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'planning': return { bg: '#FFF3E0', text: '#E65100', dot: '#FF9800' }
//       case 'in-progress': return { bg: '#E3F2FD', text: '#1565C0', dot: '#2196F3' }
//       case 'completed': return { bg: '#E8F5E9', text: '#2E7D32', dot: '#4CAF50' }
//       case 'on-hold': return { bg: '#FFEBEE', text: '#C62828', dot: '#F44336' }
//       case 'cancelled': return { bg: '#ECEFF1', text: '#455A64', dot: '#9E9E9E' }
//       default: return { bg: '#F5F5F5', text: '#616161', dot: '#757575' }
//     }
//   }

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Not set'
//     const date = new Date(dateString)
//     const now = new Date()
//     const diffMs = now - date
//     const diffMins = Math.floor(diffMs / 60000)
//     const diffHours = Math.floor(diffMs / 3600000)
//     const diffDays = Math.floor(diffMs / 86400000)

//     if (diffMins < 1) return 'Just now'
//     if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
//     if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
//     if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
//     return date.toLocaleDateString('en-GB')
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-black flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-12 h-12 border-4 border-green-300 border-t-green-600 rounded-full animate-spin mx-auto"></div>
//           <p className="text-green-200 mt-4">Loading overview...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-black py-8 px-4">
//       <div className="featureHeader text-center mb-12 relative">
//         <h1 className='featureTitle text-4xl md:text-5xl font-bold text-white mb-2'>Overview</h1>
//         <p className='featureSlogan text-green-200 text-lg'>Browse and interact with all projects in the database</p>
        
//         {/* Notification Bell - Moved to right end */}
//         <div className="absolute top-0 right-0">
//           <button
//             onClick={() => setShowNotifications(!showNotifications)}
//             className="bg-white/10 backdrop-blur-sm p-2 rounded-full hover:bg-white/20 transition-colors relative"
//           >
//             <MdNotifications size={24} className="text-white" />
//             {unreadCount > 0 && (
//               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
//                 {unreadCount}
//               </span>
//             )}
//           </button>
//         </div>

//         {/* Notifications Dropdown */}
//         {showNotifications && (
//           <>
//             {/* Backdrop */}
//             <div 
//               className="fixed inset-0 z-40"
//               onClick={() => setShowNotifications(false)}
//             />
            
//             {/* Notification Container */}
//             <div className="absolute top-12 right-0 w-96 bg-white rounded-xl shadow-2xl z-50 overflow-hidden">
//               <div className="bg-gradient-to-r from-green-700 to-green-900 p-4 flex justify-between items-center">
//                 <h3 className="text-white font-semibold">Notifications</h3>
//                 <div className="flex gap-2">
//                   {unreadCount > 0 && (
//                     <button
//                       onClick={markAllNotificationsAsRead}
//                       className="text-xs text-green-200 hover:text-white transition-colors"
//                     >
//                       Mark all as read
//                     </button>
//                   )}
//                   <button
//                     onClick={() => setShowNotifications(false)}
//                     className="text-white/70 hover:text-white transition-colors"
//                   >
//                     <MdClose size={20} />
//                   </button>
//                 </div>
//               </div>
//               <div className="max-h-96 overflow-y-auto">
//                 {notifications.length === 0 ? (
//                   <div className="p-8 text-center text-gray-500">
//                     No notifications yet
//                   </div>
//                 ) : (
//                   notifications.map(notification => (
//                     <div
//                       key={notification.id}
//                       className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
//                         !notification.is_read ? 'bg-green-50' : ''
//                       }`}
//                       onClick={() => markNotificationAsRead(notification.id)}
//                     >
//                       <div className="flex items-start gap-3">
//                         <div className={`w-2 h-2 rounded-full mt-2 ${
//                           notification.type === 'comment' ? 'bg-blue-500' : 'bg-green-500'
//                         }`} />
//                         <div className="flex-1">
//                           <p className="text-sm font-medium text-gray-800">
//                             {notification.type === 'comment' ? 'New Comment' : 'Collaboration Request'}
//                           </p>
//                           <p className="text-xs text-gray-600 mt-1">
//                             {notification.message}
//                           </p>
//                           <p className="text-xs text-gray-400 mt-2">
//                             Project: {notification.project_title}
//                           </p>
//                           <p className="text-xs text-gray-400 mt-1">
//                             {formatDate(notification.created_at)}
//                           </p>
//                         </div>
//                         {!notification.is_read && (
//                           <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                         )}
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       <div className="overview-content grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
//         {/* Left Side - Current User's Recent Projects */}
//         <div className="recent-projects-side">
//           <div className="section-header mb-6">
//             <h2 className='text-center text-2xl font-semibold text-white mb-2'>My Projects</h2>
//             <div className="w-20 h-1 bg-green-500 mx-auto rounded-full"></div>
//             <p className="text-center text-green-300 text-sm mt-2">Showing your last 2 projects</p>
//           </div>
          
//           {recentProjects.length === 0 ? (
//             <div className="empty-state bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center border border-green-500/30">
//               <p className="text-green-200">You haven't created any projects yet.</p>
//             </div>
//           ) : (
//             <div className="recent-projects-list space-y-4 max-h-[70vh] overflow-y-auto hide-scrollbar">
//               {recentProjects.map(project => {
//                 const statusStyle = getStatusColor(project.status)
//                 return (
//                   <div key={project.id} className="recent-project-card bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
//                     <div className="project-card-header">
//                       <div className="flex items-center justify-between mb-2">
//                         <h3 className='text-lg font-semibold text-gray-800'>{project.title}</h3>
//                         <span 
//                           className="status-badge rounded-full px-3 py-1 text-xs font-medium"
//                           style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
//                         >
//                           {project.status?.replace('-', ' ') || 'Planning'}
//                         </span>
//                       </div>
//                     </div>
//                     {project.description && (
//                       <p className="project-description text-gray-600 text-sm mt-2">
//                         {project.description.length > 100 
//                           ? project.description.substring(0, 100) + '...' 
//                           : project.description}
//                       </p>
//                     )}
//                     <div className="project-meta grid grid-cols-2 gap-2 mt-3 text-xs text-gray-500">
//                       {project.start_date && (
//                         <span>📅 Started: {formatDate(project.start_date)}</span>
//                       )}
//                       {project.end_date && (
//                         <span>📅 Ends: {formatDate(project.end_date)}</span>
//                       )}
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           )}
//         </div>

//         {/* Right Side - ALL Projects from Database (Collaborate) */}
//         <div className="community-projects-side">
//           <div className="section-header mb-6">
//             <h2 className='text-center text-2xl font-semibold text-white mb-2'>Collaborate</h2>
//             <div className="w-20 h-1 bg-green-500 mx-auto rounded-full mb-2"></div>
//             <span className="project-count text-sm text-green-300 block text-center">Total Projects: {communityProjects.length}</span>
//           </div>

//           {communityProjects.length === 0 ? (
//             <div className="empty-state bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center border border-green-500/30">
//               <p className="text-green-200">No projects found in the database.</p>
//             </div>
//           ) : (
//             <div className="community-projects-list space-y-4 max-h-[70vh] overflow-y-auto hide-scrollbar">
//               {communityProjects.map(project => {
//                 const statusStyle = getStatusColor(project.status)
//                 return (
//                   <div key={project.id} className="community-project-card bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
//                     <div className="project-header-info">
//                       <div className="project-title-section flex items-center justify-between mb-2">
//                         <h3 className='text-lg font-semibold text-gray-800'>{project.title}</h3>
//                         <span 
//                           className="status-badge rounded-full px-3 py-1 text-xs font-medium"
//                           style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
//                         >
//                           {project.status?.replace('-', ' ') || 'Planning'}
//                         </span>
//                       </div>
//                       <div className="project-author text-xs text-gray-600 mb-2 pb-2 border-b border-gray-100">
//                         <strong>👤 Owner:</strong> {project.profiles?.username || 'Anonymous User'}
//                         {project.profiles?.organisation && (
//                           <span className="organisation-detail">
//                             {' '}| 🏢 {project.profiles.organisation}
//                           </span>
//                         )}
//                         {project.profiles?.department && (
//                           <span className="department-detail">
//                             {' '}| 📁 {project.profiles.department}
//                           </span>
//                         )}
//                         {project.user_id === currentUser?.id && (
//                           <span className="my-project-badge text-green-600 font-semibold ml-2">(Your Project)</span>
//                         )}
//                       </div>
//                     </div>

//                     {project.description && (
//                       <p className="project-description text-gray-600 text-sm mt-2">
//                         {project.description}
//                       </p>
//                     )}

//                     <div className="project-details grid grid-cols-2 gap-2 mt-3 text-xs text-gray-500">
//                       {project.start_date && (
//                         <span> Start Date: {formatDate(project.start_date)}</span>
//                       )}
//                       {project.end_date && (
//                         <span> End Date: {formatDate(project.end_date)}</span>
//                       )}
//                     </div>

//                     {/* Comment Input Section */}
//                     <div className="comment-input-section mt-4">
//                       <textarea
//                         className="comment-textarea w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//                         placeholder="Write your comment here"
//                         value={commentText[project.id] || ''}
//                         onChange={(e) => setCommentText(prev => ({ ...prev, [project.id]: e.target.value }))}
//                         rows="2"
//                       />
//                       <button 
//                         className="submit-comment-btn mt-2 px-4 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors font-medium"
//                         onClick={() => handleCommentSubmit(project.id)}
//                       >
//                         Submit Comment
//                       </button>
//                     </div>

//                     <div className="project-actions flex gap-2 mt-3">
//                       <button 
//                         className="btn-comment px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors flex items-center gap-1"
//                         onClick={() => setSelectedProject(project)}
//                       >
//                         <MdMessage /> View Comments
//                       </button>
//                       <button 
//                         className={`btn-raise-hand px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 transition-colors ${
//                           userInterests[project.id] 
//                             ? 'bg-green-600 text-white hover:bg-green-700' 
//                             : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                         }`}
//                         onClick={() => toggleRaiseHand(project.id)}
//                       >
//                         <MdFrontHand /> Raise Hand 
//                         {raisedHands[project.id] > 0 && ` (${raisedHands[project.id]})`}
//                       </button>
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           )}
//         </div>
//       </div>

//       {selectedProject && (
//         <CommentsModal 
//           project={selectedProject}
//           onClose={() => setSelectedProject(null)}
//         />
//       )}

//       {/* Custom styles to hide scrollbars while keeping scroll functionality */}
//       <style jsx>{`
//         .hide-scrollbar {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
        
//         .hide-scrollbar::-webkit-scrollbar {
//           display: none;
//         }
//       `}</style>
//     </div>
//   )
// }

// export default Overview
import React, { useState, useEffect } from 'react'
import supabase from '../client'
import CommentsModal from '../components/commentModal'
import '../index.css'
import { MdFrontHand, MdMessage, MdNotifications, MdCheckCircle, MdDelete, MdClose } from 'react-icons/md';

const Overview = () => {
  const [recentProjects, setRecentProjects] = useState([])
  const [communityProjects, setCommunityProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)
  const [raisedHands, setRaisedHands] = useState({})
  const [userInterests, setUserInterests] = useState({})
  const [commentText, setCommentText] = useState({})
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    getCurrentUser()
  }, [])

  useEffect(() => {
    if (currentUser) {
      fetchProjects()
      fetchUserInterests()
      fetchNotifications()
      
      // Set up real-time subscription for notifications
      const subscription = supabase
        .channel('notifications-channel')
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'notifications',
            filter: `recipient_id=eq.${currentUser.id}`
          }, 
          (payload) => {
            // Add new notification to the list
            setNotifications(prev => [payload.new, ...prev])
            setUnreadCount(prev => prev + 1)
          }
        )
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [currentUser])

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUser(user)
  }

  const fetchNotifications = async () => {
    if (!currentUser) return

    const { data, error } = await supabase
      .from('notifications')
      .select(`
        *,
        sender:sender_id (username, email),
        project:project_id (title)
      `)
      .eq('recipient_id', currentUser.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (!error && data) {
      setNotifications(data)
      const unread = data.filter(n => !n.is_read).length
      setUnreadCount(unread)
    }
  }

  const markNotificationAsRead = async (notificationId) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)

    if (!error) {
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
  }

  const markAllNotificationsAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.is_read)
    
    for (const notification of unreadNotifications) {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notification.id)
    }

    setNotifications(prev => 
      prev.map(n => ({ ...n, is_read: true }))
    )
    setUnreadCount(0)
  }

  const createNotification = async (recipientId, senderId, projectId, projectTitle, type, message) => {
    const { error } = await supabase
      .from('notifications')
      .insert([
        {
          recipient_id: recipientId,
          sender_id: senderId,
          project_id: projectId,
          project_title: projectTitle,
          type: type,
          message: message
        }
      ])

    if (error) {
      console.error('Error creating notification:', error)
    }
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
      // Fetch current user's projects (last 2 added) - only projects belonging to current user
      const { data: userProjects, error: userError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false })
        .limit(2)

      if (userError) {
        console.error('Error fetching user projects:', userError)
      } else {
        console.log('User projects (only current user):', userProjects)
        setRecentProjects(userProjects || [])
      }

      // Fetch ALL projects from database for community projects (all users)
      const { data: allProjects, error: allError } = await supabase
        .from('projects')
        .select(`
          *,
          profiles(
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
        console.log('All projects from database (all users):', allProjects)
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

    // Get project details for notification
    const project = communityProjects.find(p => p.id === projectId)
    
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
        
        // Create notification for project owner
        if (project && project.user_id !== currentUser.id) {
          await createNotification(
            project.user_id,
            currentUser.id,
            projectId,
            project.title,
            'raised_hand',
            `${currentUser.email} is interested in collaborating on your project`
          )
        }
      }
    }
  }

  const handleCommentSubmit = async (projectId) => {
    if (!commentText[projectId]?.trim()) {
      alert('Please enter a comment')
      return
    }

    // Get project details for notification
    const project = communityProjects.find(p => p.id === projectId)

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
      
      // Create notification for project owner
      if (project && project.user_id !== currentUser.id) {
        await createNotification(
          project.user_id,
          currentUser.id,
          projectId,
          project.title,
          'comment',
          `${currentUser.email} commented: "${commentText[projectId].substring(0, 100)}${commentText[projectId].length > 100 ? '...' : ''}"`
        )
      }
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
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Invalid date'
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    } catch (error) {
      console.error('Date formatting error:', error)
      return 'Invalid date'
    }
  }

  const formatNotificationDate = (dateString) => {
    if (!dateString) return 'Not set'
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-300 border-t-green-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-green-200 mt-4">Loading overview...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-black py-8 px-4">
      <div className="featureHeader text-center mb-12 relative">
        <h1 className='featureTitle text-4xl md:text-5xl font-bold text-white mb-2'>Overview</h1>
        <p className='featureSlogan text-green-200 text-lg'>Browse and interact with all projects in the database</p>
        
        {/* Notification Bell - Moved to right end */}
        <div className="absolute top-0 right-0">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="bg-white/10 backdrop-blur-sm p-2 rounded-full hover:bg-white/20 transition-colors relative"
          >
            <MdNotifications size={24} className="text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>
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
            <div className="absolute top-12 right-0 w-96 bg-white rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="bg-gradient-to-r from-green-700 to-green-900 p-4 flex justify-between items-center">
                <h3 className="text-white font-semibold">Notifications</h3>
                <div className="flex gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-xs text-green-200 hover:text-white transition-colors"
                    >
                      Mark all as read
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-white/70 hover:text-white transition-colors"
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
                      onClick={() => markNotificationAsRead(notification.id)}
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
                            {formatNotificationDate(notification.created_at)}
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
      </div>

      <div className="overview-content grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* Left Side - Current User's Recent Projects */}
        <div className="recent-projects-side">
          <div className="section-header mb-6">
            <h2 className='text-center text-2xl font-semibold text-white mb-2'>My Projects</h2>
            <div className="w-20 h-1 bg-green-500 mx-auto rounded-full"></div>
            <p className="text-center text-green-300 text-sm mt-2">Showing your last 2 projects</p>
          </div>
          
          {recentProjects.length === 0 ? (
            <div className="empty-state bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center border border-green-500/30">
              <p className="text-green-200">You haven't created any projects yet.</p>
            </div>
          ) : (
            <div className="recent-projects-list space-y-4 max-h-[70vh] overflow-y-auto hide-scrollbar">
              {recentProjects.map(project => {
                const statusStyle = getStatusColor(project.status)
                return (
                  <div key={project.id} className="recent-project-card bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="project-card-header">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className='text-lg font-semibold text-gray-800'>{project.title}</h3>
                        <span 
                          className="status-badge rounded-full px-3 py-1 text-xs font-medium"
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
                        <span>📅 Started: {formatDate(project.start_date)}</span>
                      )}
                      {project.end_date && (
                        <span>📅 Ends: {formatDate(project.end_date)}</span>
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
          <div className="section-header mb-6">
            <h2 className='text-center text-2xl font-semibold text-white mb-2'>Collaborate</h2>
            <div className="w-20 h-1 bg-green-500 mx-auto rounded-full mb-2"></div>
            <span className="project-count text-sm text-green-300 block text-center">Total Projects: {communityProjects.length}</span>
          </div>

          {communityProjects.length === 0 ? (
            <div className="empty-state bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center border border-green-500/30">
              <p className="text-green-200">No projects found in the database.</p>
            </div>
          ) : (
            <div className="community-projects-list space-y-4 max-h-[70vh] overflow-y-auto hide-scrollbar">
              {communityProjects.map(project => {
                const statusStyle = getStatusColor(project.status)
                return (
                  <div key={project.id} className="community-project-card bg-white rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="project-header-info">
                      <div className="project-title-section flex items-center justify-between mb-2">
                        <h3 className='text-lg font-semibold text-gray-800'>{project.title}</h3>
                        <span 
                          className="status-badge rounded-full px-3 py-1 text-xs font-medium"
                          style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                        >
                          {project.status?.replace('-', ' ') || 'Planning'}
                        </span>
                      </div>
                      <div className="project-author text-xs text-gray-600 mb-2 pb-2 border-b border-gray-100">
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
                          <span className="my-project-badge text-green-600 font-semibold ml-2">(Your Project)</span>
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
                        <span>📅 Start Date: {formatDate(project.start_date)}</span>
                      )}
                      {project.end_date && (
                        <span>📅 End Date: {formatDate(project.end_date)}</span>
                      )}
                    </div>

                    {/* Comment Input Section */}
                    <div className="comment-input-section mt-4">
                      <textarea
                        className="comment-textarea w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Write your comment here"
                        value={commentText[project.id] || ''}
                        onChange={(e) => setCommentText(prev => ({ ...prev, [project.id]: e.target.value }))}
                        rows="2"
                      />
                      <button 
                        className="submit-comment-btn mt-2 px-4 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors font-medium"
                        onClick={() => handleCommentSubmit(project.id)}
                      >
                        Submit Comment
                      </button>
                    </div>

                    <div className="project-actions flex gap-2 mt-3">
                      <button 
                        className="btn-comment px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors flex items-center gap-1"
                        onClick={() => setSelectedProject(project)}
                      >
                        <MdMessage /> View Comments
                      </button>
                      <button 
                        className={`btn-raise-hand px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 transition-colors ${
                          userInterests[project.id] 
                            ? 'bg-green-600 text-white hover:bg-green-700' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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

      {/* Custom styles to hide scrollbars while keeping scroll functionality */}
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default Overview