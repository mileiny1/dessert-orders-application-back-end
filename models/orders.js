const mongoose = require('mongoose');
const ordersSchema = new mongoose.Schema({
 
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ordersnumber: {
        type: String,
        required: true,
        unique: true
    },
orderstype: {
        type: String,
        required: true
    },  
    quantity: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },      
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    deliverydate: {
        type: Date,
        required: true
    },
   
     desserttypeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dessert',
        required: true
    },
    specialInstructions: {
        type: String,
        default: ''
    }
});
const Orders = mongoose.model('Orders', ordersSchema);
module.exports = Orders;