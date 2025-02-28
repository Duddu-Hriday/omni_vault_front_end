import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            navigate('/dashboard'); // Redirect logged-in users
        }
    }, [navigate]);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const { email, password } = formData;

        // Frontend Validation
        if (!email || !password) {
            setError('Please fill in all fields.');
            setLoading(false);
            return;
        }

        try {
            // POST request to backend
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(data.message);
                sessionStorage.setItem('token', data.token);
                navigate('/dashboard', { replace: true });
                setFormData({ email: '', password: '' });
            } else {
                setError(data.error || 'Login failed.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                {/* Error or Success Messages */}
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                {success && <p className="text-green-500 mb-4 text-center">{success}</p>}

                {/* Email Input */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter your email"
                        required
                    />
                </div>

                {/* Password Input */}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter your password"
                        required
                    />
                </div>

                {/* Submit Button with Loading Animation */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <svg
                                className="animate-spin h-5 w-5 mr-2 border-t-2 border-white rounded-full"
                                viewBox="0 0 24 24"
                            ></svg>
                            Logging in...
                        </>
                    ) : (
                        'Login'
                    )}
                </button>
            </form>
        </div>
    );
};

export default Login;
