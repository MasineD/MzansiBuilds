import React, { useState, useEffect } from 'react'
import { FaTimes, FaTrash, FaPlus } from 'react-icons/fa'
import axios from 'axios'

const ProjectForm = ({ onCancel, setProjects, projects, editingProject, setEditingProject }) => {

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const [dateError, setDateError] = useState('')
  const [validationErrors, setValidationErrors] = useState({})
  const [milestones, setMilestones] = useState(editingProject?.milestones || []);
  const [milestoneData, setMilestoneData] = useState({
    project_id: editingProject?.id || null,
    description: '',
    completed: false
  });
  
  // ========== NEW: Collaborators state ==========
  const [collaborators, setCollaborators] = useState([]);
  const [collaboratorEmail, setCollaboratorEmail] = useState('');
  const [addingCollaborator, setAddingCollaborator] = useState(false);

  const [formData, setFormData] = useState({
    title: editingProject?.title || '',
    description: editingProject?.description || '',
    startDate: editingProject?.startdate || '',
    endDate: editingProject?.enddate || '',
    projectUrl: editingProject?.projecturl || '',
    completed: editingProject?.completed || false
  });

  const isEditing = !!editingProject;

  // Check if project has milestones
  const hasMilestones = milestones.length > 0;

  // ========== NEW: Fetch collaborators when editing ==========
  useEffect(() => {
    if (isEditing && editingProject?.id) {
      fetchCollaborators();
    }
  }, [isEditing, editingProject?.id]);

  const fetchCollaborators = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/collaborators/${editingProject.id}`);
      setCollaborators(response.data.collaborators || []);
    } catch (error) {
      console.error('Error fetching collaborators:', error);
    }
  };

  // Function to validate form fields
  const validateForm = () => {
    const errors = {};
    
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

  const clearFieldError = (fieldName) => {
    if (validationErrors[fieldName]) {
      setValidationErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const updateProjectStatusFromMilestones = (currentMilestones) => {
    if (currentMilestones.length === 0) return;
    
    const allCompleted = currentMilestones.every(m => m.completed === true);
    if (allCompleted !== formData.completed) {
      setFormData(prev => ({ ...prev, completed: allCompleted }));
    }
  };

  useEffect(() => {
    updateProjectStatusFromMilestones(milestones);
  }, [milestones]);

  // ========== UPDATED: Add project with collaborators ==========
  const addProject = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const projectResponse = await axios.post(`${API_URL}/api/projects/projects`, formData);
      const newProject = projectResponse.data;
      
      // Add milestones
      for (const milestone of milestones) {
        await axios.post(`${API_URL}/api/milestone`, {
          project_id: newProject.id,
          description: milestone.description,
          completed: milestone.completed || false
        });
      }
      
      // ========== NEW: Add collaborators ==========
      for (const collaborator of collaborators) {
        if (collaborator.email) {
          await axios.post(`${API_URL}/api/collaborator`, {
            project_id: newProject.id,
            email: collaborator.email
          }).catch(err => console.error('Error adding collaborator:', err));
        }
      }
      
      const updatedProjects = await axios.get(`${API_URL}/api/projects/projects`);
      setProjects(updatedProjects.data);
      
      alert('Project added successfully!');
      onCancel();
    } catch (error) {
      console.error('Error adding project:', error.response?.data || error.message);
      alert(error.response?.data?.msg || 'Error adding project');
    }
  };

  // ========== UPDATED: Update project with collaborators ==========
  const updateProject = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await axios.put(`${API_URL}/api/projects/${editingProject.id}`, formData);
      
      // Update milestones
      for (const milestone of milestones) {
        if (milestone.id) {
          await axios.put(`${API_URL}/api/milestone/${milestone.id}`, {
            description: milestone.description,
            completed: milestone.completed || false
          });
        } else {
          await axios.post(`${API_URL}/api/milestone`, {
            project_id: editingProject.id,
            description: milestone.description,
            completed: milestone.completed || false
          });
        }
      }
      
      // ========== NEW: Handle collaborators - add new ones ==========
      for (const collaborator of collaborators) {
        if (!collaborator.id && collaborator.email) {
          await axios.post(`${API_URL}/api/collaborator`, {
            project_id: editingProject.id,
            email: collaborator.email
          }).catch(err => console.error('Error adding collaborator:', err));
        }
      }
      
      const updatedProjects = await axios.get(`${API_URL}/api/projects/projects`);
      setProjects(updatedProjects.data);
      
      alert('Project updated successfully!');
      onCancel();
      setEditingProject(null);
    } catch (error) {
      console.error('Error updating project:', error.response?.data || error.message);
      alert(error.response?.data?.msg || 'Error updating project');
    }
  };

  const addMilestone = () => {
    if (!milestoneData.description) {
      alert("Please enter milestone description");
      return;
    }
    
    if (milestones.length >= 10) {
      alert("Maximum 10 milestones allowed per project");
      return;
    }
    
    const newMilestone = {
      description: milestoneData.description,
      completed: milestoneData.completed,
      id: null
    };
    
    const newMilestones = [...milestones, newMilestone];
    setMilestones(newMilestones);
    updateProjectStatusFromMilestones(newMilestones);
    
    setMilestoneData({
      project_id: editingProject?.id || null,
      description: '',
      completed: false
    });
  };

  const toggleMilestoneStatus = (index) => {
    const newMilestones = [...milestones];
    newMilestones[index].completed = !newMilestones[index].completed;
    setMilestones(newMilestones);
    updateProjectStatusFromMilestones(newMilestones);
  };

  const removeMilestone = async (index, milestoneId) => {
    if (milestoneId && isEditing) {
      const confirmation = window.confirm('Are you sure you want to delete this milestone?');
      if (!confirmation) return;
      
      try {
        await axios.delete(`${API_URL}/api/milestone/${milestoneId}`);
        const updatedProjects = await axios.get(`${API_URL}/api/projects/projects`);
        setProjects(updatedProjects.data);
      } catch (error) {
        console.error('Error deleting milestone:', error);
        alert('Error deleting milestone');
        return;
      }
    } else {
      const confirmation = window.confirm('Are you sure you want to delete this milestone?');
      if (!confirmation) return;
    }
    
    const newMilestones = milestones.filter((_, i) => i !== index);
    setMilestones(newMilestones);
    updateProjectStatusFromMilestones(newMilestones);
  };

  // ========== NEW: Collaborator functions ==========
  const addCollaborator = () => {
    if (!collaboratorEmail.trim()) {
      alert("Please enter an email address");
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(collaboratorEmail)) {
      alert("Please enter a valid email address");
      return;
    }
    
    setCollaborators([...collaborators, {
      email: collaboratorEmail,
      name: 'Invite Pending',
      id: null
    }]);
    setCollaboratorEmail('');
  };

  const removeCollaborator = (index) => {
    const newCollaborators = [...collaborators];
    newCollaborators.splice(index, 1);
    setCollaborators(newCollaborators);
  };

  const handleProjectStatusChange = (e) => {
    const newStatus = e.target.checked;
    
    if (hasMilestones) {
      alert("Project status is automatically managed based on milestone completion.");
      return;
    }
    
    setFormData({...formData, completed: newStatus});
  };

  const handleSubmit = isEditing ? updateProject : addProject;

  const completedMilestonesCount = milestones.filter(m => m.completed).length;
  const progressPercentage = milestones.length > 0 ? (completedMilestonesCount / milestones.length) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-300 custom-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <div className="sticky top-0 p-6 z-10 bg-white">
          <div className='flex items-center justify-end'>
            <FaTimes className="text-gray-600 hover:text-gray-800 hover:scale-110 transition-transform cursor-pointer" onClick={onCancel} size={25}/>
          </div>
          <div className='flex items-center justify-center'>
            <h2 className="text-2xl font-bold text-black">
              {isEditing ? 'Edit Project' : 'New Project'}
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6">
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
                      setFormData({...formData, title: e.target.value});
                      clearFieldError('title');
                    }}
                    required 
                    placeholder="Enter project title"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00ff00] transition-all text-gray-800 ${
                      validationErrors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-[#00ff00]'
                    }`}
                  />
                  {validationErrors.title && (
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
                      setFormData({...formData, description: e.target.value});
                      clearFieldError('description');
                    }}
                    rows="3" 
                    placeholder="Enter project description"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00ff00] transition-all text-gray-800 resize-y ${
                      validationErrors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-[#00ff00]'
                    }`}
                  />
                  {validationErrors.description && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>
                  )}
                </div>

                {/* Completed Field */}
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="completed"
                    checked={formData.completed}
                    onChange={handleProjectStatusChange}
                    disabled={hasMilestones}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <label htmlFor="completed" className="text-sm font-semibold text-gray-700">
                    Completed
                    {hasMilestones && (
                      <span className="ml-2 text-xs text-gray-500 font-normal">
                        (Auto-managed by milestones)
                      </span>
                    )}
                  </label>
                </div>

                {/* Milestones Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Milestones
                    </label>
                    <span className="text-sm text-gray-500">
                      {completedMilestonesCount}/{milestones.length} Completed
                    </span>
                  </div>

                  {milestones.length > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  )}

                  {milestones.length > 0 && (
                    <div className="space-y-2 mb-3 max-h-60 overflow-y-auto">
                      {milestones.map((milestone, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-2 w-full px-4 py-2 border rounded-lg bg-gray-50">
                          <div className="flex items-center gap-3 flex-1">
                            <input 
                              type="checkbox"
                              checked={milestone.completed}
                              onChange={() => toggleMilestoneStatus(idx)}
                              className="w-4 h-4 text-green-600 rounded cursor-pointer"
                            />
                            <span className={`text-gray-800 ${milestone.completed ? 'line-through text-gray-500' : ''}`}>
                              {milestone.description}
                            </span>
                          </div>
                          <FaTrash 
                            className="text-red-500 hover:text-red-700 cursor-pointer transition" 
                            onClick={() => removeMilestone(idx, milestone.id)}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {milestones.length < 10 && (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 w-full">
                        <input 
                          type="text" 
                          value={milestoneData.description} 
                          onChange={(e) => setMilestoneData({...milestoneData, description: e.target.value})} 
                          placeholder="Milestone Description" 
                          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00ff00] text-gray-800"
                        />
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-600">Complete:</label>
                          <input 
                            type="checkbox" 
                            checked={milestoneData.completed}
                            onChange={(e) => setMilestoneData({...milestoneData, completed: e.target.checked})} 
                            className="cursor-pointer w-4 h-4"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={addMilestone}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                        >
                          Add
                        </button>
                      </div>
                      <p className="text-xs text-gray-400">{10 - milestones.length} slots remaining</p>
                    </div>
                  )}

                  {milestones.length === 0 && (
                    <p className="text-sm text-gray-400 italic">Add milestones to track project progress.</p>
                  )}
                </div>

                {/* ========== NEW: Collaborators Section ========== */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Collaborators
                    </label>
                    <span className="text-sm text-gray-500">
                      {collaborators.length}
                    </span>
                  </div>

                  {collaborators.length > 0 && (
                    <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                      {collaborators.map((collab, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-2 w-full px-4 py-2 border rounded-lg bg-gray-50">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">{collab.name || collab.email}</p>
                            <p className="text-xs text-gray-500">{collab.email}</p>
                          </div>
                          <FaTrash 
                            className="text-red-500 hover:text-red-700 cursor-pointer transition" 
                            onClick={() => removeCollaborator(idx)}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 w-full">
                      <input 
                        type="email" 
                        value={collaboratorEmail} 
                        onChange={(e) => setCollaboratorEmail(e.target.value)} 
                        placeholder="Enter email address to add collaborator" 
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00ff00] text-gray-800"
                      />
                      <button
                        type="button"
                        onClick={addCollaborator}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center gap-2"
                      >
                        <FaPlus /> Add
                      </button>
                    </div>
                    <p className="text-xs text-gray-400">Collaborators can view and interact with this project</p>
                  </div>
                </div>

                {/* Project URL Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Project Url
                  </label>
                  <input 
                    type="text" 
                    value={formData.projectUrl} 
                    onChange={(e) => setFormData({...formData, projectUrl: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00ff00] focus:border-[#00ff00] transition-all text-gray-800"
                  />
                </div>

                {/* Date Fields Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="date" 
                      value={formData.startDate} 
                      onChange={(e) => {
                        setFormData({...formData, startDate: e.target.value});
                        clearFieldError('startDate');
                        clearFieldError('dates');
                      }}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00ff00] transition-all text-gray-800 ${
                        validationErrors.startDate || dateError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-[#00ff00]'
                      }`}
                    />
                    {validationErrors.startDate && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.startDate}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      End Date <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="date" 
                      value={formData.endDate} 
                      onChange={(e) => {
                        setFormData({...formData, endDate: e.target.value});
                        clearFieldError('endDate');
                        clearFieldError('dates');
                      }}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00ff00] transition-all text-gray-800 ${
                        validationErrors.endDate || dateError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-[#00ff00]'
                      }`}
                    />
                    {validationErrors.endDate && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.endDate}</p>
                    )}
                  </div>
                </div>

                {dateError && (
                  <div className="bg-red-50 border border-red-400 rounded-lg p-3">
                    <p className="text-red-600 text-sm">{dateError}</p>
                  </div>
                )}

                {/* Form buttons */}
                <div className='flex items-center justify-end gap-4 mt-6'>
                  <button type="submit"
                    className="bg-[#00ff00] text-white px-6 py-2 rounded-lg font-semibold hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer">
                    {isEditing ? 'Update Project' : 'Add Project'}
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

export default ProjectForm;
