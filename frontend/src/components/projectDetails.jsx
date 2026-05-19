import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FaPencilAlt, FaTrash, FaPlus, FaTimes  } from 'react-icons/fa';

const ProjectDetails = ({ project, showProjectDetails, onCancel, fetchProjects }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [dateError, setDateError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
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
  const [loading, setLoading] = useState(false);

  // Check if project has milestones
  const hasMilestones = milestones.length > 0;

  // Function to validate form fields
  const validateForm = () => {
    const errors = {};
    
    // Check required fields
    if (!formData.title || formData.title.trim() === '') {
      errors.title = 'Title is required';
    }
    
    if (!formData.description || formData.description.trim() === '') {
      errors.description = 'Description is required';
    }
    
    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      errors.endDate = 'End date is required';
    }
    
    // Check date validation (start date must be less than end date)
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (start >= end) {
        errors.dates = 'Start date must be before end date';
        setDateError('Start date must be before end date');
      } else {
        setDateError('');
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Clear a specific validation error when field is updated
  const clearFieldError = (fieldName) => {
    if (validationErrors[fieldName]) {
      setValidationErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  // Function to update project status on the server
  const updateProjectStatus = async (newCompletedStatus) => {
    try {
      const updatedFormData = { ...formData, completed: newCompletedStatus };
      await axios.put(`http://localhost:5000/api/projects/${project.id}`, updatedFormData);
      setFormData(updatedFormData);
      fetchProjects();
      return true;
    } catch (error) {
      console.error('Error updating project status:', error);
      return false;
    }
  };

  // Check if all milestones are completed and update project status accordingly
  const checkAndUpdateProjectStatus = async (updatedMilestones) => {
    if (!updatedMilestones || updatedMilestones.length === 0) {
      return;
    }
    
    const allCompleted = updatedMilestones.every(m => m.completed === true);
    
    if (allCompleted && !formData.completed) {
      await updateProjectStatus(true);
    } else if (!allCompleted && formData.completed) {
      await updateProjectStatus(false);
    }
  };

  // Fetch milestones from the server
  const fetchMilestones = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/milestones/${project.id}`);
      const milestonesData = response.data || [];
      setMilestones(milestonesData);
      await checkAndUpdateProjectStatus(milestonesData);
    } catch (error) {
      console.error('Error fetching milestones:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch milestones when component mounts or project changes
  useEffect(() => {
    if (project?.id) {
      fetchMilestones();
    }
  }, [project?.id]);

  // Function to add a milestone
  const addMilestone = async () => {
    if (!milestoneData.description) {
      alert("Please enter milestone description");
      return;
    }
    
    if (milestones.length >= 10) {
      alert("Maximum 10 milestones allowed per project");
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:5000/api/milestone', {
        project_id: project.id,
        description: milestoneData.description,
        completed: milestoneData.completed
      });
      
      const newMilestones = [...milestones, response.data];
      setMilestones(newMilestones);
      
      setMilestoneData({
        description: '',
        completed: false
      });
      
      await checkAndUpdateProjectStatus(newMilestones);
      
    } catch (error) {
      console.error('Error adding a milestone:', error.response?.data || error.message);
      alert(error.response?.data?.msg || 'Error adding milestone');
    }
  };

  // Function to update a milestone (toggle completed status)
  const updateMilestoneStatus = async (milestoneId, currentStatus, description) => {
    try {
      const newStatus = !currentStatus;
      await axios.put(`http://localhost:5000/api/milestone/${milestoneId}`, {
        description: description,
        completed: newStatus
      });
      
      const updatedMilestones = milestones.map(m => 
        m.id === milestoneId ? { ...m, completed: newStatus } : m
      );
      setMilestones(updatedMilestones);
      await checkAndUpdateProjectStatus(updatedMilestones);
      
    } catch (error) {
      console.error('Error updating milestone:', error);
    }
  };

  // Function to delete a milestone
  const deleteMilestone = async (milestoneId, index) => {
    const confirmation = window.confirm('Are you sure you want to delete this milestone?');
    if (!confirmation) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/milestone/${milestoneId}`);
      const newMilestones = milestones.filter((_, i) => i !== index);
      setMilestones(newMilestones);
      await checkAndUpdateProjectStatus(newMilestones);
      
    } catch (error) {
      console.error('Error deleting milestone:', error);
    }
  };

  // Function to edit a project
  const updateProject = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    try {
      await axios.put(`http://localhost:5000/api/projects/${project.id}`, formData);
      alert('Project updated successfully');
      fetchProjects();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating project:', error.message);
      alert('Error updating project');
    }
  };

  // Function to delete a project
  const deleteProject = async () => {
    const confirmation = window.confirm('Are you sure you want to delete this project? This action cannot be undone.');
    if (!confirmation) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/projects/${project.id}`);
      alert('Project deleted successfully');
      onCancel();
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project');
    }
  };

  // Handle manual project status change (only allowed when no milestones)
  const handleProjectStatusChange = async (e) => {
    const newStatus = e.target.checked;
    
    if (hasMilestones) {
      alert("Project status is automatically managed based on milestone completion. Please complete all milestones to mark the project as complete.");
      return;
    }
    
    await updateProjectStatus(newStatus);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-300 custom-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <div className="sticky bg-white top-0 p-6 z-10">
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
            <div className="space-y-4">
              {/* Title Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => {
                    if (isEditing) {
                      setFormData({...formData, title: e.target.value});
                      clearFieldError('title');
                    }
                  }}
                  required 
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00ff00] transition-all text-gray-800 disabled:bg-gray-100 ${
                    validationErrors.title && isEditing ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-[#00ff00]'
                  }`}
                />
                {validationErrors.title && isEditing && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>
                )}
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea 
                  value={formData.description} 
                  onChange={(e) => {
                    if (isEditing) {
                      setFormData({...formData, description: e.target.value});
                      clearFieldError('description');
                    }
                  }}
                  rows="3" 
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00ff00] transition-all text-gray-800 resize-y disabled:bg-gray-100 ${
                    validationErrors.description && isEditing ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-[#00ff00]'
                  }`}
                />
                {validationErrors.description && isEditing && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>
                )}
              </div>

              {/* Completed Field - Checkbox */}
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="completed"
                  checked={formData.completed}
                  onChange={handleProjectStatusChange}
                  disabled={!isEditing || hasMilestones}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <label htmlFor="completed" className="text-sm font-semibold text-gray-700">
                  {formData.completed ? 'Completed' : 'In Progress'}
                  {hasMilestones && (
                    <span className="ml-2 text-xs text-gray-500 font-normal">
                      (Auto-managed by milestones)
                    </span>
                  )}
                </label>
              </div>

              {/* Milestones Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Milestones
                  </label>
                  <span className="text-sm text-gray-500">
                    {milestones.filter(m => m.completed).length}/{milestones.length} Completed
                  </span>
                </div>

                {/* Progress Bar */}
                {milestones.length > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${(milestones.filter(m => m.completed).length / milestones.length) * 100}%` }}
                    />
                  </div>
                )}

                {loading && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Loading milestones...</p>
                  </div>
                )}
                { milestones.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-500 mb-2">No milestones added yet</p>
                    {!isEditing && <p className="text-sm text-gray-400">Click Edit to add milestones</p>}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {milestones.map((m, idx) => (
                      <div key={m.id || idx} className="flex items-center justify-between gap-2 w-full px-4 py-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                        <div className="flex items-center gap-3 flex-1">
                          {isEditing ? (
                            <input 
                              type="checkbox" 
                              checked={m.completed}
                              onChange={() => updateMilestoneStatus(m.id, m.completed, m.description)}
                              className="w-5 h-5 text-green-600 rounded cursor-pointer"
                            />
                          ) : (
                            <div className={`w-5 h-5 rounded-full border-2 ${m.completed ? 'bg-green-500 border-green-500' : 'border-gray-400'}`} />
                          )}
                          <span className={`text-gray-800 ${m.completed ? 'line-through text-gray-500' : ''}`}>
                            {m.description}
                          </span>
                        </div>
                        {isEditing && (
                          <FaTrash 
                            className="text-red-500 hover:text-red-700 cursor-pointer transition" 
                            onClick={() => deleteMilestone(m.id, idx)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Milestone - Only visible when editing */}
                {isEditing && milestones.length < 10 && (
                  <div className="mt-4 p-4 border-2 border-dashed border-green-400 rounded-lg">
                    <div className="flex items-center gap-2 w-full">
                      <input 
                        type="text" 
                        value={milestoneData.description} 
                        onChange={(e) => setMilestoneData({...milestoneData, description: e.target.value})} 
                        placeholder="New milestone description" 
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00ff00] text-gray-800"
                      />
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Complete:</label>
                        <input 
                          type="checkbox" 
                          checked={milestoneData.completed}
                          onChange={(e) => setMilestoneData({...milestoneData, completed: e.target.checked})} 
                          className="cursor-pointer w-5 h-5"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={addMilestone}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center gap-2"
                      >
                        <FaPlus /> Add
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">{10 - milestones.length} slots remaining</p>
                  </div>
                )}
              </div>

              {/* Project URL Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Project URL
                </label>
                {!isEditing && formData.projectUrl ? (
                  <a 
                    href={formData.projectUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 underline break-all"
                  >
                    {formData.projectUrl}
                  </a>
                ) : !isEditing && !formData.projectUrl ? (
                  <p className="text-gray-500 italic">No project URL provided</p>
                ) : (
                  <input 
                    type="text" 
                    value={formData.projectUrl} 
                    onChange={(e) => setFormData({...formData, projectUrl: e.target.value})}
                    placeholder="Enter project URL"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00ff00] text-gray-800"
                  />
                )}
              </div>

              {/* Date Fields Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  {!isEditing ? (
                    <p className="text-gray-800">{formData.startDate || 'Not set'}</p>
                  ) : (
                    <input 
                      type="date" 
                      value={formData.startDate} 
                      onChange={(e) => {
                        setFormData({...formData, startDate: e.target.value});
                        clearFieldError('startDate');
                        clearFieldError('dates');
                      }}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00ff00] transition-all text-gray-800 ${
                        (validationErrors.startDate || dateError) ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-[#00ff00]'
                      }`}
                    />
                  )}
                  {validationErrors.startDate && isEditing && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.startDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  {!isEditing ? (
                    <p className="text-gray-800">{formData.endDate || 'Not set'}</p>
                  ) : (
                    <input 
                      type="date" 
                      value={formData.endDate} 
                      onChange={(e) => {
                        setFormData({...formData, endDate: e.target.value});
                        clearFieldError('endDate');
                        clearFieldError('dates');
                      }}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00ff00] transition-all text-gray-800 ${
                        (validationErrors.endDate || dateError) ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-[#00ff00]'
                      }`}
                    />
                  )}
                  {validationErrors.endDate && isEditing && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.endDate}</p>
                  )}
                </div>
              </div>

              {/* Date validation error */}
              {dateError && isEditing && (
                <div className="bg-red-50 border border-red-400 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{dateError}</p>
                </div>
              )}

              {/* Form buttons */}
              <div className='flex items-center justify-end gap-4 mt-6'>
                {!isEditing && (
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsEditing(true);
                      setValidationErrors({});
                      setDateError('');
                    }}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer gap-2"
                  >
                    <FaPencilAlt /> Edit
                  </button>
                )}
                {isEditing && (
                  <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer">
                    Save 
                  </button>
                )}
                {isEditing && (
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        title: project?.title || '',
                        description: project?.description || '',
                        startDate: project?.startdate || '',
                        endDate: project?.enddate || '',
                        projectUrl: project?.projecturl || '',
                        completed: project?.completed || false
                      });
                      setValidationErrors({});
                      setDateError('');
                      fetchMilestones();
                    }}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
                {!isEditing && (
                  <button 
                    type="button" 
                    onClick={deleteProject}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-red-600 hover:text-white hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer gap-2"
                  >
                    <FaTrash /> Delete
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

export default ProjectDetails;