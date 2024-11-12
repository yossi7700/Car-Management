const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust the path as necessary

const changeUserRole = async (username, newRole) => {
    try {
        const result = await User.updateOne(
            { username }, // Find the user by username
            { role: newRole } // Set the new role
        );

        if (result.nModified > 0) {
            console.log(`User role updated to ${newRole} for ${username}.`);
        } else {
            console.log('User not found or role already set to the same value.');
        }
    } catch (error) {
        console.error('Error updating user role:', error);
    } finally {
        mongoose.disconnect(); // Close the connection
    }
};

// Connect to MongoDB
mongoose.connect('mongodb+srv://yosinotik:1r9X17BJxUZLCJwl@cluster0.ctfxc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    changeUserRole('yosinotik@gmail.com', 'superadmin'); // Change username and role as needed
})

.catch(err => console.error('MongoDB connection error:', err));
