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
const { name, ingredients, price } = req.body;

// Optional: validate on server side
if (!name || !ingredients || !price) {
return res.status(400).json({ message: 'All fields are required' });
}

const dessert = new Dessert({
name,
ingredients,
price
});

const savedDessert = await dessert.save();
res.status(201).json(savedDessert);
} catch (err) {
res.status(500).json({ message: err.message });
}
});




module.exports = router;

