// import React, { useState, useEffect } from 'react'
// // import supabase from '../client'
// import '../index.css'
// import { FaTrophy, FaUsers, FaStar, FaBullseye, FaUser, FaBriefcase, FaCalendarAlt, FaRocket, FaLightbulb, FaFire, FaGem, FaMedal, FaPalette, FaWrench } from 'react-icons/fa'
// import { GiPartyPopper } from 'react-icons/gi'
// import { MdCelebration } from 'react-icons/md'

// const CelebrationWall = () => {
//   const [completedProjects, setCompletedProjects] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [stats, setStats] = useState({
//     total: 0,
//     uniqueUsers: 0,
//     mostRecent: null
//   })

//   useEffect(() => {
//     // fetchCompletedProjects()
//   }, [])

//   // const fetchCompletedProjects = async () => {
//   //   setLoading(true)
    
//   //   try {
//   //     // Fetch all completed projects
//   //     const { data, error } = await supabase
//   //       .from('completed_projects')
//   //       .select('*')
//   //       .order('completed_at', { ascending: false })

//   //     if (error) {
//   //       console.error('Error fetching completed projects:', error)
//   //       alert('Error loading celebration wall: ' + error.message)
//   //     } else {
//   //       setCompletedProjects(data || [])
        
//   //       // Calculate statistics
//   //       if (data && data.length > 0) {
//   //         const uniqueUsers = new Set(data.map(project => project.owner_username)).size
//   //         setStats({
//   //           total: data.length,
//   //           uniqueUsers: uniqueUsers,
//   //           mostRecent: data[0] // Most recent completed project
//   //         })
//   //       }
//   //     }
//   //   } catch (error) {
//   //     console.error('Error:', error)
//   //     alert('Error loading celebration wall: ' + error.message)
//   //   }
    
//   //   setLoading(false)
//   // }

//   const formatDate = (dateString) => {
//     if (!dateString) return 'Date not available'
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     })
//   }

//   const formatCompletedDate = (dateString) => {
//     if (!dateString) return 'Recently'
//     const date = new Date(dateString)
//     const now = new Date()
//     const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
    
//     if (diffDays === 0) return 'Today'
//     if (diffDays === 1) return 'Yesterday'
//     if (diffDays < 7) return `${diffDays} days ago`
//     return date.toLocaleDateString()
//   }

//   const getProjectIcon = (index) => {
//     const icons = [
//       <FaRocket key="rocket" className="text-5xl" />,
//       <FaLightbulb key="lightbulb" className="text-5xl" />,
//       <FaBullseye key="bullseye" className="text-5xl" />,
//       <FaStar key="star" className="text-5xl" />,
//       <FaFire key="fire" className="text-5xl" />,
//       <FaGem key="gem" className="text-5xl" />,
//       <FaMedal key="medal" className="text-5xl" />,
//       <FaPalette key="palette" className="text-5xl" />,
//       <FaWrench key="wrench" className="text-5xl" />,
//       <GiPartyPopper key="party" className="text-5xl" />
//     ]
//     return icons[index % icons.length]
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-black flex flex-col items-center justify-center">
//         <div className="w-12 h-12 border-4 border-green-300 border-t-green-600 rounded-full animate-spin"></div>
//         <p className="text-green-200 mt-4 text-lg">Loading celebrations...</p>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-black py-8 px-4">
//       <div className="featureHeader text-center mb-12">
//         <h1 className='featureTitle text-4xl md:text-5xl font-bold text-white mb-2'>Celebration Wall</h1>
//         <p className='featureSlogan text-green-200 text-lg'>Celebrating completed projects and achievements!</p>
//       </div>

