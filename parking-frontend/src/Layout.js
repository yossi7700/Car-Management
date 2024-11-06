import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import logo from './assets/logo.png'; // Update the path as necessary
import coverPhoto from './assets/coverPhoto.png'; // Update the path as necessary
import './Layout.css'; // Import the CSS file

function Layout() {
  const navigate = useNavigate(); // Hook for navigation

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token from local storage
    localStorage.removeItem('role'); // Clear the user role if stored
    navigate('/'); // Redirect to the home page
  };

  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('role'); // Retrieve user role

  return (
    <div className="layout-container">
      <img src={coverPhoto} alt="Cover" className="cover-photo" />
      <img src={logo} alt="Logo" className="logo" />
      <nav className="nav-container">
        <ul className="nav-list">
          <li className="nav-list-item">
            <button className="nav-button" onClick={() => navigate('/')}>
              Search Car
            </button>
          </li>
          {isAuthenticated && (
            <>
              <li className="nav-list-item">
                <button className="nav-button" onClick={() => navigate('/add-car')}>
                  Add Car
                </button>
              </li>
              <li className="nav-list-item">
                <button className="nav-button" onClick={() => navigate('/car-list')}>
                  List of All Cars
                </button>
              </li>
              {userRole === 'superadmin' && ( // Show only for superadmins
                <li className="nav-list-item">
                  <button className="nav-button" onClick={() => navigate('/superadmin')}>
                    Super Admin Dashboard
                  </button>
                </li>
              )}
              <li className="nav-list-item">
                <button className="nav-button" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}
          {!isAuthenticated && (
            <>
              <li className="nav-list-item">
                <button className="nav-button" onClick={() => navigate('/login')}>
                  Login
                </button>
              </li>
              <li className="nav-list-item">
                <button className="nav-button" onClick={() => navigate('/register')}>
                  Sign Up
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
      <div className="content-container">
        <Outlet /> {/* Renders the matching child route */}
      </div>
    </div>
  );
}

export default Layout;
