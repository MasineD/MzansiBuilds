import React,{ useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import axios from 'axios'

import { FaPencilAlt, FaTrash } from 'react-icons/fa';

const ProjectDetails = ({ project, showProjectDetails, onCancel, fetchProjects }) => {
    const [formData, setFormData] = useState({
        title: project?.title || '',
        description: project?.description || '',
        startDate: project?.startdate || '',
        endDate: project?.enddate || '',
        projectUrl: project?.projecturl || '',
        completed: project?.completed || false
    });
    const [isEditing, setIsEditing] = useState(false);

    // Function to edit a project
    const updateProject = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:5000/api/projects/${project.id}`, formData);
            alert('Project updated successfully');
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
                <div className="sticky top-0 p-6">
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

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Project Url
                  </label>
                  <input type="text" value={formData.projectUrl} onChange={(e) => isEditing && setFormData({...formData, projectUrl: e.target.value})}
                    disabled={!isEditing} placeholder={project?.projectUrl || 'Enter project URL'}
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
              
              {/* Date Error Message */}
              {/* {dateError && !isReadOnly && (
                <div className="text-red-600 text-sm mt-1">
                  {dateError}
                </div>
              )} */}

              {/* Status Field */}
              {/* <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => !isReadOnly && setFormData({...formData, status: e.target.value})}
                  disabled={isReadOnly}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    isReadOnly 
                      ? 'bg-gray-100 border-gray-200 cursor-not-allowed text-gray-800' 
                      : 'border-gray-300 focus:ring-green-500 focus:border-transparent text-gray-800 bg-white'
                  }`}
                >
                  <option value="planning">Planning</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div> */}

            {/* Milestones Section */}
            {/* <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  Milestones
                </h3>
                <span className="text-sm text-gray-500">
                  {milestones.length}/10 milestones
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Add milestones to track your project progress. When all milestones are marked as complete, the project status will automatically change to "Completed".
              </p>
              
              {milestones.length > 0 && (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {milestones.map((milestone, index) => (
                    <div key={milestone.id || index} className="milestone-item border border-gray-200 rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {milestone.status === 'complete' ? (
                            <FaCheck className="text-green-600 text-sm" />
                          ) : (
                            <FaCircle className="text-gray-400 text-xs" />
                          )}
                          <span className="font-semibold text-gray-700">
                            Milestone {index + 1}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getMilestoneStatusColor(milestone.status)}`}>
                            {milestone.status === 'complete' ? 'Completed' : 'Incomplete'}
                          </span>
                          {!isReadOnly && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleMilestoneChange(index, 'status', 
                                  milestone.status === 'complete' ? 'incomplete' : 'complete'
                                )}
                                className={`text-xs px-3 py-1 rounded-lg transition-colors ${
                                  milestone.status === 'complete'
                                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    : 'bg-green-600 text-white hover:bg-green-700'
                                }`}
                              >
                                {milestone.status === 'complete' ? 'Mark Incomplete' : 'Mark Complete'}
                              </button>
                              <button
                                type="button"
                                onClick={() => removeMilestone(index)}
                                className="text-red-600 hover:text-red-700 transition-colors p-1"
                                title="Remove milestone"
                              >
                                <FaTrash size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <input
                        type="text"
                        value={milestone.title}
                        onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
                        disabled={isReadOnly}
                        placeholder="Enter milestone title"
                        className={`w-full px-3 py-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                          isReadOnly 
                            ? 'bg-gray-100 border-gray-200 cursor-not-allowed text-gray-800' 
                            : 'border-gray-300 focus:ring-green-500 text-gray-800'
                        }`}
                      />
                      
                      <textarea
                        value={milestone.description || ''}
                        onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                        disabled={isReadOnly}
                        placeholder="Milestone description (optional)"
                        rows="2"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm resize-y ${
                          isReadOnly 
                            ? 'bg-gray-100 border-gray-200 cursor-not-allowed text-gray-800' 
                            : 'border-gray-300 focus:ring-green-500 text-gray-800'
                        }`}
                      />
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add Milestone Button 
              {!isReadOnly && milestones.length < 10 && (
                <button
                  type="button"
                  onClick={addMilestone}
                  className="w-full mt-4 px-4 py-3 border-2 border-dashed border-green-400 rounded-lg text-green-600 hover:bg-green-50 hover:border-green-500 transition-all duration-300 flex items-center justify-center gap-2 font-semibold"
                >
                  <FaPlus /> Add Milestone ({10 - milestones.length} remaining)
                </button>
              )}
              
              {milestones.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <p className="text-gray-500 mb-2">No milestones added yet</p>
                  <p className="text-sm text-gray-400">
                    {isReadOnly 
                      ? 'This project has no milestones' 
                      : 'Click the button above to add your first milestone'}
                  </p>
                </div>
              )}
            </div>
          </div>

          Form Buttons
          <div className="flex gap-4 mt-8 pt-4 border-t border-gray-200 sticky bottom-0 bg-white pb-2">
            {!isReadOnly && (
              <button
                type="submit"
                disabled={loading || !!dateError}
                className="flex-1 bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaSave /> {loading ? 'Saving...' : 'Save Project'}
              </button>
            )}
            <button
              type="button"
              onClick={onCancel}
              className={`${
                isReadOnly ? 'flex-1' : 'flex-1'
              } bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300 flex items-center justify-center gap-2`}
            >
              <FaTimes /> {isReadOnly ? 'Close' : 'Cancel'}
            </button>
          </div> */}
          </div>
          </div>
          </form>
        </div>
    </div>
  )
}

export default ProjectDetails