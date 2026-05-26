import React, { useState, useEffect } from 'react'
import {FaCheck, FaCircle, FaPlus, FaTrash } from 'react-icons/fa'
import axios from 'axios'

const Milestones = ({isReadOnly}) => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const isEditing = isReadOnly
    const [milestones, setMilestones] = useState([]);
    const [milestoneData, setMilestoneData] = useState({
        description: '',
        completed: false
    });

    // Function to fetch all milestones of the current project
    const fetchMilestones = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/milestones`);    //Get all milestones
        setMilestones(response.data);
      } catch (error) {
        console.error('Error fetching todos:', error.message);
      }
    };
    // Making use of the useEffect hook to fetch all milestones
    useEffect(() => {
      fetchMilestones();
    }, []);   //Running the effect only once when the component mounts

  return (
    <div>
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
    </div>
  )
}

export default Milestones
