import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://car-management.herokuapp.com', // Use the Heroku URL for production
});

export default api;
