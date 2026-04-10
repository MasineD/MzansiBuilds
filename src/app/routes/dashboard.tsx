// ===========Dashboard page, containing a summary of user details and navigation to other features=============
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import "../app.css";
import Profile from '../images/profile.jpg';
import Overview from '../features/overview';
// import Projects from '../features/projects';
// import CelebrationWall from '../features/celebrationWall';

// TODO: Ensure that the styling adapts to the changes in width

// Constant array of features
const navItems = [
  { label: 'Overview', active: true },
  { label: 'Projects', active: false },
  { label: 'CelebrationWall', active: false },
];

export default function Dashboard() {
    // Navigating across the features
    const [activeNav, setActiveNav] = useState('Overview');
    const [showEditProfile, setShowEditProfile] = useState(false);        //Showing full user details

    const [profile, setProfile] = useState({        //The user profile details
    firstname: 'Donald',     //TODO: Replace with details from the database
    lastname: 'Masine',
    age: '23',
    gender: 'Male',
    email: 'donald@example.com',    
    phone: '+27 734 567 8900',       
    organisation: 'DerivCo',
    department: 'Development Operations',
    role: 'DevOps Engineer',  
    });

    const [editForm, setEditForm] = useState({ ...profile });       //Form for editting the user profile

    const [isEditing, setIsEditing] = useState(false);

    const navigate = useNavigate();

    // Saving the user's profile details
    // TODO: Send the details to the database
    const handleSaveProfile = () => {
    setProfile({ ...editForm });
    setShowEditProfile(false);
    };
    return(
        <div className="mainContainer flex min-h-screen max-h-screen fixed bg-black">
             {/*---------Sidebar for nagivating across features -----------*/}
            <aside className="sideBar bg-black w-[22vw]">
                {/*The header of the sidebar */}
                <div className="sdHeader flex items-center justify-center h-[10%]">
                    <span className="text-[30px] font-heading font-bold text-white">MzansiBuilds</span>
                </div>
                {/* A summary of the user details */}
                <div className="userProfile flex items-center justify-center h-[34%] flex-1 flex-col border-b">
                    <div className="profilePhoto flex items-center justify-center w-[13dvw] h-[26dvh] bg-white rounded-[50%] text-black">
                        <img src={Profile} className="w-[100%] h-[100%] rounded-[50%]"alt="profile photo" />
                    </div>
                    <div className="userDetials grid sm:grid-cols-1 lg:grid-cols-2 gap-1 mt-1 mx-2">
                        <h3 className="userFullName text-[22px]">{profile.firstname +' '+ profile.lastname}</h3>
                        {/* Viewing full user details */}
                        <button onClick={() => setShowEditProfile(true)} className="userFullDetails flex items-center justify-end text-[14px] text-white/50 cursor-pointer hover:text-white">
                            full details
                        </button>
                    </div>
                </div>
                <div className="features">      {/*Navigation for the sideBar */}
                    <nav className="sideBarNavigation flex flex-col py-[16px] mx-2">
                        {navItems.map(({ label }) => (        
                            <button
                              key={label}
                              onClick={() => setActiveNav(label)} className="flex items-center gap-[12px] w-[100%] py-[12px] px-[20px] bg-transparent
                               cursor-pointer"
                              style={{
                                color: activeNav === label ? '#ffffff' : '#9ca3af',
                                borderLeft: activeNav === label ? '5px solid #00ff00' : '5px solid transparent',
                                transition: 'all 0.1s',
                              }}
                            >
                              {/* <Icon size={20} /> */}
                              <span style={{ fontSize: '20px', fontWeight: activeNav === label ? 600 : 400 }}>{label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="logout">
                    {/* TODO: Handle the user session for proper logout */}
                    <button className="text-white cursor-pointer bg-[rgba(255,255,255,0.5)] text-[20px] font-600 w-[80%] mt-[20dvh] py-[10px] mx-[10%] rounded-md hover:scale-105" 
                    onClick={() => navigate('/userRegistration')}>
                        Sign Out
                    </button>
                </div>
            </aside>
            <main className="mainSection bg-blue-500 w-[82vw]">      {/*Container for the main content */}
                {/* Edit Profile Modal */}
                {/* TODO: Send the details to the database when the user clicks' Save Changes' button */}
                {showEditProfile && (
                  <div className="editProfileContainer fixed inset-0 bg-[rgba(0,0,0,0.7)] flex items-center justify-center z-50 overflow-y">
                    <div className="closeProfileEdit w-[50vw] p-[24px] rounded-[16px] bg-black/90 relative">   {/*Container for the icon to close the modal */}
                      <button onClick={() => setShowEditProfile(false)} className="closeProfileBtn text-white/50 absolute top-4 right-6 p-[4px] rounded-full
                       cursor-pointer hover:bg-[rgba(255,255,255,0.5)] hover:text-white">
                        X
                      </button>
                      <h2 className="editProfileTitle text-[30px] font-bold mb-[16px] ml-[40%] text-white">User Details</h2>
                        <div className="profileForm flex flex-col gap-[12px]">      {/*Container for the profile form */}
                            {/* User's personal details */}
                                <div className="personalDetails grid grid-cols-1 items-center justify-center">
                                    <label className='userDetails_Label' htmlFor="">Firstname: </label>
                                    <input type="text" placeholder="First Name" value={editForm.firstname} onChange={e => setEditForm(prev => ({ ...prev, firstname: e.target.value }))}
                                        className=" userFirstname editProfileInput" disabled={!isEditing}/>
                                    <label className='userDetails_Label'>Lastname: </label>
                                    <input type="text" placeholder="Last Name" value={editForm.lastname} onChange={e => setEditForm(prev => ({ ...prev, lastname: e.target.value }))}
                                        className=" userLastname editProfileInput" disabled={!isEditing}/>
                                    <label className='userDetails_Label'>Age: </label>
                                    <input type="number" placeholder="Age" value={editForm.age} onChange={e => setEditForm(prev => ({ ...prev, age: e.target.value }))}
                                        className="userAge editProfileInput" disabled={!isEditing}/>
                                    <label className='userDetails_Label'>Gender: </label>
                                    <input type="text" placeholder="Gender" value={editForm.gender} onChange={e => setEditForm(prev => ({ ...prev, gender: e.target.value }))}
                                        className="userGender editProfileInput" disabled={!isEditing}/>
                                    <input type='file' placeholder='Profile photo' disabled={!isEditing}/>
                                    
                                </div>
                            {/* User's contact details */}
                                <div className="homeAddress grid grid-cols-1 items-center justify-center">
                                     <label className='userDetails_Label'>Email:</label>
                                      <input type="email" placeholder="Email" value={editForm.email} onChange={e => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                                        className="userEmail editProfileInput" disabled={!isEditing}/>
                                    <label className='userDetails_Label'>Phone: </label>
                                    <input type="phone" placeholder="Phone" value={editForm.phone} onChange={e => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                                        className="userPhone editProfileInput" disabled={!isEditing}/>
                                </div>
                            {/* User's employment details */}
                                <div className="nextOfKinDetails grid grid-cols-1 items-center justify-center">
                                    <label className='userDetails_Label'>Organisation: </label>
                                    <input type="text" placeholder="Organisation" value={editForm.organisation} onChange={e => setEditForm(prev => ({ ...prev, organisation: e.target.value }))}
                                        className="userOrganisation editProfileInput" disabled={!isEditing}/>
                                    <label className='userDetails_Label'>Department: </label>
                                    <input type="text" placeholder="Department" value={editForm.department} onChange={e => setEditForm(prev => ({ ...prev, department: e.target.value }))}
                                        className="userDepartment editProfileInput" disabled={!isEditing}/>
                                    <label className='userDetails_Label'>Role: </label>
                                    <input type="text" placeholder="Role" value={editForm.role} onChange={e => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                                        className="userRole editProfileInput" disabled={!isEditing}/>
                                </div>
                            {/* Buttons to edit and save changes made to the profile */}
                            <div className="editProfile_Buttons flex sm:gap-2 md:gap-5 lg:gap-8 sm:ml-[30%] md:ml-[40%] lg:ml-[60%]">
                                <button onClick={() => setIsEditing(!isEditing)} className="saveProfileChangesBtn sm:w-[20%] md:w-[35%] lg:w-[50%] py-[10px] sm:px-[4px] md:px-[8px] lg:px-[12px] bg-[#90ee90] 
                                    rounded-md text-white font-[13px] cursor-pointer mt-[12px] hover:bg-[#00ff00] hover:bg-[#00ff00] hover:shadow-[4px_4px_10px_0px_#00ff00] transition-shadow duration-300 hover:scale-105">
                                    {isEditing ? 'Editing...' : 'Edit'}
                                </button>
                                {isEditing && (
                                    <button onClick={handleSaveProfile} className="saveProfileChangesBtn sm:w-[20%] md:w-[35%] lg:w-[50%] py-[10px] sm:px-[4px] md:px-[8px] lg:px-[12px] bg-[#90ee90] 
                                    rounded-md text-white font-[13px] cursor-pointer mt-[12px] hover:bg-[#00ff00] hover:bg-[#00ff00] hover:shadow-[4px_4px_10px_0px_#00ff00] transition-shadow duration-300 hover:scale-105">
                                    Save
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                  </div>
                )}
                {activeNav==='Overview' &&(
                    < Overview />
                )}
                {/* {activeNav==='Projects'  &&(
                    < Projects />
                )}
                {activeNav==='CelebrationWall'  &&(
                    < CelebrationWall />
                )} */}
            </main>
        </div>
    )
}