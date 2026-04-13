import React, { useState, useEffect } from 'react'
import supabase from '../client'

const CommentsModal = ({ project, onClose }) => {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    fetchComments()
    getCurrentUser()
  }, [project.id])

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUser(user)
  }

  const fetchComments = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        profiles:user_id (username, email)
      `)
      .eq('project_id', project.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching comments:', error)
      alert('Error loading comments: ' + error.message)
    } else {
      setComments(data || [])
    }
    setLoading(false)
  }

  const addComment = async () => {
    if (!newComment.trim()) {
      alert('Please enter a comment')
      return
    }

    setSubmitting(true)
    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          project_id: project.id,
          user_id: currentUser.id,
          comment: newComment
        }
      ])
      .select(`
        *,
        profiles:user_id (username, email)
      `)
      .single()

    if (error) {
      alert('Error adding comment: ' + error.message)
    } else {
      setComments([data, ...comments])
      setNewComment('')
    }
    setSubmitting(false)
  }

  const deleteComment = async (commentId) => {
    const confirmed = window.confirm('Are you sure you want to delete this comment?')
    if (!confirmed) return

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)

    if (error) {
      alert('Error deleting comment: ' + error.message)
    } else {
      setComments(comments.filter(c => c.id !== commentId))
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Comments - {project.title}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="comments-section">
          <div className="add-comment">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows="3"
            />
            <button onClick={addComment} disabled={submitting}>
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>

          <div className="comments-list">
            {loading ? (
              <p>Loading comments...</p>
            ) : comments.length === 0 ? (
              <p>No comments yet. Be the first to comment!</p>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-header">
                    <strong>{comment.profiles?.username || 'Anonymous'}</strong>
                    <span>{new Date(comment.created_at).toLocaleString()}</span>
                    {currentUser && comment.user_id === currentUser.id && (
                      <button 
                        className="delete-comment"
                        onClick={() => deleteComment(comment.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="comment-text">{comment.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommentsModal