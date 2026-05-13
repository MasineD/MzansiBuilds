// import React,{ useState } from 'react'
// import {FaCheck, FaCircle, FaPlus, FaTrash } from 'react-icons/fa'
// import axios from 'axios'

// const Milestones = ({isReadOnly}) => {

//     const [milestones, setMilestones] = useState([])
//     const [loading, setLoading] = useState(false)
//     const [fetchingMilestones, setFetchingMilestones] = useState(false)
//     const [addMilestone, setAddMilestone] = useState(false)

// //     const addMilestone = () => {
// //         if (isReadOnly) return
// //         if (milestones.length < 10) {
// //         // send to backend
// //         //   setMilestones([...milestones, newMilestone])
// //         }
// //   }

//   const removeMilestone = (id) => {
//     if (isReadOnly) return
//     // Send to the backend
//     // setMilestones(updatedMilestones)
//   }

//   const handleMilestoneChange = (index, field, value) => {
//     if (isReadOnly) return
//     // Send to the backend
//     // setMilestones(updatedMilestones)
//   }

//   return (
//     <div>
//         <div className="space-y-4">
//               <div className="flex items-center justify-between pb-2">
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   Milestones
//                 </label>
//                 <span className="text-sm text-gray-500">
//                   {milestones.length}/10
//                 </span>
//               </div>
              
//               <p className="text-sm text-gray-600 mb-4">
//                 Add milestones to track your project progress.
//               </p>
              
//               {milestones.length > 0 && (
//                 <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
//                   {milestones.map((milestone, index) => (
//                     <div key={milestone.id || index} className="milestone-item border border-gray-200 rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow">
//                       <div className="flex items-center justify-between mb-3">
//                         <div className="flex items-center gap-2">
//                           {milestone.completed ? (
//                             <FaCheck className="text-green-600 text-sm" />
//                           ) : (
//                             <FaCircle className="text-gray-400 text-xs" />
//                           )}
//                           <span className="font-semibold text-gray-700">
//                             Milestone {index + 1}
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-2">
//                           {/* <span className={`text-xs px-2 py-1 rounded-full ${getMilestoneStatusColor(milestone.status)}`}>
//                             {milestone.status === 'complete' ? 'Completed' : 'Incomplete'}
//                           </span> */}
//                           {!isReadOnly && (
//                             <>
//                               <button
//                                 type="button"
//                                 onClick={() => handleMilestoneChange(index, 'status', 
//                                   milestone.status === 'complete' ? 'incomplete' : 'complete'
//                                 )}
//                                 className={`text-xs px-3 py-1 rounded-lg transition-colors ${
//                                   milestone.completed
//                                     ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                                     : 'bg-green-600 text-white hover:bg-green-700'
//                                 }`}
//                               >
//                                 {milestone.status === 'complete' ? 'Mark Incomplete' : 'Mark Complete'}
//                               </button>
//                               <button
//                                 type="button"
//                                 // onClick={() => removeMilestone(index)}
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
//                         // onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
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
//                 <button type="button" onClick={()=>setAddMilestone(true)}
//                   className="w-full mt-4 px-4 py-3 border-2 border-dashed border-green-400 rounded-lg text-green-600 hover:bg-green-50 hover:border-green-500 transition-all duration-300 flex items-center justify-center gap-2 font-semibold cursor-pointer">
//                   <FaPlus /> Add Milestones ({10 - milestones.length} remaining)
//                 </button>
//               )}
              
//               {!addMilestone && milestones.length === 0 && (
//                 <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
//                   <p className="text-gray-500 mb-2">No milestones added yet</p>
//                 </div>
//               )}
//               {/* Field to add a milestone */}
//               {addMilestone && !isReadOnly && (
//                 <div className="flex">
//                     <input type='text' placeholder='New Milestone' />
//                 </div>
//               )}
//             </div>
//     </div>
//   )
// }

// export default Milestones
import React, { useState, useEffect } from 'react'
import {FaCheck, FaCircle, FaPlus, FaTrash } from 'react-icons/fa'
import axios from 'axios'

const Milestones = ({isReadOnly}) => {
    const isEditing = isReadOnly
    const [milestones, setMilestones] = useState([]);
    const [milestoneData, setMilestoneData] = useState({
        description: '',
        completed: false
    });

    // Function to fetch all milestones of the current project
    const fetchMilestones = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/milestones');    //Get all milestones
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
