const express = require('express');

const cartController = require('../controllers/cart.controller');

const router = express.Router();

//GET /cart/
router.get('/', cartController.getCart);

router.post('/items', cartController.addCartItem);

module.exports = router;