const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const coursesRoutes = require('./courses');

// Mount routes
router.use('/auth', authRoutes);
router.use('/courses', coursesRoutes);

module.exports = router;
