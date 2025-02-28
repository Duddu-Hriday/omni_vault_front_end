// src/pages/Home.js
import {React, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {

    const navigate = useNavigate();
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            navigate('/dashboard'); //Redirect logged-in users
        }
    }, [navigate]);

    return (
        <div className="flex items-center justify-center h-screen p-6 bg-gray-100">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
        <div>
            <h1 className="text-4xl font-bold mb-4">Welcome to Our Drive Clone</h1>
            <p className="text-lg mb-6">
                This website allows you to store all kinds of files and folders, delete them, and recover them from trash.
            </p>
            <div className="flex space-x-4">
                <Link to="/login">
                    <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Login</button>
                </Link>
                <Link to="/signup">
                    <button className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">Signup</button>
                </Link>
            </div>
        </div>
        <div className="flex justify-center">
            <img
                width="65%"
                src="image.jpg"
                alt="Drive Illustration"
                className="rounded-lg shadow-lg"
            />
        </div>
    </div>
</div>

    );
};

export default Home;