//       {/* Statistics Section */}
//       {completedProjects.length > 0 && (
//         <div className="stats-container flex justify-center gap-6 mb-12 flex-wrap">
//           <div className="stat-card bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center min-w-[180px] border border-green-500/30 shadow-lg">
//             <div className="stat-icon text-4xl mb-2 flex justify-center">
//               <FaTrophy className="text-green-400" />
//             </div>
//             <div className="stat-number text-3xl font-bold text-green-400">{stats.total}</div>
//             <div className="stat-label text-green-200 text-sm uppercase tracking-wide">Completed Projects</div>
//           </div>
//           <div className="stat-card bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center min-w-[180px] border border-green-500/30 shadow-lg">
//             <div className="stat-icon text-4xl mb-2 flex justify-center">
//               <FaUsers className="text-green-400" />
//             </div>
//             <div className="stat-number text-3xl font-bold text-green-400">{stats.uniqueUsers}</div>
//             <div className="stat-label text-green-200 text-sm uppercase tracking-wide">Contributors</div>
//           </div>
//           {stats.mostRecent && (
//             <div className="stat-card bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center min-w-[180px] border border-green-500/30 shadow-lg">
//               <div className="stat-icon text-4xl mb-2 flex justify-center">
//                 <FaStar className="text-green-400" />
//               </div>
//               <div className="stat-number text-3xl font-bold text-green-400">{formatCompletedDate(stats.mostRecent.completed_at)}</div>
//               <div className="stat-label text-green-200 text-sm uppercase tracking-wide">Latest Completion</div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Completed Projects Grid */}
//       {completedProjects.length === 0 ? (
//         <div className="empty-celebration bg-white/10 backdrop-blur-sm rounded-2xl p-12 text-center max-w-md mx-auto border border-green-500/30">
//           <div className="empty-icon text-6xl mb-4 flex justify-center">
//             <FaBullseye className="text-green-400" />
//           </div>
//           <h2 className="text-2xl font-bold text-white mb-2">No Completed Projects Yet</h2>
//           <p className="text-green-200 mb-6">When projects are marked as completed, they will appear here for celebration!</p>
//           <button 
//             className="goto-projects-btn bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
//             onClick={() => window.location.href = '/projects'}
//           >
//             Go to Projects
//           </button>
//         </div>
//       ) : (
//         <>
//           <div className="celebration-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
//             {completedProjects.map((project, index) => (
//               <div 
//                 key={project.id} 
//                 className="celebration-card bg-white rounded-xl p-6 relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
//                 style={{ animationDelay: `${index * 0.1}s` }}
//               >
//                 <div className="celebration-badge absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
//                   <FaTrophy className="text-xs" />
//                   <span className="badge-text">Completed</span>
//                 </div>
                
//                 <h3 className="project-title text-xl font-bold text-gray-800 text-center mb-4">{project.project_name}</h3>
                
//                 <div className="project-owner bg-gray-50 rounded-lg p-3 mb-4">
//                   <div className="owner-info flex items-center gap-2 text-sm text-gray-700 mb-2">
//                     <FaUser className="text-green-600" />
//                     <span className="owner-name font-semibold">{project.owner_username}</span>
//                   </div>
//                   {project.owner_role && (
//                     <div className="role-info flex items-center gap-2 text-sm text-gray-600">
//                       <FaBriefcase className="text-green-600" />
//                       <span className="role-name">{project.owner_role}</span>
//                     </div>
//                   )}
//                 </div>
                
//                 <div className="project-completion bg-green-50 rounded-lg p-3 mb-4">
//                   <div className="completion-date flex items-center gap-2 text-sm text-green-800 mb-1">
//                     <FaCalendarAlt className="text-green-600" />
//                     <span>Completed on: {formatDate(project.end_date)}</span>
//                   </div>
//                   <div className="completed-ago text-xs text-green-600 text-right">
//                     {formatCompletedDate(project.completed_at)}
//                   </div>
//                 </div>
                
//                 <div className="celebration-message bg-gradient-to-r from-green-500 to-green-700 text-white text-center py-2 rounded-lg font-semibold animate-pulse flex items-center justify-center gap-2">
//                   <GiPartyPopper />
//                   <span>Congratulations!</span>
//                   <GiPartyPopper />
//                 </div>
//               </div>
//             ))}
//           </div>
          
//           {/* Celebration Message */}
//           <div className="celebration-footer text-center mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-xl max-w-2xl mx-auto border border-green-500/30">
//             <p className="text-green-200 text-lg flex items-center justify-center gap-2">
//               <MdCelebration />
//               Keep up the amazing work! Every completed project is a step towards success!
//               <MdCelebration />
//             </p>
//           </div>
//         </>
//       )}
//     </div>
//   )
// }

// export default CelebrationWall
import React from 'react'

const CelebrationWall = () => {
  return (
    <div>
      The celebration wall is under construction. Stay tuned for updates!
    </div>
  )
}

export default CelebrationWall
