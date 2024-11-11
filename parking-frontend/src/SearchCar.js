import React, { useState, useEffect } from 'react';
import api from './api'; // Your Axios instance
import { useNavigate } from 'react-router-dom'; // For navigation
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import logo from './assets/logo.png'; // Update the path as necessary
import './SearchCar.css'; // Custom CSS for styling

const SearchCar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [carNumber, setCarNumber] = useState('');
  const [carDetails, setCarDetails] = useState([]);
  const [carsEnteredToday, setCarsEnteredToday] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (carNumber.length < 5) {
      setError('Please enter at least 5 digits for the car number.');
      return;
    }

    try {
      const response = await api.get(`/search-car/${carNumber}`);
      setCarDetails(response.data.cars);
      setError('');
    } catch (err) {
      console.error('Search error:', err);
      setError('No cars found');
      setCarDetails([]);
    }
  };

  const fetchCarsEnteredToday = async () => {
    try {
      const response = await api.get('/cars-entered-today');
      setCarsEnteredToday(response.data);
    } catch (error) {
      console.error('Error fetching cars entered today:', error);
      setError('Failed to fetch cars entered today.');
    }
  };

  useEffect(() => {
    fetchCarsEnteredToday();
  }, []);

  const handleLogEntry = async (carNumber) => {
    try {
      await api.post(`/log-entry/${carNumber}`, {});
      alert('Car entry logged successfully!');
    } catch (error) {
      console.error('Error logging entry:', error);
      alert('Failed to log entry.');
    }
  };

  const handleLogExit = async (carNumber) => {
    try {
      await api.post(`/log-exit/${carNumber}`, {});
      alert('Car exit logged successfully!');
    } catch (error) {
      console.error('Error logging exit:', error);
      alert('Failed to log exit.');
    }
  };

  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  const menuItems = [
    { text: 'Search Car', action: () => navigate('/') },
    isAuthenticated && { text: 'Add Car', action: () => navigate('/add-car') },
    isAuthenticated && { text: 'List of All Cars', action: () => navigate('/car-list') },
    isAuthenticated && userRole === 'superadmin' && { text: 'Super Admin Dashboard', action: () => navigate('/superadmin') },
    isAuthenticated && {
      text: 'Logout',
      action: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
      },
    },
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

      <div className="search-car-header">
        <h2>Search for a Car</h2>
      </div>
      <div className="search-bar">
        <input
          type="text"
          size="28"
          value={carNumber}
          onChange={(e) => setCarNumber(e.target.value)}
          placeholder="Enter car number (at least 5 digits)"
        />
        <button onClick={handleSearch} className="button">
          Search
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
      {carDetails.length > 0 && (
        <div className="results-container">
          <h3>Cars Found:</h3>
          <table className="car-details-table">
            <thead>
              <tr>
                <th>Car Number</th>
                <th>Owner</th>
                <th>Type</th>
                <th>Additional Info</th>
                <th>Phone Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {carDetails.map((car, index) => (
                <tr key={car.carNumber} className={index % 2 === 0 ? 'row-white' : 'row-gray'}>
                  <td>{car.carNumber}</td>
                  <td>{car.ownerName}</td>
                  <td>{car.carType}</td>
                  <td>{car.additionalInfo}</td>
                  <td>{car.phoneNumber}</td>
                  <td>
                    <button className="log-entry-button" onClick={() => handleLogEntry(car.carNumber)}>Log Entry</button>
                    <button className="log-exit-button" onClick={() => handleLogExit(car.carNumber)}>Log Exit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h3>Cars Entered Today:</h3>
      {carsEnteredToday.length > 0 ? (
        <table className="entered-cars-table">
          <thead>
            <tr>
              <th>Car Number</th>
              <th>Owner</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {carsEnteredToday.map((car, index) => (
              <tr key={car.carNumber} className={index % 2 === 0 ? 'row-white' : 'row-gray'}>
                <td>{car.carNumber}</td>
                <td>{car.ownerName}</td>
                <td>{car.phoneNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No cars entered today.</p>
      )}
    </div>
  );
};

export default SearchCar;
