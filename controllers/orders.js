const Orders = require('../models/orders');
const Dessert = require('../models/dessert');
const user = require('../models/user');
const bcrypt = require('bcrypt');
const express = require('express');
const verifyToken = require('../middleware/verify-token');
const router = express.Router();

// not access to the dessert without authentication
router.use(verifyToken);

router.post('/orders', async (req, res) => {
    try {
        // Extract data from the request body
        const {
            user,
            ordersnumber,
            orderstype,
            quantity,
            totalPrice,
            status, // Optional, will default to 'Pending' if not provided
            deliveryAddress,
            deliverydate,
            desserttypeId,
            specialInstructions // Optional
        } = req.body;

        // Basic validation 
        if (!user || !ordersnumber || !orderstype || !quantity || !totalPrice || !deliveryAddress || !deliverydate || !desserttypeId) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        // Create a new Order instance
        const newOrder = new Orders({
            user,
            ordersnumber,
            orderstype,
            quantity,
            totalPrice,
            status,
            deliveryAddress,
            deliverydate,
            desserttypeId,
            specialInstructions
        });

        // Save the new order to the database
        const savedOrder = await newOrder.save();

        // Respond with the created order and a 201 Created status
        res.status(201).json(savedOrder);

    } catch (error) {
        // Handle specific Mongoose errors
        if (error.code === 11000) { // Duplicate key error (e.g., for ordersnumber)
            return res.status(409).json({ message: 'Order number already exists.', error: error.message });
        }
        if (error.name === 'ValidationError') { // Mongoose validation errors
            return res.status(400).json({ message: 'Validation error', errors: error.errors });
        }
        if (error.name === 'CastError') { // Invalid ObjectId format
            return res.status(400).json({ message: 'Invalid ID format for user or desserttypeId', error: error.message });
        }
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});



module.exports = router;


