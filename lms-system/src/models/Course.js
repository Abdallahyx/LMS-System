const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  comment: String,
  rating: Number
});

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  rating: Number,
  reviews: [ReviewSchema],
  createdAt: { type: Date, default: Date.now }
});

const Course = mongoose.model('Course', CourseSchema);
module.exports = Course;
