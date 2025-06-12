const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const logger = require('morgan');
const cors = require('cors');

// controllers
const authRoutes = require('./controllers/auth'); // Import auth routes controller to the servers
const dessertRoutes = require('./controllers/dessert'); // Import dessert routes controller to the servers
const ordersRoutes = require('./controllers/orders');


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// this is my frontend
const allowedOrigins = ['http://localhost:5173']; 

// to connect with frontend
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(logger('dev'));
app.use(express.json()); //to parse JSON bodies


// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Routes go here
app.use('/auth', authRoutes);
app.use('/dessert', dessertRoutes);
app.use('/orders' ,ordersRoutes);


// Start the server
app.listen(3000, () => {
  console.log('The express app is ready!');
});
