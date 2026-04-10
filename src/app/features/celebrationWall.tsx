// ========= Celebration wall, users who completed a project are automatically added here===========

// placeholder data of achievers
const achievers = [
    {
        fullname: 'Siyabonga Ndlozi',
        role: 'Software developer',
        projectTitle: 'MzansiBuilds',
        dueDate: '2026/04/14'
    },
    {
        fullname: 'Siyabonga Ndlozi',
        role: 'Software developer',
        projectTitle: 'MzansiBuilds',
        dueDate: '2026/04/14'
    },
    {
        fullname: 'Siyabonga Ndlozi',
        role: 'Software developer',
        projectTitle: 'MzansiBuilds',
        dueDate: '2026/04/14'
    },
    {
        fullname: 'Siyabonga Ndlozi',
        role: 'Software developer',
        projectTitle: 'MzansiBuilds',
        dueDate: '2026/04/14'
    },
]

export default function CelebrationWall(){
    return(
        <div className="celebrationWallContainer bg-black/50 h-[100%]">
            <div className="featureHeader">
                <h2 className="featureTitle">Celebration Wall</h2>
                <p className="featureDescription">Celebrate your achievements with other achievers.</p>
            </div>
            <div className="celebrationWallContent overflow-y-auto max-h-[calc(100vh-120px)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                {achievers.map((achiever,index)=>(
                    <div className="achieverDetails border-b pl-16 py-4">
                        <p className="achieverName">Fullname: {achiever.fullname}</p>
                        <p className="achieverRole">Role: {achiever.role}</p>
                        <h4 className="pl-[25%] font-bold text-white/50">Recent Project</h4>
                        <p className="achievedProjectTitle">Title: {achiever.projectTitle}</p>
                        <p className="achievedProjectDate">Due Date: {achiever.dueDate}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}