const mongoose = require('mongoose');

// Define the schema types and basic validation rules for a User
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number
    }
}, { timestamps: true }); // Automatically manages createdAt and updatedAt fields

// Export the Mongoose model to interact with the database collection
module.exports = mongoose.model('User', userSchema);
