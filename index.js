require('dotenv').config(); // Add this line at the top of your index.js
const JWT_SECRET = process.env.JWT_SECRET;
const Car = require('./models/Car');
const bcrypt = require('bcrypt');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
app.use(cors());



// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
const dbURI = process.env.MONGODB_URI;
mongoose.connect(dbURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

  const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ message: 'Access denied, no token provided' });
    }
    // Split the "Bearer" part from the token
    const bearerToken = token.split(' ')[1]; 
    try {
      const decoded = jwt.verify(bearerToken, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      console.error("Token verification failed:", error); // Log the error
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
    expiryDate
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
      expiryDate: new Date(expiryDate),
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


// Route to delete a user
app.delete('/users/:username', authenticateToken, async (req, res) => {
  const { username } = req.params;
  try {
      const result = await User.deleteOne({ username });
      if (result.deletedCount === 0) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User removed successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error });
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

// Route to search for a car by the first 5 digits of the car number
app.get('/search-car/:carNumber', async (req, res) => {
  const { carNumber } = req.params;

  try {
    const cars = await Car.find({ carNumber: { $regex: `^${carNumber}`, $options: 'i' } });

    if (cars.length === 0) {
      return res.status(404).json({ message: 'No cars found' });
    }

    const today = new Date();
    const carsWithExpiryStatus = cars.map((car) => {
      const carExpiryDate = car.expiryDate && car.expiryDate[0] ? new Date(car.expiryDate[0]) : null;
      const isExpired = carExpiryDate ? carExpiryDate < today : true; // Check against the first expiry date
      return {
        ...car._doc,
        isExpired,
      };
    });

    res.status(200).json({ message: 'Cars found', cars: carsWithExpiryStatus });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

app.get('/car-list', authenticateToken, async (req, res) => {
  console.log("Fetching cars..."); // Debug log
  try {
    const cars = await Car.find(); // Fetch all car entries
    res.status(200).json(cars); // Send the car data as a response
  } catch (error) {
    console.error("Error fetching cars:", error); // Log any error that occurs
    res.status(500).json({ message: 'Error fetching cars', error });
  }
});



app.post('/log-entry/:carNumber', async (req, res) => {
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

// Route to log car exit (open to everyone)
app.post('/log-exit/:carNumber', async (req, res) => {
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
const User = require('./models/User'); // Make sure the path is correct

// Secret key for JWT

// Route to handle sign-up requests
app.post('/request-signup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const newUserRequest = new User({ username, password, approved: false });
    await newUserRequest.save();

    console.log(`New sign-up request for ${username} has been received.`);
    res.status(201).json({ message: 'Sign-up request submitted, awaiting approval.' });
  } catch (error) {
    console.error("Error saving sign-up request:", error);
    res.status(500).json({ message: 'Server error', error });
  }
});


// Route to fetch pending sign-up requests
app.get('/signup-requests', authenticateToken, async (req, res) => {
  try {
    const requests = await User.find({ approved: false }); // Fetch users with approved status as false
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching sign-up requests:", error); // Log the error for debuggingdashboard
    res.status(500).json({ message: 'Error fetching sign-up requests', error });
  }
});

// Route to get all users
app.get('/users', authenticateToken, async (req, res) => {
  try {
      const users = await User.find(); // Fetch all users
      res.status(200).json(users); // Send the user data as a response
  } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error });
  }
});

// Route to approve a sign-up request
app.post('/approve-signup/:username', async (req, res) => {
  const { username } = req.params;
  const { role } = req.body; // Get the role from the request body

  try {
    const userRequest = await User.findOneAndUpdate(
      { username },
      { approved: true, role: role }, // Set approved status and role
      { new: true }
    );

    if (!userRequest) {
      return res.status(404).json({ message: 'User request not found' });
    }
    
    res.status(200).json({ message: 'User approved successfully', userRequest });
  } catch (error) {
    res.status(500).json({ message: 'Error approving user', error });
  }
});


// Route to deny a sign-up request (mark user as inactive)
app.post('/deny-signup/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const userRequest = await User.findOneAndUpdate(
      { username }, // Find user by username
      { approved: false }, // Set approved status to false
      { new: true } // Return the updated user
    );

    if (!userRequest) {
      return res.status(404).json({ message: 'User not found' }); // If user not found
    }

    res.status(200).json({ message: 'User marked as inactive successfully', user: userRequest });
  } catch (error) {
    res.status(500).json({ message: 'Error denying user', error }); // Handle errors
  }
});



// Route to login a user

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

    // Generate token if credentials are valid
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token, approved: user.approved, role: user.role }); // Return approved and role
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});






app.put('/edit-car/:carNumber', authenticateToken, async (req, res) => {
  const { carNumber } = req.params;
  const { ownerName, carType, additionalInfo, phoneNumber,expiryDate} = req.body;

  try {
    const car = await Car.findOneAndUpdate(
      { carNumber },
      { ownerName, carType, additionalInfo, phoneNumber },
      { new: true } // Return the updated car
    );

    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.status(200).json({ message: 'Car updated successfully', car });
  } catch (error) {
    res.status(500).json({ message: 'Error updating car', error });
  }
});


// Route to fetch cars entered today
app.get('/cars-entered-today', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of the day
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Set to start of the next day

    const cars = await Car.find({
      entryLogs: {
        $gte: today,
        $lt: tomorrow
      }
    });

    res.status(200).json(cars); // Return the cars entered today
  } catch (error) {
    console.error("Error fetching cars entered today:", error);
    res.status(500).json({ message: 'Error fetching cars', error });
  }
});












