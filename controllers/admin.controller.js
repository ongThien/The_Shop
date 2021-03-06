const Product = require('../models/product.model');
const Order = require('../models/order.model');

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.render('admin/products/all-products', { products: products });
  } catch (err) {
    next(err);
    return;
  }
};

const getNewProduct = (req, res) => {
  res.render('admin/products/new-product');
};

const createNewProduct = async (req, res, next) => {
  // console.log(req.file);
  // console.log(req.body);
  const product = new Product({
    ...req.body,
    image: req.file.filename,
  });

  try {
    await product.save();
  } catch (err) {
    next(err);
    return;
  }

  res.redirect('/admin/products');
};

const getUpdateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render('admin/products/update-product', { product: product });
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  const product = new Product({
    ...req.body,
    _id: req.params.id
  });

  if (req.file) {
    product.replaceImage(req.file.filename);
  }

  try {
    await product.save();
  } catch (err) {
    return next(err); 
  }

  res.redirect('/admin/products');
};

const deleteProduct = async (req, res, next) => {
  let product
  try {
    product = await Product.findById(req.params.id);
    await product.remove();
  } catch (err) {
    return next(err);
  }

  res.json({ message: 'Product deleted successfully!' });
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll();
    res.render('admin/orders/admin-orders', {
      orders: orders
    });
  } catch (error) {
    next(error);
  }
};

const updateOrder = async (req, res, next) => {
  const orderId = req.params.id;
  const newStatus = req.body.newStatus;

  try {
    const order = await Order.findById(orderId);

    order.status = newStatus;

    await order.save();

    res.json({ message: 'Order updated', newStatus: newStatus });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProducts: getProducts,
  getNewProduct: getNewProduct,
  createNewProduct: createNewProduct,
  getUpdateProduct: getUpdateProduct,
  updateProduct: updateProduct,
  deleteProduct: deleteProduct,
  getOrders: getOrders,
  updateOrder: updateOrder
};
