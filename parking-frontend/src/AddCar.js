import React, { useState } from 'react';
import api from './api'; // Your Axios instance
import './AddCar.css'; // Import the CSS file

function AddCar() {
  const [carNumber, setCarNumber] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [carType, setCarType] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [error, setError] = useState('');


  const handleAddCar = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // Get token from local storage
      if (!token) {
        setError('No authentication token found.');
        return;
      }
      const response = await api.post(
        '/add-car',
        { carNumber, ownerName, carType, additionalInfo, phoneNumber,expiryDate },
        {
          headers: { Authorization: `Bearer ${token}` }, // Include the token in the request
        }
      );
      alert(response.data.message); // Show success message
      // Optionally, clear the form fields after a successful submission
      setCarNumber('');
      setOwnerName('');
      setCarType('');
      setAdditionalInfo('');
      setPhoneNumber('');
      setExpiryDate('')
      setError(''); // Clear any previous errors
    } catch (error) {
      // Handle specific error messages from the server
      if (error.response) {
        // Server responded with a status other than 2xx
        setError(error.response.data.message || 'Failed to add car');
      } else {
        // Network error or some other issue
        setError('Failed to add car due to network error');
      }
    }
  };

  return (
    <div className="add-car-container">
      <form className="add-car-form" onSubmit={handleAddCar}>
        <input
          type="text"
          placeholder="Car Number"
          className="add-car-input"
          value={carNumber}
          onChange={(e) => setCarNumber(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Owner Name"
          className="add-car-input"
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Car Type"
          className="add-car-input"
          value={carType}
          onChange={(e) => setCarType(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Additional Info"
          className="add-car-input"
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone Number"
          className="add-car-input"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Expiry Date"
          className="add-car-input"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
        />
        <button type="submit" className="add-car-button">
          Add Car
        </button>
      </form>
      {error && <p className="add-car-error">{error}</p>} {/* Display error message if exists */}
    </div>
  );
}

export default AddCar;
