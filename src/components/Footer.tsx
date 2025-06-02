import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8083/newsletter/subscribe", { email });
      toast.success("Thanks for subscribing!");
      setEmail("");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("Server fetch error:", err.response?.data);
        toast.error("Failed to fetch leave data: " + (err.response?.data?.message || err.message));
      } else {
        toast.error("Unexpected error: " + err.message);
      }
    }
  };

  return (
    <footer className="relative mt-16 bg-gradient-to-t from-blue-50 via-white to-blue-100 text-gray-700 w-full">
      {/* Top wavy border */}
      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-r from-blue-200 via-blue-50 to-blue-200">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 w-full h-16 -mb-1">
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="#ffffff"
          ></path>
        </svg>
      </div>

      {/* Main footer content */}
      <div className="pt-20 pb-12 max-w-screen-xl mx-auto px-6 sm:px-10">

        {/* Top section with columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12">

          {/* Company info */}
          <div>
            <h3 className="text-lg font-bold text-blue-700 mb-5 flex items-center">
              <span className="w-8 h-8 mr-2 rounded-full bg-blue-200 flex items-center justify-center">
                <CheckCircle size={18} className="text-blue-600" />
              </span>
              TaskMate
            </h3>
            <p className="text-blue-800 text-sm leading-relaxed mb-6">
              Simplify your workflow, boost productivity, and achieve more with our intuitive task management solution.
            </p>
            <div className="flex space-x-4 mt-2">
              {[
                { href: "https://facebook.com", icon: Facebook, label: "Facebook" },
                { href: "https://twitter.com", icon: Twitter, label: "Twitter" },
                { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
                { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-blue-200 hover:bg-blue-300 flex items-center justify-center text-blue-700 transition-all duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-blue-700 mb-5">Quick Links</h3>
            <ul className="space-y-4">
              {[
                { to: "/", label: "Home" },
                { to: "/task", label: "Tasks" },
                { to: "/report", label: "Reports" },
                { to: "/about", label: "About Us" },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-blue-800 hover:text-blue-600 transition-colors duration-300 flex items-center group"
                  >
                    <ArrowRight
                      size={16}
                      className="mr-2 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300"
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

         
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-blue-700 mb-5">Contact Us</h3>
            <ul className="space-y-5">
              <li className="flex items-start">
                <MapPin size={18} className="text-blue-700 mt-1 mr-3 flex-shrink-0" />
                <span className="text-blue-900 leading-relaxed">
                  123 Task Street, Suite 100<br />
                  San Francisco, CA 94107
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-blue-700 mr-3 flex-shrink-0" />
                <a href="tel:+11234567890" className="text-blue-900 hover:text-blue-600 transition-colors duration-300">
                  +1 (123) 456-7890
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-blue-700 mr-3 flex-shrink-0" />
                <a href="mailto:info@taskmate.com" className="text-blue-900 hover:text-blue-600 transition-colors duration-300">
                  info@taskmate.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter subscription */}
        <div className="py-8 border-t border-blue-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between max-w-xl mx-auto">
            <div className="mb-5 md:mb-0 text-center md:text-left">
              <h4 className="text-blue-700 font-semibold mb-1">Stay updated</h4>
              <p className="text-blue-800 text-sm">Subscribe to our newsletter for updates and tips</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-grow md:w-64 px-4 py-2 rounded-l-lg border border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 py-2 rounded-r-lg hover:opacity-90 transition duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="py-6 flex flex-col sm:flex-row justify-between items-center max-w-xl mx-auto text-blue-700 text-sm">
          <div className="mb-3 sm:mb-0">
            © {new Date().getFullYear()} TaskMate. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link to="/terms" className="hover:text-blue-600 transition-colors duration-300">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-blue-600 transition-colors duration-300">Privacy Policy</Link>
            <Link to="/cookies" className="hover:text-blue-600 transition-colors duration-300">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
