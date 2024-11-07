import React, { useState, useEffect } from 'react';
import api from './api'; // Your Axios instance
import { useNavigate } from 'react-router-dom'; // For navigation
import logo from './assets/logo.png'; // Update the path as necessary
import coverPhoto from './assets/coverPhoto.png'; // Update the path as necessary
import './SearchCar.css'; // Custom CSS for styling

const SearchCar = () => {
  const [carNumber, setCarNumber] = useState('');
  const [carDetails, setCarDetails] = useState([]); // Store multiple car details
  const [carsEnteredToday, setCarsEnteredToday] = useState([]); // Store cars entered today
  const [error, setError] = useState('');
  const [recognitionResult, setRecognitionResult] = useState(null); // Store plate recognition result
  const navigate = useNavigate(); // Hook for navigation

  const handleSearch = async () => {
    if (carNumber.length < 5) {
      setError('Please enter at least 5 digits for the car number.');
      return;
    }

    try {
      const response = await api.get(`/search-car/${carNumber}`); // Search for car by number
      setCarDetails(response.data.cars); // Set the car details if found (assuming response is an array)
      setError(''); // Clear any previous error
    } catch (err) {
      console.error("Search error:", err); // Log the error for debugging
      setError('No cars found'); // Show error if car is not found
      setCarDetails([]); // Clear previous car details
    }
  };

  // Fetch cars entered today
  const fetchCarsEnteredToday = async () => {
    try {
      const response = await api.get('/cars-entered-today'); // Ensure you have this endpoint set up
      setCarsEnteredToday(response.data); // Set the cars entered today
    } catch (error) {
      console.error("Error fetching cars entered today:", error);
      setError('Failed to fetch cars entered today.');
    }
  };

  useEffect(() => {
    fetchCarsEnteredToday(); // Fetch cars entered today when the component mounts
  }, []);

  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem('token');

  // Function to log car entry
  const handleLogEntry = async (carNumber) => {
    const token = localStorage.getItem('token');
    try {
      await api.post(`/log-entry/${carNumber}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Car entry logged successfully!');
    } catch (error) {
      console.error("Error logging entry:", error);
      alert('Failed to log entry.');
    }
  };

  // Function to log car exit
  const handleLogExit = async (carNumber) => {
    const token = localStorage.getItem('token');
    try {
      await api.post(`/log-exit/${carNumber}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Car exit logged successfully!');
    } catch (error) {
      console.error("Error logging exit:", error);
      alert('Failed to log exit.');
    }
  };

  // Function to handle image upload for plate recognition
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/api/plate-recognition', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setRecognitionResult(response.data); // Set recognition result
      setError('');
    } catch (err) {
      console.error("Plate recognition error:", err);
      setError('Failed to recognize license plate.');
      setRecognitionResult(null);
    }
  };

  return (
    <div className="search-car-container">
      <img src={coverPhoto} alt="Cover" className="cover-photo" />
      <img src={logo} alt="Logo" className="logo" />
      <div className="menu">
        <nav className="navigation-menu">
          <ul>
            <li><button onClick={() => navigate('/')}>Search Car</button></li>
            {isAuthenticated && (
              <>
                <li><button onClick={() => navigate('/add-car')}>Add Car</button></li>
                <li><button onClick={() => navigate('/car-list')}>List of All Cars</button></li>
                {localStorage.getItem('role') === 'superadmin' && (
                  <li><button onClick={() => navigate('/superadmin')}>Super Admin Dashboard</button></li>
                )}
                <li>
                  <button onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    navigate('/');
                  }}>Logout</button>
                </li>
              </>
            )}
            {!isAuthenticated && (
              <>
                <li><button onClick={() => navigate('/login')}>Login</button></li>
                <li><button onClick={() => navigate('/register')}>Sign Up</button></li>
              </>
            )}
          </ul>
        </nav>
      </div>
      
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
        <button onClick={handleSearch} className="search-button">Search</button>
      </div>

      <div className="upload-section">
        <h3>Upload License Plate Image for Recognition</h3>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="upload-photo"
          type="file"
          onChange={handleImageUpload}
        />
        <label htmlFor="upload-photo">
          <button className="upload-button">Upload Image</button>
        </label>
      </div>

      {error && <p className="error-message">{error}</p>}
      
      {recognitionResult && (
        <div className="recognition-result">
          <h4>Plate Recognition Result:</h4>
          <p>Status: {recognitionResult.status}</p>
          <p>Plate Number: {recognitionResult.plate_number}</p>
        </div>
      )}
      
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
                <tr key={car.carNumber} className={index % 2 === 0 ? "row-white" : "row-gray"}>
                  <td>{car.carNumber}</td>
                  <td>{car.ownerName}</td>
                  <td>{car.carType}</td>
                  <td>{car.additionalInfo}</td>
                  <td>{car.phoneNumber}</td>
                  <td>
                    <button onClick={() => handleLogEntry(car.carNumber)}>Log Entry</button>
                    <button onClick={() => handleLogExit(car.carNumber)}>Log Exit</button>
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
              <tr key={car.carNumber} className={index % 2 === 0 ? "row-white" : "row-gray"}>
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
