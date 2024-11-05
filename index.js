require('dotenv').config(); // Add this line at the top of your index.js
const JWT_SECRET = process.env.JWT_SECRET;
const Car = require('./models/Car');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
const dbURI = 'mongodb+srv://yosinotik:1r9X17BJxUZLCJwl@cluster0.ctfxc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.connect(dbURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

  const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ message: 'Access denied, no token provided' });
    }
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };
// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to the Parking Management System');
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// Route to add a new car
app.post('/add-car', authenticateToken, async (req, res) => {
  const {
    carNumber,
    ownerName,
    carType,
    additionalInfo,
    phoneNumber,
    approvalStatus,
    permission
  } = req.body;

  // Input validation
  if (!carNumber || !ownerName || !carType || !phoneNumber) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Create a new car entry
    const newCar = new Car({
      carNumber,
      ownerName,
      carType,
      additionalInfo: additionalInfo || '',
      phoneNumber,
      approvalStatus: approvalStatus || 'Pending',
      permission: permission || false,
    });
    await newCar.save();
    res.status(201).json({ message: 'Car added successfully', car: newCar });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Car number already exists' });
    } else {
      res.status(500).json({ message: 'Server error', error });
    }
  }
});




// Route to remove a car
app.delete('/remove-car/:carNumber', authenticateToken, async (req, res) => {
  const { carNumber } = req.params;

  try {
    const car = await Car.findOneAndDelete({ carNumber });
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(200).json({ message: 'Car removed successfully', car });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Route to search for a car
app.get('/search-car/:carNumber', async (req, res) => {
  const { carNumber } = req.params;

  try {
    const car = await Car.findOne({ carNumber });
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(200).json({ message: 'Car found', car });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


// Route to log car entry
app.post('/log-entry/:carNumber', authenticateToken, async (req, res) => {
  const { carNumber } = req.params;

  try {
    const car = await Car.findOne({ carNumber });
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    car.entryLogs.push(new Date());
    await car.save();
    res.status(200).json({ message: 'Entry logged', car });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Route to log car exit
app.post('/log-exit/:carNumber', authenticateToken, async (req, res) => {
  const { carNumber } = req.params;

  try {
    const car = await Car.findOne({ carNumber });
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    car.exitLogs.push(new Date());
    await car.save();
    res.status(200).json({ message: 'Exit logged', car });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Make sure the path is correct

// Secret key for JWT

// Route to register a new user
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Route to login a user
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create a token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});







