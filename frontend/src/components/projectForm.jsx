// import React, { useState, useEffect } from 'react'
// import supabase from '../client'
// import { FaSave, FaTimes, FaCheck, FaCircle, FaPlus, FaTrash, FaEye } from 'react-icons/fa'

// const ProjectForm = ({ project, onSubmit, onCancel, isReadOnly = false }) => {
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     start_date: '',
//     end_date: '',
//     status: 'planning'
//   })
//   const [milestones, setMilestones] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [fetchingMilestones, setFetchingMilestones] = useState(false)
//   const [dateError, setDateError] = useState('')

//   useEffect(() => {
//     if (project && project.id) {
//       // Editing existing project
//       setFormData({
//         title: project.title || '',
//         description: project.description || '',
//         start_date: project.start_date || '',
//         end_date: project.end_date || '',
//         status: project.status || 'planning'
//       })
//       fetchExistingMilestones(project.id)
//     } else {
//       // New project - start with no milestones
//       setMilestones([])
//     }
//   }, [project])

//   const fetchExistingMilestones = async (projectId) => {
//     setFetchingMilestones(true)
//     try {
//       const { data, error } = await supabase
//         .from('milestones')
//         .select('*')
//         .eq('project_id', projectId)
//         .order('display_order', { ascending: true })

//       if (error) {
//         console.error('Error fetching milestones:', error)
//         setMilestones([])
//       } else if (data && data.length > 0) {
//         setMilestones(data)
//       } else {
//         setMilestones([])
//       }
//     } catch (error) {
//       console.error('Error:', error)
//       setMilestones([])
//     } finally {
//       setFetchingMilestones(false)
//     }
//   }

//   const validateDates = (startDate, endDate) => {
//     if (startDate && endDate) {
//       const start = new Date(startDate)
//       const end = new Date(endDate)
//       if (start > end) {
//         setDateError('Start date cannot be later than end date')
//         return false
//       }
//     }
//     setDateError('')
//     return true
//   }

//   const handleDateChange = (field, value) => {
//     if (isReadOnly) return
//     const updatedFormData = { ...formData, [field]: value }
//     setFormData(updatedFormData)
    
//     if (field === 'start_date') {
//       validateDates(value, updatedFormData.end_date)
//     } else if (field === 'end_date') {
//       validateDates(updatedFormData.start_date, value)
//     }
//   }

  // const addMilestone = () => {
  //   if (isReadOnly) return
  //   if (milestones.length < 10) {
  //     const newMilestone = {
  //       id: `temp-${Date.now()}-${milestones.length}`,
  //       title: '',
  //       description: '',
  //       status: 'incomplete',
  //       display_order: milestones.length
  //     }
  //     setMilestones([...milestones, newMilestone])
  //   }
  // }

  // const removeMilestone = (index) => {
  //   if (isReadOnly) return
  //   const updatedMilestones = milestones.filter((_, i) => i !== index)
  //   // Update display order
  //   updatedMilestones.forEach((milestone, idx) => {
  //     milestone.display_order = idx
  //   })
  //   setMilestones(updatedMilestones)
  // }

  // const handleMilestoneChange = (index, field, value) => {
  //   if (isReadOnly) return
  //   const updatedMilestones = [...milestones]
  //   updatedMilestones[index][field] = value
  //   setMilestones(updatedMilestones)
  // }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
    
//     if (isReadOnly) return
    
//     // Validate dates before submission
//     if (formData.start_date && formData.end_date) {
//       const start = new Date(formData.start_date)
//       const end = new Date(formData.end_date)
//       if (start > end) {
//         alert('Start date cannot be later than end date. Please correct the dates.')
//         return
//       }
//     }
    
//     setLoading(true)
    
//     try {
//       // Filter out milestones with empty titles
//       const validMilestones = milestones.filter(m => m.title && m.title.trim() !== '')
      
//       await onSubmit(formData, validMilestones)
//     } catch (error) {
//       console.error('Error submitting form:', error)
//       alert('Error saving project: ' + error.message)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const getMilestoneStatusColor = (status) => {
//     return status === 'complete' 
//       ? 'text-green-600 bg-green-50' 
//       : 'text-gray-500 bg-gray-50'
//   }

