const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Adjust the path as necessary
const readline = require('readline');

// Create an interface for reading input from the console
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to create a super admin user
async function createSuperAdmin(username, password) {
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user with the superadmin role
  const superAdmin = new User({
    username,
    password: hashedPassword,
    role: 'superadmin', // Set the role to superadmin
    approved: true // Set to true to activate immediately
  });

  try {
    await superAdmin.save(); // Save the superadmin user to the database
    console.log('Super admin created successfully.');
  } catch (error) {
    console.error('Error creating super admin:', error); // Log any error during saving
  }
}

// Connect to MongoDB and run the script
mongoose.connect('mongodb+srv://yosinotik:1r9X17BJxUZLCJwl@cluster0.ctfxc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => {
    rl.question('Enter username for super admin: ', (username) => {
      rl.question('Enter password for super admin: ', (password) => {
        createSuperAdmin(username, password) // Call the function to create the super admin
          .then(() => {
            rl.close(); // Close the readline interface
            mongoose.disconnect(); // Disconnect from MongoDB
          })
          .catch(err => {
            console.error(err); // Handle any errors
            rl.close();
            mongoose.disconnect();
          });
      });
    });
  })
  .catch(err => console.error('MongoDB connection error:', err)); // Handle connection errors
