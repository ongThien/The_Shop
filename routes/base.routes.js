const express = require('express');

// const baseController = require('../controllers/base.controller');

const router = express.Router();

router.get('/', (req, res) => {
  res.redirect('/products');
});

module.exports = router;