const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const morgan = require('morgan');
const errorHandler = require('./middleware/error');

// Route files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const connectDB = require('./config/db');
connectDB();
const app = express();

// Enable CORS
app.use(cors());

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Set security HTTP headers
app.use(helmet({
  contentSecurityPolicy: false, // Disable for easier frontend integration, can be enabled with proper config
}));



// Compress responses
app.use(compression());

// Logging for development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);

// Catch-all route for frontend (SPA)
const NODE_ENV = process.env.NODE_ENV || 'development';
if (NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../public')));

  app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, '../public/index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

// Custom error handler (must be after routes)
app.use(errorHandler);

module.exports = app;
