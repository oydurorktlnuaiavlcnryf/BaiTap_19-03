const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');

// GET /inventories: get all, get inventory by ID (có join với product)
router.get('/', async (req, res) => {
    try {
        const inventories = await Inventory.find().populate('product');
        res.status(200).json(inventories);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// GET /inventories/:id: get inventory by ID (có join với product)
router.get('/:id', async (req, res) => {
    try {
        const inventory = await Inventory.findById(req.params.id).populate('product');
        if (!inventory) return res.status(404).json({ message: 'Không tìm thấy Inventory này' });
        res.status(200).json(inventory);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// POST /inventories/add_stock: {product, quantity} - Tăng stock tương ứng với quantity
router.post('/add_stock', async (req, res) => {
    try {
        const { product, quantity } = req.body;
        if (!product || !quantity || quantity <= 0) {
            return res.status(400).json({ message: 'Product ID và quantity (>0) là bắt buộc' });
        }

        const updatedInventory = await Inventory.findOneAndUpdate(
            { product: product },
            { $inc: { stock: quantity } },
            { new: true, runValidators: true }
        ).populate('product');

        if (!updatedInventory) return res.status(404).json({ message: 'Không tìm thấy Inventory của Product này' });

        res.status(200).json({
            message: 'Stock đã được thêm thành công',
            inventory: updatedInventory
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// POST /inventories/remove_stock: {product, quantity} - Giảm stock tương ứng với quantity
router.post('/remove_stock', async (req, res) => {
    try {
        const { product, quantity } = req.body;
        if (!product || !quantity || quantity <= 0) {
            return res.status(400).json({ message: 'Product ID và quantity (>0) là bắt buộc' });
        }

        // Tìm inventory để check trước khi gán
        const inventory = await Inventory.findOne({ product: product });
        if (!inventory) return res.status(404).json({ message: 'Không tìm thấy Inventory của Product này' });
        
        if (inventory.stock < quantity) {
            return res.status(400).json({ message: 'Không đủ stock để xóa' });
        }

        inventory.stock -= quantity;
        await inventory.save();
        await inventory.populate('product');

        res.status(200).json({
            message: 'Stock đã được giảm thành công',
            inventory: inventory
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// POST /inventories/reservation: {product, quantity} - Giảm stock và tăng reserved tương ứng với quantity
router.post('/reservation', async (req, res) => {
    try {
        const { product, quantity } = req.body;
        if (!product || !quantity || quantity <= 0) {
            return res.status(400).json({ message: 'Product ID và quantity (>0) là bắt buộc' });
        }

        const inventory = await Inventory.findOne({ product: product });
        if (!inventory) return res.status(404).json({ message: 'Không tìm thấy Inventory' });

        if (inventory.stock < quantity) {
            return res.status(400).json({ message: 'Stock hiện tại không đủ để reserve' });
        }

        inventory.stock -= quantity;
        inventory.reserved += quantity;
        await inventory.save();
        await inventory.populate('product');

        res.status(200).json({
            message: 'Reservation thành công',
            inventory: inventory
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// POST /inventories/sold: {product, quantity} - Giảm reservation và tăng soldCount tương ứng với quantity
router.post('/sold', async (req, res) => {
    try {
        const { product, quantity } = req.body;
        if (!product || !quantity || quantity <= 0) {
            return res.status(400).json({ message: 'Product ID và quantity (>0) là bắt buộc' });
        }

        const inventory = await Inventory.findOne({ product: product });
        if (!inventory) return res.status(404).json({ message: 'Không tìm thấy Inventory' });

        if (inventory.reserved < quantity) {
            return res.status(400).json({ message: 'Reserved không đủ để đánh dấu là sold' });
        }

        inventory.reserved -= quantity;
        inventory.soldCount += quantity;
        await inventory.save();
        await inventory.populate('product');

        res.status(200).json({
            message: 'Sold thành công',
            inventory: inventory
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

module.exports = router;
