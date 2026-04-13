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
    <header className="headerSection">
      <div className="max-w-9xl px-4 sm:px-8 lg:px-16 flex items-center justify-center h-16">
        {/* The application name */}
        <div className="flex items-center space-x-2">
          <span className="text-xl font-heading font-bold text-black">MzansiBuilds</span>
        </div>
        {/* The navigation abr and its navigation links */}
        <nav className="hidden md:flex items-center space-x-15 md:ml-100">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="text-sm font-medium w-30 rounded-b-lg  bg-gradient-to-b from-transparent via-black/90 to-black hover:shadow-[4px_4px_10px_0px_#00ff00] transition-shadow duration-300 hover:bg-black/90 hover:scale-105 cursor-pointer"
            >
              {section.name}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}