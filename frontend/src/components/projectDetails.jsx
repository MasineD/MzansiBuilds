import React,{ useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import axios from 'axios'
import Milestones from './milestones';
import { FaPencilAlt, FaTrash, FaPlus } from 'react-icons/fa';

const ProjectDetails = ({ project, showProjectDetails, onCancel, fetchProjects }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
      title: project?.title || '',
      description: project?.description || '',
      startDate: project?.startdate || '',
      endDate: project?.enddate || '',
      projectUrl: project?.projecturl || '',
      completed: project?.completed || false
  });
  const [milestones, setMilestones] = useState([]);
  const [milestoneData, setMilestoneData] = useState({
    description: '',
    completed: false
  });
  // Function to add a milestone
  const addMilestone = async () =>{
    // e.preventDefault();
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
  // Function to edit a project
  const updateProject = async (e) => {
      e.preventDefault();
      try {
          const response = await axios.put(`http://localhost:5000/api/projects/${project.id}`, formData);
          alert('Project updated successfully');
          addMilestone();
          fetchProjects(); // Refresh the project list after updating
          setIsEditing(false);
      }
      catch(error){
          console.error('Error updating project:', error.message);
      }
  };
  // Function to delete a project
  const deleteProject = async () => {
      try {
          const response = await axios.delete(`http://localhost:5000/api/projects/${project.id}`);
          const confirmation = window.confirm('Are you sure you want to delete this project? This action cannot be undone.');
          if (!confirmation) {
              return; // If the user cancels the deletion, exit the function
          }
          alert('Project deleted successfully');
          onCancel(); // Close the project details view after deletion
          fetchProjects(); // Refresh the project list after updating
      }
      catch(error){
          console.error('Error deleting project:', error);
      }
  };
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-300 custom-scrollbar">
          <div className="sticky bg-white top-0 p-6">
            <div className='flex items-center justify-end'>
              <FaTimes className="text-gray-600 hover:text-gray-800 hover:scale-110 transition-transform cursor-pointer" onClick={onCancel} size={25}/>
            </div>
            <div className='flex items-center justify-center'>
              <h2 className="text-2xl font-bold text-black">
                {project?.title || 'Project Details'}
              </h2>
            </div>
          </div>

          <form onSubmit={updateProject} className="p-6">
            <div className="space-y-6">
             {/* Basic Project Information */}
             <div className="space-y-4">
                {/* Title Field */}
               <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-2">
                   Title <span className="text-red-500">*</span>
                 </label>
                 <input type="text" value={formData.title} onChange={(e) => isEditing && setFormData({...formData, title: e.target.value})}
                  required disabled={!isEditing}
                  placeholder={project?.title || 'Enter project title'}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00ff00] focus:border-[#00ff00] transition-all text-gray-800"/>
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea value={formData.description} onChange={(e) => isEditing && setFormData({...formData, description: e.target.value})}
                  rows="3" disabled={!isEditing}
                  placeholder={project?.description || 'Enter project description'}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00ff00] focus:border-[#00ff00] transition-all text-gray-800 resize-y"/>
              </div>

              {/* Completed Field - Checkbox */}
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="completed"
                  checked={formData.completed}
                  onChange={(e) => isEditing && setFormData({...formData, completed: e.target.checked})}
                  disabled={!isEditing}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <label htmlFor="completed" className="text-sm font-semibold text-gray-700">
                  Completed
                </label>
              </div>

              {/* Milestones field */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Milestones
                    </label>
                    <span className="text-sm text-gray-500">
                      {milestones.length}/10
                    </span>
                </div>
                {milestones.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <p className="text-gray-500 mb-2">No milestones added yet</p>
                    </div>
                ):(
                   milestones.map((m) => {
                    <div className="flex">
                        <p>{m.description}</p>
                    </div>
                   })
                )}
                {isEditing && milestones.length < 10 && (
                    <div className="flex items-center justify-between gap-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00ff00] focus:border-[#00ff00] transition-all text-gray-800">
                        <input type="text" value={milestoneData.description} onChange={(e)=>setMilestoneData({...milestoneData, description : e.target.value})} placeholder='Milestone Description' className='w-full outline-none'/>
                        <input type="checkbox" value={milestoneData.completed} name={milestoneData.completed} id="" className='cursor-pointer'/>
                    </div>
                )}
                {isEditing && (
                    <button type="button" className="w-full mt-4 px-4 py-3 border-2 border-dashed border-green-400 rounded-lg text-green-600 hover:bg-green-50 hover:border-green-500 transition-all duration-300 flex items-center justify-center gap-2 font-semibold cursor-pointer">
                        <FaPlus /> Add Milestones ({10 - milestones.length} remaining)
                    </button>
                )}
              </div>

              {/* Project url */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Project Url
                </label>
                <input type="text" value={formData.projectUrl} onChange={(e) => isEditing && setFormData({...formData, projectUrl: e.target.value})}
                  disabled={!isEditing} placeholder={project?.projectUrl || 'Enter project URL'}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00ff00] focus:border-[#00ff00] transition-all text-gray-800"/>
              </div>
              
              {/* Date Fields Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input type="date" value={formData.startDate} onChange={(e) => isEditing && setFormData({...formData, startDate: e.target.value})}
                    disabled={!isEditing} placeholder={project.startDate || 'Select start date'}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00ff00] focus:border-[#00ff00] transition-all text-gray-800"/>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    End Date
                  </label>
                  <input type="date" value={formData.endDate} onChange={(e) => isEditing && setFormData({...formData, endDate: e.target.value})}
                    disabled={!isEditing} placeholder={project?.endDate || 'Select end date'}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00ff00] focus:border-[#00ff00] transition-all text-gray-800"/>
                </div>
              </div>
              {/* Form buttons */}
              <div className='flex items-center justify-end gap-4 mt-6'>
                {!isEditing && (
                  <button type="button" onClick={() => setIsEditing(true)}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer gap-2">
                    <FaPencilAlt />Edit
                  </button>
                )}
                {isEditing && (
                  <button type='submit'
                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer">
                    Save Changes
                  </button>
                )}
                {isEditing && (
                  <button type="button" onClick={()=>setIsEditing(false)}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer">
                    Cancel
                  </button>
                )}
                {!isEditing && (
                    <button type="button" onClick={deleteProject}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-red-600 hover:text-white hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer gap-2">
                      <FaTrash/>Delete
                    </button>
                )}
              </div>
          </div>
          </div>
          </form>
        </div>
    </div>
  )
}

export default ProjectDetails