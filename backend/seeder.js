const mongoose = require('mongoose');
const dotenv = require('dotenv');
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
const User = require('./src/models/User');
const Product = require('./src/models/Product');
const Order = require('./src/models/Order');
const products = require('./src/data/products');

dotenv.config();

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Create a sample admin user
    // In a real scenario, the user will sync their Firebase account
    // This is just to provide an initial admin for product ownership
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@boutique.com',
      firebaseUid: 'SEEDER_ADMIN_PLACEHOLDER',
      role: 'admin',
    });

    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser._id };
    });

    await Product.insertMany(sampleProducts);

    console.log('--- DATABASE SEEDED SUCCESSFULLY ---');
    process.exit();
  } catch (error) {
    console.error(`--- ERROR: ${error.message} ---`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('--- DATABASE WIPED SUCCESSFULLY ---');
    process.exit();
  } catch (error) {
    console.error(`--- ERROR: ${error.message} ---`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
