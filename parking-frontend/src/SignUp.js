import React, { useState } from 'react';
import api from './api'; // Your Axios instance
import { useNavigate } from 'react-router-dom'; // For navigation

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await api.post('/request-signup', { username, password }); // Adjust to use your new endpoint
      setMessage('Sign-up request submitted, awaiting approval.');
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error("Error during sign-up request:", error);
      setMessage('Failed to submit sign-up request.');
    }
  };
  

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
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
        <button type="submit">Request Sign Up</button>
      </form>
      {message && <p>{message}</p>} {/* Display the message */}
    </div>
  );
};

export default SignUp;
