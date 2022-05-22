const getProduct = (req, res) => {
  res.render('admin/products/all-products');
}

const getNewProduct = (req, res) => {
  res.render('admin/products/new-product');
}

const createNewProduct = (req, res) => {
  
}

module.exports = {
  getProduct: getProduct,
  getNewProduct: getNewProduct,
  createNewProduct: createNewProduct
}