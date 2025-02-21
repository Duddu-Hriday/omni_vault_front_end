import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    // If no token, redirect to home
    if (!token) {
        return <Navigate to="/" replace />;
    }

    // If token exists, render the component
    return children;
};

export default ProtectedRoute;
