import React from 'react';
import { Link } from 'react-router-dom';

function Menu() {
  return (
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
  );
}

export default Menu;
