import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FaPencilAlt, FaTimes } from 'react-icons/fa'

const EditProfile = ({ closeProfile }) => {

  // console.log("Checking the onCancel prop:", typeof closeProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    phonenumber: '',
    organization: '',
    role: ''
  })

  // Fetch profile details from the backend
  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:5000/api/profile', {
        withCredentials: true
      })
      const profile = response.data
      setFormData({
        name: profile.name || '',
        age: profile.age || '',
        gender: profile.gender || '',
        phonenumber: profile.phonenumber || '',
        organization: profile.organization || '',
        role: profile.role || ''
      })
    } catch (error) {
      console.error('Error fetching profile:', error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  // Save profile details to the backend
  const handleSaveProfile = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.put('http://localhost:5000/api/profile', formData, {
        withCredentials: true
      })
      console.log('Profile updated successfully:', response.data)
      alert('Profile updated successfully!')
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving profile:', error.response?.data || error.message)
      alert(error.response?.data?.msg || 'Error updating profile')
    }
  }

  // Fetch profile when component mounts
  useEffect(() => {
    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-8">
          <p className="text-gray-800">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-300 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <div className="sticky top-0 p-6 z-10 bg-white">
          <div className='flex items-center justify-end'>
            <FaTimes className="text-gray-600 hover:text-gray-800 hover:scale-110 transition-transform cursor-pointer" onClick={closeProfile} size={25}/>
          </div>
          <div className='flex items-center justify-center'>
            <h2 className="text-2xl font-bold text-black">
              My Profile
            </h2>
          </div>
          <form onSubmit={handleSaveProfile} className="p-6">
            <div className="space-y-6">
              <div className="space-y-4">
                
                {/* Fullname Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fullname
                  </label>
                  <input 
                    type="text" 
                    placeholder={formData.name || "Full Name"} 
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00ff00] focus:border-[#00ff00] transition-all text-gray-800 disabled:bg-gray-100" 
                    disabled={!isEditing}
                  />
                </div>
                
                {/* Age Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Age
                  </label>
                  <input 
                    type="number" 
                    placeholder="Age" 
                    value={formData.age || ''} 
                    onChange={e => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00ff00] focus:border-[#00ff00] transition-all text-gray-800 disabled:bg-gray-100" 
                    disabled={!isEditing}
                  />
                </div>
                
                {/* Gender Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Gender
                  </label>
                  <select 
                    value={formData.gender || ''} 
                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00ff00] focus:border-[#00ff00] transition-all text-gray-800 disabled:bg-gray-100"
                    disabled={!isEditing}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                
                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone
                  </label>
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    value={formData.phonenumber || ''} 
                    onChange={e => setFormData({ ...formData, phonenumber: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00ff00] focus:border-[#00ff00] transition-all text-gray-800 disabled:bg-gray-100" 
                    disabled={!isEditing}
                  />
                </div>
                
                {/* Organisation Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Organisation
                  </label>
                  <input 
                    type="text" 
                    placeholder="Organisation" 
                    value={formData.organization || ''} 
                    onChange={e => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00ff00] focus:border-[#00ff00] transition-all text-gray-800 disabled:bg-gray-100" 
                    disabled={!isEditing}
                  />
                </div>
                
                {/* Role Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Role
                  </label>
                  <input 
                    type="text" 
                    placeholder="Role" 
                    value={formData.role || ''} 
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00ff00] focus:border-[#00ff00] transition-all text-gray-800 disabled:bg-gray-100" 
                    disabled={!isEditing}
                  />
                </div>
                
                {/* Buttons to edit and save changes */}
                <div className='flex items-center justify-end gap-4 mt-6'>
                  {!isEditing && (
                    <button type="button" onClick={() => setIsEditing(true)} 
                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer gap-2">
                      <FaPencilAlt />Edit
                    </button>
                  )}
                  {isEditing && (
                    <div className='flex gap-2'>
                      <button type="button" onClick={() => setIsEditing(false)} 
                      className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer">
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer">
                      Save
                    </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditProfile