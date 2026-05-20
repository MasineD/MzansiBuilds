// // import React, { useState, useEffect } from 'react'
// // // import supabase from '../client'
// // import { MdClose, MdDelete, MdSend } from 'react-icons/md'

// // const CommentsModal = ({ project, onCancel }) => {
// //   const [comments, setComments] = useState([])
// //   const [newComment, setNewComment] = useState('')
// //   const [loading, setLoading] = useState(true)
// //   const [submitting, setSubmitting] = useState(false)
// //   const [currentUser, setCurrentUser] = useState(null)

// //   useEffect(() => {
// //     fetchComments()
// //     getCurrentUser()
// //   }, [project.id])

// //   const getCurrentUser = async () => {
// //     // const { data: { user } } = await supabase.auth.getUser()
// //     setCurrentUser(user)
// //   }

// //   const fetchComments = async () => {
// //     setLoading(true)
// //     // const { data, error } = await supabase
// //     //   .from('comments')
// //     //   .select(`
// //     //     *,
// //     //     profiles:user_id (username, email)
// //     //   `)
// //     //   .eq('project_id', project.id)
// //     //   .order('created_at', { ascending: false })

// //     if (error) {
// //       console.error('Error fetching comments:', error)
// //       alert('Error loading comments: ' + error.message)
// //     } else {
// //       setComments(data || [])
// //     }
// //     setLoading(false)
// //   }

// //   const addComment = async () => {
// //     if (!newComment.trim()) {
// //       alert('Please enter a comment')
// //       return
// //     }

// //     setSubmitting(true)
// //     // const { data, error } = await supabase
// //     //   .from('comments')
// //     //   .insert([
// //     //     {
// //     //       project_id: project.id,
// //     //       user_id: currentUser.id,
// //     //       comment: newComment
// //     //     }
// //     //   ])
// //     //   .select(`
// //     //     *,
// //     //     profiles:user_id (username, email)
// //     //   `)
// //     //   .single()

// //     if (error) {
// //       alert('Error adding comment: ' + error.message)
// //     } else {
// //       setComments([data, ...comments])
// //       setNewComment('')
// //     }
// //     setSubmitting(false)
// //   }

// //   const deleteComment = async (commentId) => {
// //     const confirmed = window.confirm('Are you sure you want to delete this comment?')
// //     if (!confirmed) return

// //     // const { error } = await supabase
// //     //   .from('comments')
// //     //   .delete()
// //     //   .eq('id', commentId)

// //     if (error) {
// //       alert('Error deleting comment: ' + error.message)
// //     } else {
// //       setComments(comments.filter(c => c.id !== commentId))
// //     }
// //   }

// //   const formatDate = (dateString) => {
// //     const date = new Date(dateString)
// //     const now = new Date()
// //     const diffMs = now - date
// //     const diffMins = Math.floor(diffMs / 60000)
// //     const diffHours = Math.floor(diffMs / 3600000)
// //     const diffDays = Math.floor(diffMs / 86400000)

// //     if (diffMins < 1) return 'Just now'
// //     if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
// //     if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
// //     if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
// //     return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
// //   }

// //   return (
// //     <div 
// //       className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
// //       onClick={onCancel}
// //     >
// //       <div 
// //         className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
// //         onClick={(e) => e.stopPropagation()}
// //       >
// //         {/* Modal Header - Green Theme */}
// //         <div className="flex justify-between items-start p-6 border-b border-gray-200 bg-gradient-to-r from-green-700 to-green-900">
// //           <div className="flex-1">
// //             <h2 className="text-2xl font-bold text-white mb-1">Comments</h2>
// //             <p className="text-sm text-green-100">{project.title}</p>
// //           </div>
// //           <button 
// //             className="text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10 cursor-pointer"
// //             onClick={onCancel}
// //           >
// //             <MdClose size={24} />
// //           </button>
// //         </div>

// //         {/* Modal Body */}
// //         <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
// //           {/* Add Comment Section */}
// //           <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
// //             <textarea
// //               className="w-full p-3 border border-gray-300 rounded-lg font-inherit text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white text-gray-800"
// //               value={newComment}
// //               onChange={(e) => setNewComment(e.target.value)}
// //               placeholder="Write a comment..."
// //               rows="3"
// //             />
// //             <button 
// //               className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
// //               onClick={addComment} 
// //               disabled={submitting}
// //             >
// //               <MdSend size={18} />
// //               {submitting ? 'Posting...' : 'Post Comment'}
// //             </button>
// //           </div>

