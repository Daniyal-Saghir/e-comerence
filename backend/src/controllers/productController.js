const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Fetch all products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const { keyword, category, minPrice, maxPrice, rating, sort } = req.query;
    
    let query = {};

    // 1. Keyword Search
    if (keyword) {
        query.$or = [
          { name: { $regex: keyword, $options: 'i' } },
          { category: { $regex: keyword, $options: 'i' } },
          { brand: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
          { sku: { $regex: keyword, $options: 'i' } },
          { tags: { $in: [new RegExp(keyword, 'i')] } }
        ];
    }

    // 2. Category Filter (Supports single or multiple)
    if (category) {
      const categories = category.split(',');
      query.category = { $in: categories };
    }

    // 3. Price Filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 4. Rating Filter
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // 5. Build Mongoose Query
    let queryPromise = Product.find(query);

    // 6. Sorting
    if (sort) {
      const sortBy = sort.split(',').join(' ');
      queryPromise = queryPromise.sort(sortBy);
    } else {
      queryPromise = queryPromise.sort('-createdAt'); // Default to newest
    }

    const products = await queryPromise;

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/v1/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
  try {
    const product = new Product({
      name: 'Alpha Asset',
      sku: 'SKU-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      price: 0,
      user: req.user._id,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      images: [],
      brand: 'Genesis',
      category: 'Electronics',
      countInStock: 0,
      numReviews: 0,
      description: 'System-generated baseline asset. Provide technical specifications and visual identity.',
      isFeatured: false,
      tags: [],
      specifications: []
    });

    const createdProduct = await product.save();
    
    res.status(201).json({
      success: true,
      data: createdProduct
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res, next) => {
  try {
    const {
      name,
      sku,
      price,
      description,
      image,
      images,
      brand,
      category,
      countInStock,
      isFeatured,
      specifications,
      tags
    } = req.body;

    let product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    product.name = name ?? product.name;
    product.sku = sku ?? product.sku;
    product.price = price ?? product.price;
    product.description = description ?? product.description;
    product.image = image ?? product.image;
    product.images = images ?? product.images;
    product.brand = brand ?? product.brand;
    product.category = category ?? product.category;
    product.countInStock = countInStock ?? product.countInStock;
    product.isFeatured = isFeatured ?? product.isFeatured;
    product.specifications = specifications ?? product.specifications;
    product.tags = tags ?? product.tags;

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      data: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new review
// @route   POST /api/v1/products/:id/reviews
// @access  Private
exports.createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      console.log(`User ${req.user._id} already reviewed product ${req.params.id}`);
      return next(new ErrorResponse('Product already reviewed', 400));
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ success: true, message: 'Review added' });
  } catch (error) {
    next(error);
  }
};