//   if (fetchingMilestones) {
//     return (
//       <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//         <div className="bg-white rounded-2xl p-8">
//           <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
//           <p className="text-gray-600 mt-4">Loading milestones...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-300 custom-scrollbar">
//         <div className={`sticky top-0 p-6 border-b z-10 ${
//           isReadOnly 
//             ? 'bg-gradient-to-r from-green-700 to-green-900 border-green-600' 
//             : 'bg-gradient-to-r from-green-700 to-green-900 border-green-600'
//         }`}>
//           <h2 className="text-2xl font-bold text-white">
//             {isReadOnly ? 'Project Details' : (project && project.id ? 'Edit Project' : 'Add New Project')}
//           </h2>
//         </div>
        
//         <form onSubmit={handleSubmit} className="p-6">
//           <div className="space-y-6">
//             {/* Basic Project Information */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Project Information</h3>
              
//               {/* Title Field */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Title <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.title}
//                   onChange={(e) => !isReadOnly && setFormData({...formData, title: e.target.value})}
//                   required
//                   disabled={isReadOnly}
//                   placeholder="Enter project title"
//                   className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all text-gray-800 ${
//                     isReadOnly 
//                       ? 'bg-gray-100 border-gray-200 cursor-not-allowed' 
//                       : 'border-gray-300 focus:ring-green-500 focus:border-transparent'
//                   }`}
//                 />
//               </div>

//               {/* Description Field */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Description
//                 </label>
//                 <textarea
//                   value={formData.description}
//                   onChange={(e) => !isReadOnly && setFormData({...formData, description: e.target.value})}
//                   disabled={isReadOnly}
//                   rows="3"
//                   placeholder="Enter project description"
//                   className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all text-gray-800 resize-y ${
//                     isReadOnly 
//                       ? 'bg-gray-100 border-gray-200 cursor-not-allowed' 
//                       : 'border-gray-300 focus:ring-green-500 focus:border-transparent'
//                   }`}
//                 />
//               </div>

//               {/* Date Fields Row */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     Start Date
//                   </label>
//                   <input
//                     type="date"
//                     value={formData.start_date}
//                     onChange={(e) => handleDateChange('start_date', e.target.value)}
//                     disabled={isReadOnly}
//                     className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all text-gray-800 ${
//                       isReadOnly 
//                         ? 'bg-gray-100 border-gray-200 cursor-not-allowed' 
//                         : dateError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
//                     }`}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-semibold text-gray-700 mb-2">
//                     End Date
//                   </label>
//                   <input
//                     type="date"
//                     value={formData.end_date}
//                     onChange={(e) => handleDateChange('end_date', e.target.value)}
//                     disabled={isReadOnly}
//                     className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all text-gray-800 ${
//                       isReadOnly 
//                         ? 'bg-gray-100 border-gray-200 cursor-not-allowed' 
//                         : dateError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
//                     }`}
//                   />
//                 </div>
//               </div>
              
//               {/* Date Error Message */}
//               {dateError && !isReadOnly && (
//                 <div className="text-red-600 text-sm mt-1">
//                   {dateError}
//                 </div>
//               )}

//               {/* Status Field */}
//               <div>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Status
//                 </label>
//                 <select
//                   value={formData.status}
//                   onChange={(e) => !isReadOnly && setFormData({...formData, status: e.target.value})}
//                   disabled={isReadOnly}
//                   className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
//                     isReadOnly 
//                       ? 'bg-gray-100 border-gray-200 cursor-not-allowed text-gray-800' 
//                       : 'border-gray-300 focus:ring-green-500 focus:border-transparent text-gray-800 bg-white'
//                   }`}
//                 >
//                   <option value="planning">Planning</option>
//                   <option value="in-progress">In Progress</option>
//                   <option value="completed">Completed</option>
//                   <option value="on-hold">On Hold</option>
//                   <option value="cancelled">Cancelled</option>
//                 </select>
//               </div>
//             </div>

//             {/* Milestones Section */}
//             <div className="space-y-4">
//               <div className="flex items-center justify-between border-b pb-2">
//                 <h3 className="text-lg font-semibold text-gray-800">
//                   Milestones
//                 </h3>
//                 <span className="text-sm text-gray-500">
//                   {milestones.length}/10 milestones
//                 </span>
//               </div>
              
//               <p className="text-sm text-gray-600 mb-4">
//                 Add milestones to track your project progress. When all milestones are marked as complete, the project status will automatically change to "Completed".
//               </p>
              
//               {milestones.length > 0 && (
//                 <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
//                   {milestones.map((milestone, index) => (
//                     <div key={milestone.id || index} className="milestone-item border border-gray-200 rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow">
//                       <div className="flex items-center justify-between mb-3">
//                         <div className="flex items-center gap-2">
//                           {milestone.status === 'complete' ? (
//                             <FaCheck className="text-green-600 text-sm" />
//                           ) : (
//                             <FaCircle className="text-gray-400 text-xs" />
//                           )}
//                           <span className="font-semibold text-gray-700">
//                             Milestone {index + 1}
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           <span className={`text-xs px-2 py-1 rounded-full ${getMilestoneStatusColor(milestone.status)}`}>
//                             {milestone.status === 'complete' ? 'Completed' : 'Incomplete'}
//                           </span>
//                           {!isReadOnly && (
//                             <>
//                               <button
//                                 type="button"
//                                 onClick={() => handleMilestoneChange(index, 'status', 
//                                   milestone.status === 'complete' ? 'incomplete' : 'complete'
//                                 )}
//                                 className={`text-xs px-3 py-1 rounded-lg transition-colors ${
//                                   milestone.status === 'complete'
//                                     ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                                     : 'bg-green-600 text-white hover:bg-green-700'
//                                 }`}
//                               >
//                                 {milestone.status === 'complete' ? 'Mark Incomplete' : 'Mark Complete'}
//                               </button>
//                               <button
//                                 type="button"
//                                 onClick={() => removeMilestone(index)}
//                                 className="text-red-600 hover:text-red-700 transition-colors p-1"
//                                 title="Remove milestone"
//                               >
//                                 <FaTrash size={14} />
//                               </button>
//                             </>
//                           )}
//                         </div>
//                       </div>
                      
//                       <input
//                         type="text"
//                         value={milestone.title}
//                         onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
//                         disabled={isReadOnly}
//                         placeholder="Enter milestone title"
//                         className={`w-full px-3 py-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
//                           isReadOnly 
//                             ? 'bg-gray-100 border-gray-200 cursor-not-allowed text-gray-800' 
//                             : 'border-gray-300 focus:ring-green-500 text-gray-800'
//                         }`}
//                       />
                      
//                       <textarea
//                         value={milestone.description || ''}
//                         onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
//                         disabled={isReadOnly}
//                         placeholder="Milestone description (optional)"
//                         rows="2"
//                         className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm resize-y ${
//                           isReadOnly 
//                             ? 'bg-gray-100 border-gray-200 cursor-not-allowed text-gray-800' 
//                             : 'border-gray-300 focus:ring-green-500 text-gray-800'
//                         }`}
//                       />
//                     </div>
//                   ))}
//                 </div>
//               )}
              
//               {/* Add Milestone Button */}
//               {!isReadOnly && milestones.length < 10 && (
//                 <button
//                   type="button"
//                   onClick={addMilestone}
//                   className="w-full mt-4 px-4 py-3 border-2 border-dashed border-green-400 rounded-lg text-green-600 hover:bg-green-50 hover:border-green-500 transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
//                 >
//                   <FaPlus /> Add Milestone ({10 - milestones.length} remaining)
//                 </button>
//               )}
              
//               {milestones.length === 0 && (
//                 <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
//                   <p className="text-gray-500 mb-2">No milestones added yet</p>
//                   <p className="text-sm text-gray-400">
//                     {isReadOnly 
//                       ? 'This project has no milestones' 
//                       : 'Click the button above to add your first milestone'}
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Form Buttons */}
//           <div className="flex gap-4 mt-8 pt-4 border-t border-gray-200 sticky bottom-0 bg-white pb-2">
//             {!isReadOnly && (
//               <button
//                 type="submit"
//                 disabled={loading || !!dateError}
//                 className="flex-1 bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <FaSave /> {loading ? 'Saving...' : 'Save Project'}
//               </button>
//             )}
//             <button
//               type="button"
//               onClick={onCancel}
//               className={`${
//                 isReadOnly ? 'flex-1' : 'flex-1'
//               } bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300 flex items-center justify-center gap-2`}
//             >
//               <FaTimes /> {isReadOnly ? 'Close' : 'Cancel'}
//             </button>
//           </div>
//         </form>
//       </div>

//       <style jsx>{`
//         @keyframes fade-in {
//           from {
//             opacity: 0;
//             transform: scale(0.95) translateY(-20px);
//           }
//           to {
//             opacity: 1;
//             transform: scale(1) translateY(0);
//           }
//         }
//         .animate-in {
//           animation: fade-in 0.3s ease-out;
//         }
        
//         /* Custom scrollbar - hide scrollbar but keep functionality */
//         .custom-scrollbar {
//           scrollbar-width: none; /* Firefox */
//           -ms-overflow-style: none; /* IE and Edge */
//         }
        
