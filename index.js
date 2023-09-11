// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/restapi'
const User = require('./models/user'); // Import the User model
require('dotenv').config();

// Load environment variables from .env

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Connect to MongoDB
mongoose.connect(mongoURI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });



// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

    app.get('/user', async (req, res) => {
        try {
        const users = await User.find();
        res.json(users);
        } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        }
    });
    
    app.post('/user', async (req, res) => {
        try {
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
        } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        }
    });
    
    app.put('/user/:id', async (req, res) => {
        const { id } = req.params;
        try {
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(updatedUser);
        } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        }
    });
    
    app.delete('/user/:id', async (req, res) => {
        const { id } = req.params;
        try {
        const deletedUser = await User.findByIdAndRemove(id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User removed successfully' });
        } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        }
    });