import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Movies from "../pages/Movie";
import TvSeries from "../pages/Tvseries";
import Bookmark from "../pages/Bookmark";
import Dashboard from "../pages/Dashboard";
import TVSeriesDetails from "../pages/Details/TvSeriesDetails/TVSeriesDetails";
import MovieDetails from "../pages/Details/MovieDetails/MovieDetails";
import Profile from "../pages/Profile";
import Layout from "../components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Logout from "./components/Logout";
import { Toaster, toast } from 'react-hot-toast';
import "@fontsource/urbanist";
import React from "react";

// Component to wrap protected routes
const ProtectedContent = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const location = useLocation();

  if (!isAuthenticated) {
    // Store the attempted URL for redirecting after login
    if (location.pathname !== '/login' && location.pathname !== '/signup') {
      localStorage.setItem('redirectAfterLogin', location.pathname);
    }
    
    toast.error('Please login to access this feature', {
      duration: 3000,
      position: 'top-center',
    });
    
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/logout" element={<Logout />} />
          
          {/* Main Layout with Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="movies" element={<Movies />} />
            <Route path="tvseries" element={<TvSeries />} />
            <Route path="tvseries/:id" element={<TVSeriesDetails />} />
            <Route path="MovieSeries/:id" element={<MovieDetails />} />
            
            {/* Protected Routes */}
            <Route 
              path="bookmark" 
              element={
                <ProtectedContent>
                  <Bookmark />
                </ProtectedContent>
              } 
            />
            <Route 
              path="dashboard" 
              element={
                <ProtectedContent>
                  <Dashboard />
                </ProtectedContent>
              } 
            />
            <Route 
              path="profile" 
              element={
                <ProtectedContent>
                  <Profile />
                </ProtectedContent>
              } 
            />
          </Route>
          
          {/* Catch all other routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