//         .custom-scrollbar::-webkit-scrollbar {
//           display: none; /* Chrome, Safari, Opera */
//         }
//       `}</style>
//     </div>
//   )
// }

// export default ProjectForm
import React,{ useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import axios from 'axios'
import Milestones from './milestones'

const ProjectForm = ({ onCancel, setProjects, projects }) => {
  const [isReadOnly, setIsReadOnly] = useState(false)
  const [dateError, setDateError] = useState('')
  
  const [milestones, setMilestones] = useState([]);
  const [milestoneData, setMilestoneData] = useState({
    description: '',
    completed: false
  });


  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    projectUrl: '',
    completed: false
})

// function to add a new project
const addProject = async (e) => {
  e.preventDefault();
  
  // Validate form data
  if (!formData.title || !formData.description || !formData.startDate || 
    !formData.endDate || !formData.projectUrl) {
    console.error('All fields are required');
    return;
  }
  
  try {
    const response = await axios.post('http://localhost:5000/api/projects/projects', formData);
    
    // Add the new project to the existing projects list
    setProjects([...projects, response.data]);
    
    // Reset form after successful submission
    setFormData({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        projectUrl: '',
        completed: false
    });
    
    alert('Project added successfully!');
    onCancel(); // Close the form after adding the project
  } catch (error) {
      console.error('Error adding project:', error.response?.data || error.message);
  }
};

// Function to add a milestone
const addMilestone = async (e) =>{
  e.preventDefault();
  if(!milestoneData.description){
    console.error("Please enter milestone description");
    return;
  }
  try{
    const response = await axios.post('http://localhost:5000/api/milestone', milestoneData);
    // Add the new project to the existing projects list
    setMilestones([...milestones, response.data]);
    
    // Reset form after successful submission
    setMilestoneData({
        description: '',
        completed: false
    });
  }
  catch(error){
    console.error('Error adding a milestone:', error.response?.data || error.message);
  }
}
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-300 custom-scrollbar">
       <div className={`sticky top-0 p-6 border-b z-10}`}>
        <div className='flex items-center justify-end'>
          <FaTimes className="text-gray-600 hover:text-gray-800 hover:scale-110 transition-transform cursor-pointer" onClick={onCancel} size={25}/>
        </div>
          <div className='flex items-center justify-center'>
            <h2 className="text-2xl font-bold text-black">
              New Project
            </h2>
          </div>
          <form onSubmit={addProject} className="p-6">
            <div className="space-y-6">
             {/* Basic Project Information */}
             <div className="space-y-4">
                {/* Title Field */}
               <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-2">
                   Title <span className="text-red-500">*</span>
                 </label>
                 <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required placeholder="Enter project title"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00ff00] focus:border-[#00ff00] transition-all text-gray-800"/>
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3" placeholder="Enter project description"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00ff00] focus:border-[#00ff00] transition-all text-gray-800 resize-y"/>
              </div>

              {/* Milestones field */}
              {/* < Milestones isReadOnly={isReadOnly}/> */}
              <div className="flex items-center justify-between pb-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Milestones
                </label>
                <span className="text-sm text-gray-500">
                  {milestones.length}/10
                </span>
              </div>
              {!isReadOnly && milestones.length < 10 && (
                <div className="flex items-center justify-between gap-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00ff00] focus:border-[#00ff00] transition-all text-gray-800">
                    <input type="text" value={milestoneData.description} onChange={(e)=>setMilestoneData({...milestoneData, description : e.target.value})} placeholder='Milestone Description' className='w-full outline-none'/>
                    <input type="checkbox" value={milestoneData.completed} onChange={(e)=>setMilestoneData({...milestoneData, completed : e.target.value})} name={milestoneData.completed} id="" className='cursor-pointer'/>
                </div>
            )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Project Url
                </label>
                <input type="text" value={formData.projectUrl} onChange={(e) => setFormData({...formData, projectUrl: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00ff00] focus:border-[#00ff00] transition-all text-gray-800"/>
              </div>

              {/* Date Fields Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00ff00] focus:border-[#00ff00] transition-all text-gray-800"/>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    End Date
                  </label>
                  <input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00ff00] focus:border-[#00ff00] transition-all text-gray-800"/>
                </div>
              </div>
              {/* Form buttons */}
              <div className='flex items-center justify-end gap-4 mt-6'>
                <button type="submit"
                className="bg-[#00ff00] text-white px-6 py-2 rounded-lg font-semibold hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer">
                  Add Project
                </button>
                <button type="button" onClick={onCancel}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer">
                  Cancel
                </button>
              </div>
          </div>
          </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProjectForm
