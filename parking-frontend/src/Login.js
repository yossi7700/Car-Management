import React, { useState } from 'react';
import api from './api'; // Your Axios instance for making API calls
import { useNavigate } from 'react-router-dom'; // For navigation after login

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const response = await api.post('/login', { username, password });
      const { token, approved, role } = response.data; // Assuming approved status and role are returned

      // Check if the user is approved
      if (!approved) {
        setError('Your account is not approved yet.'); // Update error message
        return;
      }

      // Store the token and role in local storage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role); // Store the role in local storage

      // Redirect based on user role
      if (role === 'superadmin') {
        navigate('/superadmin'); // Redirect to Super Admin Dashboard
      } else {
        navigate('/add-car'); // Redirect to Add Car page for regular users
      }
    } catch (err) {
      setError('Invalid credentials'); // Update error state if login fails
      console.error("Login error:", err);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          placeholder="Username" 
          required 
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Password" 
          required 
        />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>} {/* Display any error messages */}
    </div>
  );
};

export default Login;
