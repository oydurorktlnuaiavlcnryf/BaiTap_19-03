const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');

// POST: Tạo mới một Product và tự động tạo 1 Inventory tương ứng
router.post('/', async (req, res) => {
    try {
        const { name, price } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Product name is required' });
        }

        // Tạo Product mới
        const newProduct = new Product({ name, price });
        const savedProduct = await newProduct.save();

        // Tự động tạo Inventory tương ứng với Product
        const newInventory = new Inventory({
            product: savedProduct._id,
            stock: 0,
            reserved: 0,
            soldCount: 0
        });
        await newInventory.save();

        res.status(201).json({
            message: 'Product and corresponding Inventory created successfully',
            product: savedProduct,
            inventory: newInventory
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// GET: Lấy tất cả Product (tiện để kiểm tra)
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

module.exports = router;
