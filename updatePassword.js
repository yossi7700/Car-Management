const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Adjust the path if necessary

const updatePassword = async () => {
    const hashedPassword = await bcrypt.hash('MySecurePassword123', 10);
  
    try {
      const user = await User.findOne({ username: 'yossi7700' });
      if (!user) {
        console.log('User does not exist.');
        return; // Exit if the user is not found
      }
  
      const result = await User.updateOne(
        { username: 'yossi7700' },
        { password: hashedPassword }
      );
  
      console.log('Update Result:', result); // Log the result
  
      // Check if the password was modified
      if (result.matchedCount > 0 && result.modifiedCount > 0) {
        console.log('Password updated successfully.');
      } else {
        console.log('Password was not updated, possibly already set.');
      }
    } catch (error) {
      console.error('Error updating password:', error);
    } finally {
      mongoose.disconnect();
    }
  };
  

// Wrap the connection in an async function
const main = async () => {
  try {
    await mongoose.connect('mongodb+srv://yosinotik:1r9X17BJxUZLCJwl@cluster0.ctfxc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    await updatePassword(); // Call the updatePassword function
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

main(); // Execute the main function
