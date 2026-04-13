import React, { useState, useEffect } from 'react'
import supabase from '../client'

const EditProfile = ({ userId, onProfileUpdate, onCancel }) => {
  const [profile, setProfile] = useState({
    age: '',
    gender: '',
    phone_number: '',
    organisation: '',
    department: '',
    role: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Fetch existing profile data
  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
      } else if (data) {
        setProfile({
          age: data.age || '',
          gender: data.gender || '',
          phone_number: data.phone_number || '',
          organisation: data.organisation || '',
          department: data.department || '',
          role: data.role || ''
        })
      }
      setLoading(false)
    }

    fetchProfile()
  }, [userId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const { data, error } = await supabase
      .from('profiles')
      .update({
        age: profile.age ? parseInt(profile.age) : null,
        gender: profile.gender,
        phone_number: profile.phone_number,
        organisation: profile.organisation,
        department: profile.department,
        role: profile.role,
        updated_at: new Date()
      })
      .eq('id', userId)
      .select()

    if (error) {
      alert('Error updating profile: ' + error.message)
    } else {
      alert('Profile updated successfully!')
      if (onProfileUpdate) onProfileUpdate(data[0])
      if (onCancel) onCancel()
    }
    setSaving(false)
  }

  if (loading) return <div>Loading profile...</div>

  return (
    <div className="edit-profile">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Age:</label>
          <input
            type="number"
            name="age"
            value={profile.age}
            onChange={handleChange}
            placeholder="Enter your age"
          />
        </div>

        <div>
          <label>Gender:</label>
          <select name="gender" value={profile.gender} onChange={handleChange}>
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>

        <div>
          <label>Phone Number:</label>
          <input
            type="tel"
            name="phone_number"
            value={profile.phone_number}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />
        </div>

        <div>
          <label>Organisation:</label>
          <input
            type="text"
            name="organisation"
            value={profile.organisation}
            onChange={handleChange}
            placeholder="Enter your organisation"
          />
        </div>

        <div>
          <label>Department:</label>
          <input
            type="text"
            name="department"
            value={profile.department}
            onChange={handleChange}
            placeholder="Enter your department"
          />
        </div>

        <div>
          <label>Role:</label>
          <input
            type="text"
            name="role"
            value={profile.role}
            onChange={handleChange}
            placeholder="Enter your role"
          />
        </div>

        <div className="form-buttons">
          <button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditProfile