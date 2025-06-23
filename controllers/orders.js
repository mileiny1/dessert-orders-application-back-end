const mongoose = require('mongoose');
const Orders = require('../models/orders');
const Dessert = require('../models/dessert');
const user = require('../models/user');
const bcrypt = require('bcrypt');
const express = require('express');
const verifyToken = require('../middleware/verify-token');
const router = express.Router();

router.use(verifyToken);

// not access to the dessert without authentication
router.get('/orders', async (req, res) => {
  try {
    const orders = await Orders.find()
      .populate('desserttypeId')       
      .populate('user', '-password');  

    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found.' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.post('/orders', verifyToken, async (req, res) => {
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




// NO TOKEN REQUIRED HERE
router.get('/orders/:userId', async (req, res) => {
  const { userId } = req.params;
const encodedId = Buffer.from(userId,'base64').toString('utf-8')
  try {
    if (!mongoose.Types.ObjectId.isValid(encodedId)) {
      return res.status(400).json({ message: 'Invalid user ID format.' });
    }

    const userOrders = await Orders.find({ user: encodedId}) 
      .populate('user', '-password')
      .populate('desserttypeId');

    if (!userOrders.length) {
      return res.status(404).json({ message: 'No orders found for this user.' });
    }

    res.status(200).json(userOrders);
  } catch (error) {
    console.error('Error fetching orders for user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
module.exports = router;


