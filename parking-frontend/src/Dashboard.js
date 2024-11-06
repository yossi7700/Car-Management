import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div>
      <h2>Welcome to the Parking Management System</h2>
      <nav>
        <ul>
          <li>
            <Link to="/add-car">Add Car</Link>
          </li>
          <li>
            <Link to="/car-list">List of All Cars</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Dashboard;
