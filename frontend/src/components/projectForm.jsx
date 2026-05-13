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

              {/* Completed Field - Checkbox */}
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="completed"
                  checked={formData.completed}
                  onChange={(e) => setFormData({...formData, completed: e.target.checked})}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                />
                <label htmlFor="completed" className="text-sm font-semibold text-gray-700">
                  Completed
                </label>
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