// //           {/* Comments List */}
// //           <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
// //             {loading ? (
// //               <div className="flex flex-col items-center justify-center py-12">
// //                 <div className="w-10 h-10 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
// //                 <p className="mt-3 text-gray-600 text-sm">Loading comments...</p>
// //               </div>
// //             ) : comments.length === 0 ? (
// //               <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-xl border border-gray-200">
// //                 <p className="text-gray-700 font-medium">No comments yet</p>
// //                 <p className="text-xs text-gray-500 mt-1">Be the first to comment on this project</p>
// //               </div>
// //             ) : (
// //               comments.map(comment => (
// //                 <div key={comment.id} className="flex gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
// //                   {/* Avatar - Green Theme */}
// //                   <div className="flex-shrink-0">
// //                     <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
// //                       {comment.profiles?.username?.charAt(0).toUpperCase() || 'U'}
// //                     </div>
// //                   </div>
                  
// //                   {/* Comment Content */}
// //                   <div className="flex-1">
// //                     <div className="flex justify-between items-start mb-2">
// //                       <div className="flex items-center gap-2 flex-wrap">
// //                         <span className="font-semibold text-gray-800 text-sm">
// //                           {comment.profiles?.username || 'Anonymous User'}
// //                         </span>
// //                         <span className="text-xs text-gray-500">
// //                           {formatDate(comment.created_at)}
// //                         </span>
// //                       </div>
// //                       {currentUser && comment.user_id === currentUser.id && (
// //                         <button 
// //                           className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50"
// //                           onClick={() => deleteComment(comment.id)}
// //                         >
// //                           <MdDelete size={16} />
// //                         </button>
// //                       )}
// //                     </div>
// //                     <p className="text-gray-700 text-sm leading-relaxed">{comment.comment}</p>
// //                   </div>
// //                 </div>
// //               ))
// //             )}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Custom scrollbar styles */}
// //       <style jsx>{`
// //         .custom-scrollbar {
// //           scrollbar-width: thin;
// //           scrollbar-color: #22c55e #e5e7eb;
// //         }
// //         .custom-scrollbar::-webkit-scrollbar {
// //           width: 6px;
// //         }
// //         .custom-scrollbar::-webkit-scrollbar-track {
// //           background: #e5e7eb;
// //           border-radius: 10px;
// //         }
// //         .custom-scrollbar::-webkit-scrollbar-thumb {
// //           background: #22c55e;
// //           border-radius: 10px;
// //         }
// //         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
// //           background: #16a34a;
// //         }
// //         @keyframes fade-in {
// //           from {
// //             opacity: 0;
// //             transform: scale(0.95) translateY(-20px);
// //           }
// //           to {
// //             opacity: 1;
// //             transform: scale(1) translateY(0);
// //           }
// //         }
// //         .animate-in {
// //           animation: fade-in 0.3s ease-out;
// //         }
// //       `}</style>
// //     </div>
// //   )
// // }

// // export default CommentsModal

// import React, { useState, useEffect } from 'react'
// import { MdClose, MdDelete, MdSend } from 'react-icons/md'

// // ========== UPDATED: Accept socket and currentUser as props ==========
// const CommentsModal = ({ project, onCancel, currentUser, socket }) => {
//   const [comments, setComments] = useState([])
//   const [newComment, setNewComment] = useState('')
//   const [loading, setLoading] = useState(true)
//   const [submitting, setSubmitting] = useState(false)

//   useEffect(() => {
//     fetchComments()
//   }, [project.id])

//   const fetchComments = async () => {
//     setLoading(true)
//     // Fetch comments from your backend API
//     try {
//       // Assuming you have an API endpoint to fetch comments
//       const response = await fetch(`http://localhost:5000/api/comments/${project.id}`);
//       const data = await response.json();
//       setComments(data || []);
//     } catch (error) {
//       console.error('Error fetching comments:', error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   // ========== UPDATED: Add comment with socket notification ==========
//   const addComment = async () => {
//     if (!newComment.trim()) {
//       alert('Please enter a comment')
//       return
//     }

//     setSubmitting(true)
    
//     try {
//       // Save comment to database
//       const response = await fetch('http://localhost:5000/api/comments', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           project_id: project.id,
//           user_id: currentUser?.id,
//           comment: newComment
//         })
//       });
      
//       const data = await response.json();
      
//       // Add comment to local state
//       const newCommentObj = {
//         id: data.id,
//         comment: newComment,
//         user_id: currentUser?.id,
//         created_at: new Date().toISOString(),
//         profiles: {
//           username: currentUser?.name
//         }
//       };
      
//       setComments([newCommentObj, ...comments])
//       setNewComment('')
      
//       // ========== NEW: Send notification to project owner via socket ==========
//       if (socket && project.user_id !== currentUser?.id) {
//         socket.emit('send-comment', {
//           projectOwnerId: project.user_id,
//           projectTitle: project.title,
//           commenterName: currentUser?.name || 'Someone',
//           commentText: newComment,
//           projectId: project.id
//         });
//       }
      
//     } catch (error) {
//       console.error('Error adding comment:', error);
//       alert('Error adding comment: ' + error.message);
//     }
//     setSubmitting(false)
//   }

//   const deleteComment = async (commentId) => {
//     const confirmed = window.confirm('Are you sure you want to delete this comment?')
//     if (!confirmed) return

//     try {
//       await fetch(`http://localhost:5000/api/comments/${commentId}`, {
//         method: 'DELETE'
//       });
//       setComments(comments.filter(c => c.id !== commentId))
//     } catch (error) {
//       console.error('Error deleting comment:', error);
//       alert('Error deleting comment: ' + error.message);
//     }
//   }

//   const formatDate = (dateString) => {
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
//     return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
//   }

//   return (
//     <div 
//       className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
//       onClick={onCancel}
//     >
//       <div 
//         className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Modal Header - Green Theme */}
//         <div className="flex justify-between items-start p-6 border-b border-gray-200 bg-gradient-to-r from-green-700 to-green-900">
//           <div className="flex-1">
//             <h2 className="text-2xl font-bold text-white mb-1">Comments</h2>
//             <p className="text-sm text-green-100">{project.title}</p>
//           </div>
//           <button 
//             className="text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10 cursor-pointer"
//             onClick={onCancel}
//           >
//             <MdClose size={24} />
//           </button>
//         </div>

//         {/* Modal Body */}
//         <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
//           {/* Add Comment Section */}
//           <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
//             <textarea
//               className="w-full p-3 border border-gray-300 rounded-lg font-inherit text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white text-gray-800"
//               value={newComment}
//               onChange={(e) => setNewComment(e.target.value)}
//               placeholder="Write a comment..."
//               rows="3"
//             />
//             <button 
//               className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
//               onClick={addComment} 
//               disabled={submitting}
//             >
//               <MdSend size={18} />
//               {submitting ? 'Posting...' : 'Post Comment'}
//             </button>
//           </div>

//           {/* Comments List */}
//           <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
//             {loading ? (
//               <div className="flex flex-col items-center justify-center py-12">
//                 <div className="w-10 h-10 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
//                 <p className="mt-3 text-gray-600 text-sm">Loading comments...</p>
//               </div>
//             ) : comments.length === 0 ? (
//               <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-xl border border-gray-200">
//                 <p className="text-gray-700 font-medium">No comments yet</p>
//                 <p className="text-xs text-gray-500 mt-1">Be the first to comment on this project</p>
//               </div>
//             ) : (
//               comments.map(comment => (
//                 <div key={comment.id} className="flex gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
//                   {/* Avatar - Green Theme */}
//                   <div className="flex-shrink-0">
//                     <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
//                       {comment.profiles?.username?.charAt(0).toUpperCase() || 'U'}
//                     </div>
//                   </div>
                  
//                   {/* Comment Content */}
//                   <div className="flex-1">
//                     <div className="flex justify-between items-start mb-2">
//                       <div className="flex items-center gap-2 flex-wrap">
//                         <span className="font-semibold text-gray-800 text-sm">
//                           {comment.profiles?.username || 'Anonymous User'}
//                         </span>
//                         <span className="text-xs text-gray-500">
//                           {formatDate(comment.created_at)}
//                         </span>
//                       </div>
//                       {currentUser && comment.user_id === currentUser.id && (
//                         <button 
//                           className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50"
//                           onClick={() => deleteComment(comment.id)}
//                         >
//                           <MdDelete size={16} />
//                         </button>
//                       )}
//                     </div>
//                     <p className="text-gray-700 text-sm leading-relaxed">{comment.comment}</p>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Custom scrollbar styles */}
//       <style jsx>{`
//         .custom-scrollbar {
//           scrollbar-width: thin;
//           scrollbar-color: #22c55e #e5e7eb;
//         }
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 6px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: #e5e7eb;
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #22c55e;
//           border-radius: 10px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #16a34a;
//         }
//       `}</style>
//     </div>
//   )
// }

