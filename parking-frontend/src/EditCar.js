import React, { useEffect, useState } from 'react';
import api from './api'; // Your Axios instance
import { useNavigate, useLocation } from 'react-router-dom'; // For navigation and location access
import './EditCar.css'; // Import the CSS file

const EditCar = () => {
  const [carNumber, setCarNumber] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [carType, setCarType] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.car) {
      const { car } = location.state;
      setCarNumber(car.carNumber);
      setOwnerName(car.ownerName);
      setCarType(car.carType);
      setAdditionalInfo(car.additionalInfo);
      setPhoneNumber(car.phoneNumber);
      setExpiryDate(car.expiryDate);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); // Retrieve the JWT token
    if (!token) {
      setError('No token found');
      return;
    }

    try {
      await api.put(
        `/edit-car/${carNumber}`, // You may need to implement this route in the backend
        {
          ownerName,
          carType,
          additionalInfo,
          phoneNumber,
          expiryDate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate('/car-list'); // Redirect to car list after editing
    } catch (error) {
      console.error('Error updating car:', error);
      setError('Failed to update car'); // Update state to show error message
    }
  };

  return (
    <div className="edit-car-container">
      <h2>Edit Car</h2>
      {error && <p className="edit-car-error">{error}</p>}
      <form className="edit-car-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
          placeholder="Owner Name"
          className="edit-car-input"
          required
        />
        <input
          type="text"
          value={carType}
          onChange={(e) => setCarType(e.target.value)}
          placeholder="Car Type"
          className="edit-car-input"
          required
        />
        <input
          type="text"
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          placeholder="Additional Info"
          className="edit-car-input"
        />
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Phone Number"
          className="edit-car-input"
          required
        />
        <input
          type="text"
          placeholder="Expiry Date"
          className="add-car-input"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
        />
        <button type="submit" className="edit-car-button">
          Update Car
        </button>
      </form>
    </div>
  );
};

export default EditCar;
