const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        unique: true
    },
    stock: {
        type: Number,
        default: 0,
        min: [0, 'Stock cannot be less than 0']
    },
    reserved: {
        type: Number,
        default: 0,
        min: [0, 'Reserved cannot be less than 0']
    },
    soldCount: {
        type: Number,
        default: 0,
        min: [0, 'SoldCount cannot be less than 0']
    }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