// export default CommentsModal

import React, { useState, useEffect } from 'react'
import { MdClose, MdDelete, MdSend } from 'react-icons/md'
import axios from 'axios'

const CommentsModal = ({ project, onCancel, currentUser, socket }) => {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Fetch comments from the backend using Axios
  const fetchComments = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`http://localhost:5000/api/comments/project/${project.id}`, {
        withCredentials: true
      })
      setComments(response.data || [])
    } catch (error) {
      console.error('Error fetching comments:', error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (project?.id) {
      fetchComments()
    }
  }, [project?.id])

  // Add a new comment using Axios
  const addComment = async () => {
    if (!newComment.trim()) {
      alert('Please enter a comment')
      return
    }

    setSubmitting(true)
    
    try {
      const response = await axios.post('http://localhost:5000/api/comments', 
        {
          project_id: project.id,
          description: newComment
        },
        { withCredentials: true }
      )
      
      // Add the new comment to the list with user details
      const newCommentObj = {
        id: response.data.comment.id,
        project_id: project.id,
        user_id: currentUser?.id,
        description: newComment,
        created_at: new Date().toISOString(),
        user_name: currentUser?.name || 'You',
        user_email: currentUser?.email
      }
      
      setComments([newCommentObj, ...comments])
      setNewComment('')
      
      // Send notification to project owner via socket (if not commenting on own project)
      if (socket && project.user_id !== currentUser?.id) {
        socket.emit('send-comment', {
          projectOwnerId: project.user_id,
          projectTitle: project.title,
          commenterName: currentUser?.name || 'Someone',
          commenterEmail: currentUser?.email,
          commentText: newComment,
          projectId: project.id
        })
      }
      
    } catch (error) {
      console.error('Error adding comment:', error.response?.data || error.message)
      alert(error.response?.data?.msg || 'Error adding comment')
    }
    setSubmitting(false)
  }

  // Delete a comment using Axios
  const deleteComment = async (commentId) => {
    const confirmed = window.confirm('Are you sure you want to delete this comment?')
    if (!confirmed) return

    try {
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`, {
        withCredentials: true
      })
      setComments(comments.filter(c => c.id !== commentId))
    } catch (error) {
      console.error('Error deleting comment:', error.response?.data || error.message)
      alert(error.response?.data?.msg || 'Error deleting comment')
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Just now'
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

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-start p-6 border-b border-gray-200 bg-gradient-to-r from-green-700 to-green-900">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-1">Comments</h2>
            <p className="text-sm text-green-100">{project.title}</p>
          </div>
          <button 
            className="text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10 cursor-pointer"
            onClick={onCancel}
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {/* Add Comment Section */}
          <div className="mb-6 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg font-inherit text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white text-gray-800"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows="3"
            />
            <button 
              className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg cursor-pointer"
              onClick={addComment} 
              disabled={submitting}
            >
              <MdSend size={18} />
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>

          {/* Comments List */}
          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-10 h-10 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
                <p className="mt-3 text-gray-600 text-sm">Loading comments...</p>
              </div>
            ) : comments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-xl border border-gray-200">
                <p className="text-gray-700 font-medium">No comments yet</p>
                <p className="text-xs text-gray-500 mt-1">Be the first to comment on this project</p>
              </div>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="flex gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                      {comment.user_name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </div>
                  
                  {/* Comment Content */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-800 text-sm">
                          {comment.user_name || 'Anonymous User'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      {currentUser && comment.user_id === currentUser.id && (
                        <button 
                          className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50 cursor-pointer"
                          onClick={() => deleteComment(comment.id)}
                        >
                          <MdDelete size={16} />
                        </button>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{comment.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #22c55e #e5e7eb;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #22c55e;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #16a34a;
        }
      `}</style>
    </div>
  )
}

export default CommentsModal