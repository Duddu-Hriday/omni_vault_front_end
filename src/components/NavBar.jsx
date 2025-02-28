import { React, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        setIsLoggedIn(!!token); // Update login state based on token
    }, [location]);
    
    const handleLogout = () => {
        sessionStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/login');
    }
    return (
        <nav className="sticky top-0 z-50 bg-white shadow-md px-6 py-4 flex justify-between items-center">
            {/* Left Side - Logo and Name */}
            <Link to="/">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-xl font-bold text-white">
                        D
                    </div>
                    <span className="text-2xl font-semibold text-gray-800">Drive Clone</span>
                </div>
            </Link>

            {/* Right Side - Buttons */}
            <div className="flex space-x-4">
                {!isLoggedIn && <Link to="/login">
                    <button className="px-4 py-2 text-gray-700 border border-gray-400 rounded-lg hover:bg-gray-100 transition">
                        Login
                    </button>
                </Link>}
                {!isLoggedIn && <Link to="/signup">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        Signup
                    </button>
                </Link>}

                {isLoggedIn &&
                    <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                        Logout
                    </button>
                }
            </div>
        </nav>
    );
};

export default Navbar;
