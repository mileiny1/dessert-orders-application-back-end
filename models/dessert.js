const mongoose = require('mongoose');

const dessertSchema = new mongoose.Schema({
name: {
type: String,
required: true,
trim: true // -- removes leading/trailing spaces
},

ingredients: {
type: [String], // -- store each ingredient as a separate string
required: true,
validate: v => v.length > 0 // -- make sure the array isn’t empty
},

price: {
type: Number,
required: true,
min: 0 // -- never negative
},

createdAt: {
type: Date, // -- Mongoose uses plain JavaScript Date
default: Date.now // -- auto-populate on insert
}
},
{
timestamps: false, // -- you can set this to true and drop createdAt above if you want Mongoose to manage both createdAt/updatedAt for you
specialinstruction: {
type: String,
required: true,
},
deliveryaddress: {
type: String,
required: true,
},
dessertype: {
type: String,
required: true,
}
});



// Export the model
module.exports = mongoose.model('Dessert', dessertSchema);