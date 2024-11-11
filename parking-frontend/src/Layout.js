import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import logo from './assets/logo.png';
import './Layout.css';

function Layout() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  const menuItems = [
    { text: 'Search Car', action: () => navigate('/') },
    isAuthenticated && { text: 'Add Car', action: () => navigate('/add-car') },
    isAuthenticated && { text: 'List of All Cars', action: () => navigate('/car-list') },
    isAuthenticated && userRole === 'superadmin' && { text: 'Super Admin Dashboard', action: () => navigate('/superadmin') },
    isAuthenticated && { text: 'Logout', action: handleLogout },
    !isAuthenticated && { text: 'Login', action: () => navigate('/login') },
    !isAuthenticated && { text: 'Sign Up', action: () => navigate('/register') },
  ].filter(Boolean);

  return (
    <div className="layout-container">
      {/* Top Section with Cover Photo */}
      <div className="top-section">
        <AppBar position="static" className="AppBar">
          <Toolbar style={{ width: '100%' }}>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Parking Management
            </Typography>
            <img src={logo} alt="Logo" className="logo-appbar" />
          </Toolbar>
        </AppBar>
      </div>

      {/* Drawer for navigation */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <List>
          {menuItems.map((item, index) => (
            <ListItem
              button
              key={index}
              onClick={() => {
                item.action();
                setDrawerOpen(false);
              }}
            >
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <div className="content-container">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
