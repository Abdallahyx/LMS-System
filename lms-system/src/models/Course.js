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
CourseSchema.pre('save', function(next) {
  if (this.reviews.length > 0) {
    const sum = this.reviews.map(review => review.rating).reduce((a, b) => a + b);
    this.rating = sum / this.reviews.length;
  } else {
    this.rating = 0;
  }
  next();
});
const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
