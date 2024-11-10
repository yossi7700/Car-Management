import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import logo from './assets/logo.png';
import coverPhoto from './assets/coverPhoto.png';
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
  ].filter(Boolean); // Remove null/undefined items

  return (
    <div className="layout-container">
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Parking Management
          </Typography>
          <img src={logo} alt="Logo" className="logo-appbar" />
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
  <List>
    {menuItems.map((item, index) => (
      <ListItem 
        button 
        key={index} 
        onClick={() => {
          item.action();
          setDrawerOpen(false); // Close the drawer after selecting an item
        }}
      >
        <ListItemText primary={item.text} />
      </ListItem>
    ))}
  </List>
</Drawer>


      <img src={coverPhoto} alt="Cover" className="cover-photo" />
      <div className="content-container">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
