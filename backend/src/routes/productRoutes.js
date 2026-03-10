const express = require('express');
const {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(getProducts).post(protect, authorize('admin'), createProduct);
router.route('/:id/reviews').post(protect, createProductReview);
router
  .route('/:id')
  .get(getProductById)
  .delete(protect, authorize('admin'), deleteProduct)
  .put(protect, authorize('admin'), updateProduct);

module.exports = router;
