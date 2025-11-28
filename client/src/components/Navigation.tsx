import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('home');

  const location = useLocation();
  const navigate = useNavigate();
  const navbarHeight = 64; // same as your h-16 (16*4px)

  // ----- Scroll Spy (highlight section while scrolling) -----
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll<HTMLElement>('section[id]');
      const scrollPosition = window.scrollY + navbarHeight + 5; // 5px buffer

      let currentSection = 'home';
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          currentSection = section.id;
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // set initial active section
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ----- Smooth scroll helper -----
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const top = el.offsetTop - navbarHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    } else if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
    }

    setActiveSection(sectionId);
    setIsMenuOpen(false);
  };

  const navItemStyle = (id: string) =>
    activeSection === id
      ? 'text-hotel-navy font-semibold'
      : 'text-gray-700 hover:text-hotel-navy';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 flex items-center justify-center">
              <img src="/logo.png" alt="logo" className="w-12 h-12 object-contain" />
            </div>
            <span className="font-bold text-xl text-hotel-navy">Baraton Community</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('home')} className={navItemStyle('home')}>Home</button>
            <button onClick={() => scrollToSection('rooms')} className={navItemStyle('rooms')}>Rooms</button>
            <button onClick={() => scrollToSection('conference-rooms')} className={navItemStyle('conference-rooms')}>Conference Rooms</button>
            <button onClick={() => scrollToSection('services')} className={navItemStyle('services')}>Services</button>
            <button onClick={() => scrollToSection('contact')} className={navItemStyle('contact')}>Contact</button>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <button onClick={() => scrollToSection('home')} className={`text-left ${navItemStyle('home')}`}>Home</button>
              <button onClick={() => scrollToSection('rooms')} className={`text-left ${navItemStyle('rooms')}`}>Rooms</button>
              <button onClick={() => scrollToSection('conference-rooms')} className={`text-left ${navItemStyle('conference-rooms')}`}>Conference Rooms</button>
              <button onClick={() => scrollToSection('services')} className={`text-left ${navItemStyle('services')}`}>Services</button>
              <button onClick={() => scrollToSection('contact')} className={`text-left ${navItemStyle('contact')}`}>Contact</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
