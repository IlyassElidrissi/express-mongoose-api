const express = require('express');
const mongoose = require('mongoose');
// Load environment variables from the specific config path
require('dotenv').config({ path: './config/.env' });

// Import the User model
const User = require('./models/User');

const app = express();

// Middleware to parse incoming request bodies as JSON
app.use(express.json());

// Establish connection to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Successfully connected to MongoDB.'))
    .catch(err => console.error('Database connection failed:', err));

// ==========================================
//                 ROUTES
// ==========================================

// 1. GET : RETURN ALL USERS
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users', error: error.message });
    }
});

// 2. POST : ADD A NEW USER TO THE DATABASE
app.post('/users', async (req, res) => {
    try {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            age: req.body.age
        });
        
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: 'Error creating user', error: error.message });
    }
});

// 3. PUT : EDIT A USER BY ID
app.put('/users/:id', async (req, res) => {
    try {
        // { new: true } option ensures the response contains the updated document instead of the old one
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true }
        );
        
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: 'Error updating user', error: error.message });
    }
});

// 4. DELETE : REMOVE A USER BY ID
app.delete('/users/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User successfully removed', deletedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
});

// Define server runtime port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
