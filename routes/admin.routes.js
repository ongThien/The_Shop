const express = require('express');

const adminController = require('../controllers/admin.controller');

const router = express.Router();

router.get('/products', adminController.getProduct);

router.get('/products/new', adminController.getNewProduct);

module.exports = router;