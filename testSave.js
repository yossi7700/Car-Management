const mongoose = require('mongoose');
const Car = require('./models/Car'); // Adjust the path if needed

// Connect to MongoDB
const dbURI = 'mongodb+srv://yosinotik:1r9X17BJxUZLCJwl@cluster0.ctfxc.mongodb.net/Car-Management?retryWrites=true&w=majority';
mongoose.connect(dbURI)
  .then(() => {
    console.log('Connected to MongoDB');

    // Create a new car document
    const newCar = new Car({
      carNumber: '1234XYZ9',
      ownerName: 'John Doe',
      carType: 'Toyota Corolla',
      additionalInfo: 'Some extra notes',
      phoneNumber: '123-456-7890',
      expiryDate: '',
    });

    // Save the car
    newCar.save()
      .then((car) => {
        console.log('Car saved successfully:', car);
        mongoose.connection.close();
      })
      .catch((error) => {
        console.error('Error saving car:', error);
        mongoose.connection.close();
      });
  })
  .catch((err) => console.error('Error connecting to MongoDB:', err));
