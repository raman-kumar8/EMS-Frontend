import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading, logout } = useAuth(); // Make sure you have logout in your context

  const navLinks = [
    { name: "Home", path: "/" },
    {name:"Leave", path: "/leave" },
    { name: "Task", path: "/task" },
    { name: "Report", path: "/report" },
    { name: "About Us", path: "/about" },
  ];

  return (
    <header className="bg-gradient-to-r mb-14 from-blue-600 via-blue-500 to-blue-700 shadow-lg z-50">
      <div className="container-fluid  px-6 sm:px-10 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <img
            src="/src/assets/Logo.png"
            alt="Logo"
            className="bg-white rounded-full h-14 w-14 object-cover shadow-lg"
          />
          <span className="text-2xl  text-white tracking-wide select-none">
            TaskMate
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-10 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-white font-semibold text-lg hover:text-yellow-400 hover:underline underline-offset-4 transition duration-300"
            >
              {link.name}
            </Link>
          ))}
          {user && !loading && (
            <button
              onClick={logout} // Replace with your actual logout logic
              className="text-white font-semibold text-lg hover:text-yellow-400 hover:underline underline-offset-4 transition duration-300"
            >
              Logout
            </button>
          )}
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
          {user && !loading && (
            <button
              onClick={() => {
                logout(); // Replace with actual logout logic
                setIsOpen(false);
              }}
              className="block w-full text-left text-white font-medium text-lg hover:text-yellow-400 transition"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
