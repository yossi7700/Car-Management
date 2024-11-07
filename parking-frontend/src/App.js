import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import SignUp from './SignUp';
import AddCar from './AddCar';
import CarList from './CarList'; 
import EditCar from './EditCar'; 
import Layout from './Layout'; 
import SearchCar from './SearchCar'; 
import SuperAdminDashboard from './SuperAdminDashboard'; // Import Super Admin Dashboard

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<SearchCar />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/add-car" element={<Layout />}>
            <Route index element={<AddCar />} />
          </Route>
          <Route path="/car-list" element={<Layout />}>
            <Route index element={<CarList />} />
          </Route>
          <Route path="/edit-car/:carNumber" element={<Layout />}>
            <Route index element={<EditCar />} />
          </Route>
          <Route path="/superadmin" element={<SuperAdminDashboard />} /> {/* Route for Super Admin */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
