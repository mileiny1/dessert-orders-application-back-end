
const express = require('express');
const user = require('../models/user');
const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import the jwt library for token generation
const verifyToken = require('../middleware/verify-token'); // Import the verifyToken middleware

// this is saltRounds for bcrypt  Add in constant for the number of rounds this is information can be transferred or processed
const saltRounds = 10;


// sign up examples
const signupExamples = {
  phone: "1234567890",
  password: "password123",
  email: "mileiny@example.com",
  name: "Mileiny",
  lastName: "Mileiny"
};

// signup route
router.post('/signup', async (req, res) => {
  try {
    const userInDatabase = await user.findOne({ email: req.body.email});

    if (userInDatabase) {
      return res.status(409).json({ err: 'email already taken.' });
    }

    // create a new user.
    const newUser = await user.create({
      
      email:req.body.email,
      name: req.body.name,
      lastName: req.body.lastName,
      phone: req.body.phone,
      password: bcrypt.hashSync(req.body.password, saltRounds),
    });

    // this is the payload we will use to create the token, containing the user ID and username.
    const payload = {
      email: newUser.email,
      _id: newUser._id
    };

    // Create the token, attaching the payload
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    res.status(201).json({  token });

  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// login route
router.post('/login',async (req, res) => {
  try {
    const foundUser = await user.findOne({ email: req.body.email });

    // Check if user exists.
    if (!foundUser) {
      return res.status(404).json({ err: 'Invalid Credentials.' });
    }


    // Check if password is correct.
    const isPasswordCorrect = bcrypt.compareSync(req.body.password, foundUser.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ err: 'Invalid credentials.' });
    }

    // Construct the payload ,is meant to be used for the token and contains the user ID and username.
    const payload = { email: foundUser.email, _id: foundUser._id };

    // Create the token, attaching the payload
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    // Send the token instead of the message
    res.status(200).json({ token });

  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
