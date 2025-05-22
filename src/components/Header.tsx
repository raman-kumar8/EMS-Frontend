import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Task", path: "/task" },
    { name: "Report", path: "/report" },
    { name: "About Us", path: "/about" },
  ];

  return (
    <header className="bg-gradient-to-r mb-14 from-blue-600 via-blue-500 to-blue-700 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <img
            src="/src/assets/Logo.png"
            alt="Logo"
            className="bg-white rounded-full h-14 w-14 object-cover shadow-lg"
          />
          <span className="text-3xl font-extrabold text-white tracking-wide select-none">
            TaskMate
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-white font-semibold text-lg hover:text-yellow-400 hover:underline underline-offset-4 transition duration-300"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white hover:text-yellow-400 transition"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-600 border-t border-blue-700 shadow-inner rounded-b-lg px-6 py-5 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block text-white font-medium text-lg hover:text-yellow-400 transition"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
