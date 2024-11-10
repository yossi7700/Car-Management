import React, { useEffect, useState } from 'react';
import api from './api'; // Your Axios instance
import { useNavigate } from 'react-router-dom'; // For navigation
import './CarList.css'; // Import the CSS file

function CarList() {
  const [cars, setCars] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchCars = async () => {
      const token = localStorage.getItem('token'); // Retrieve the JWT token
      if (!token) {
        setError('No token found'); // Handle case where no token is present
        return;
      }
      try {
        const response = await api.get('/car-list', {
          headers: { Authorization: `Bearer ${token}` }, // Ensure the token is included
        });
        setCars(response.data); // Set the fetched car data to state
      } catch (error) {
        console.error('Error fetching cars:', error);
        setError('Failed to fetch cars'); // Update state to show the error message
      }
    };

    fetchCars();
  }, []);

  // Function to handle delete
  const handleDelete = async (carNumber) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found'); // Handle case where no token is present
      return;
    }

    try {
      await api.delete(`/remove-car/${carNumber}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCars(cars.filter((car) => car.carNumber !== carNumber)); // Remove car from state
    } catch (error) {
      console.error('Error deleting car:', error);
      setError('Failed to delete car'); // Update state to show the error message
    }
  };

  // Function to handle edit
  const handleEdit = (car) => {
    navigate(`/edit-car/${car.carNumber}`, { state: { car } }); // Redirect to edit page with car data
  };

  return (
    <div className="car-list-container">
      <h2>List of All Cars</h2>
      {error && <p className="error-message">{error}</p>} {/* Display error message if present */}
      <table className="car-list-table">
        <thead>
          <tr>
            <th>Car Number</th>
            <th>Owner Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car, index) => (
            <tr key={car.carNumber} className={index % 2 === 0 ? 'row-white' : 'row-gray'}>
              <td>{car.carNumber}</td>
              <td>{car.ownerName}</td>
              <td>
                <button className="edit-button" onClick={() => handleEdit(car)}>
                  Edit
                </button>
                <button className="delete-button" onClick={() => handleDelete(car.carNumber)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CarList;
