const orders = require('../models/orders');
const Dessert = require('../models/dessert');
const user = require('../models/user');
const bcrypt = require('bcrypt');
const express = require('express');
const verifyToken = require('../middleware/verify-token');
const router = express.Router();    

// not access to the dessert without authentication
router.use(verifyToken);

// Get all dessert
router.get('/',async (req, res) => {
  try {
    const allDesserts = await Dessert.find();
    res.status(200).json(allDesserts);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Get a specific dessert by Email
router.get('/:id', async (req, res) => {
  try {
    const foundDessert = await Dessert.findById(req.params.id);
    if (!foundDessert) {
      return res.status(404).json({ err: 'Dessert not found.' });
    }
    res.status(200).json(foundDessert);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      name,
      ingredients,
      price,
      createdAt,
      specialinstruction,
      deliveryaddress,
      dessertype
    } = req.body;

    // Create a new Dessert instance
    const newDessert = new Dessert({
      name,
      ingredients,
      price,
      createdAt: createdAt || Date.now(),
      specialinstruction,
      deliveryaddress,
      dessertype
    });

    // Save to database
    const savedDessert = await newDessert.save();

    // Respond to client
    res.status(201).json({
      message: 'Dessert successfully created',
      dessert: savedDessert
    });

  } catch (error) {
    console.error('Error saving dessert:', error.message);
    res.status(400).json({ error: error.message });
  }
});



module.exports = router;

