// ========== Header section,containing the website name and the navigation bar=============

// Array of different sections to navigate to
const sections = [
    {
        id:'homeSection',
        name: 'Home'
    },
    {
        id:'aboutSection',
        name: 'About'
    },
    {
        id:'servicesSection',
        name: 'Services'
    },
    {
        id:'contactSection',
        name: 'Contact Us'
    }
]

export default function Header() {
//   Scrolling to the correct section when user clicks on the navigation bar
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="headerSection fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-black via-green-900 to-black shadow-lg">
      <div className="max-w-9xl px-4 sm:px-8 lg:px-16 flex items-center justify-between h-16">
        {/* The application name */}
        <div className="flex items-center space-x-2">
          <span className="text-xl md:text-2xl font-heading font-bold bg-gradient-to-r from-white to-green-400 bg-clip-text text-transparent">
            MzansiBuilds
          </span>
        </div>
        
        {/* The navigation bar and its navigation links */}
        <nav className="hidden md:flex items-center space-x-6 lg:space-x-10">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="relative text-sm lg:text-base font-medium px-4 py-2 text-white hover:text-green-400 transition-all duration-300 group cursor-pointer"
            >
              {section.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 transition-all duration-300 group-hover:w-full"></span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}