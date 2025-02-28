import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashBoard from "./pages/DashBoard.jsx";
import Home from "./pages/Home";

// Protected Route Wrapper
const ProtectedRoute = ({ element }) => {
  const token = sessionStorage.getItem("token");
  return token ? element : <Navigate to="/login" replace />;
};

// Auth Redirect Wrapper
const AuthRedirect = ({ element }) => {
  const token = sessionStorage.getItem("token");
  return token ? <Navigate to="/dashboard" replace /> : element;
};

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AuthRedirect element={<Login />} />} />
        <Route path="/signup" element={<AuthRedirect element={<Signup />} />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<DashBoard />} />} />
      </Routes>
    </Router>
  );
};

export default App;
