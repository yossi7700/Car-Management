const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { MongoClient } = require('mongodb');

// MongoDB setup
const uri = "your-mongo-connection-string"; // Replace with your MongoDB URI
const client = new MongoClient(uri);

async function recognizePlate(req, res) {
    const imagePath = req.file.path;

    // Run the Python script for plate recognition
    exec(`python utils/plateProcessor.py ${imagePath}`, async (error, stdout, stderr) => {
        if (error) {
            console.error("Error:", stderr);
            return res.status(500).json({ error: 'Plate recognition failed' });
        }

        const plateNumber = stdout.trim().toUpperCase(); // Extracted plate number

        try {
            // Connect to MongoDB and check if the plate number is allowed
            await client.connect();
            const database = client.db('parking_db');
            const allowedCars = database.collection('allowed_cars');

            const car = await allowedCars.findOne({ plate_number: plateNumber });
            const status = car ? 'Allowed' : 'Denied';

            // Log the result
            const carLogs = database.collection('car_logs');
            await carLogs.insertOne({
                plate_number: plateNumber,
                status: status,
                timestamp: new Date(),
            });

            res.json({ status: status, plate_number: plateNumber });
        } catch (err) {
            console.error("Database error:", err);
            res.status(500).json({ error: 'Failed to process request' });
        } finally {
            await client.close();
            fs.unlinkSync(imagePath); // Clean up the uploaded image
        }
    });
}

module.exports = { recognizePlate };
