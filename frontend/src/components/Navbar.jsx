import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="bg-primary-100/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b-4 border-secondary-500">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="text-3xl font-extrabold text-secondary-500 hover:text-secondary-600 hover:scale-105 transition-all">
            BlogSpace
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/" className="text-accent-500 hover:text-secondary-500 transition-all font-semibold hover:scale-105">
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/my-posts" className="text-accent-500 hover:text-secondary-500 transition-all font-semibold hover:scale-105">
                  My Posts
                </Link>
                
                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-3 px-4 py-2 bg-primary-200 rounded-full border-2 border-secondary-400 hover:bg-primary-300 transition-all"
                  >
                    <div className="w-9 h-9 bg-secondary-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                      👤
                    </div>
                    <span className="font-semibold text-accent-500">{user?.username}</span>
                    <svg
                      className={`w-4 h-4 text-accent-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border-2 border-secondary-300 overflow-hidden z-50">
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-3 text-accent-500 hover:bg-secondary-50 transition-colors font-semibold"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left block px-4 py-3 text-accent-500 hover:bg-secondary-50 transition-colors font-semibold border-t border-secondary-200"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="px-6 py-2.5 border-2 border-secondary-500 text-secondary-500 rounded-full font-bold hover:bg-secondary-50 hover:scale-105 transition-all">
                  Login
                </Link>
                <Link to="/register" className="px-6 py-2.5 bg-secondary-500 text-white rounded-full font-bold hover:bg-secondary-600 hover:shadow-xl hover:scale-105 transition-all">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
