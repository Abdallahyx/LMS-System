const express = require('express');
const router = express.Router();
const Course = require('../models/Course');  // Import Course model
const User = require('../models/User');  // Import User model
const authMiddleware = require('../middleware/AuthMiddleWare');  // Import auth middleware

  /**
   * @swagger
   * /api/courses:
   *   get:
   *     summary: Get all courses
   *     tags: [Courses]
   *     responses:
   *       200:
   *         description: Successful retrieval of courses
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   _id:
   *                     type: string
   *                   name:
   *                     type: string
   *                   description:
   *                     type: string
   *                   rating:
   *                     type: number
   */
  router.get('/', async (req, res) => {
    const courses = await Course.find();
    res.json(courses);
  });
  
  /**
   * @swagger
   * /api/courses/latest:
   *   get:
   *     summary: Get the latest courses
   *     tags: [Courses]
   *     responses:
   *       200:
   *         description: Successful retrieval of latest courses
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   _id:
   *                     type: string
   *                   name:
   *                     type: string
   *                   description:
   *                     type: string
   *                   rating:
   *                     type: number
   */
  router.get('/latest', async (req, res) => {
    const latestCourses = await Course.find().sort({ createdAt: -1 }).limit(5);
    res.json(latestCourses);
  });
  
  /**
   * @swagger
   * /api/courses/recommended:
   *   get:
   *     summary: Get recommended courses
   *     tags: [Courses]
   *     responses:
   *       200:
   *         description: Successful retrieval of recommended courses
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   _id:
   *                     type: string
   *                   name:
   *                     type: string
   *                   description:
   *                     type: string
   *                   rating:
   *                     type: number
   */
  router.get('/recommended', async (req, res) => {
    const recommendedCourses = await Course.find().sort({ rating: -1 }).limit(5);
    res.json(recommendedCourses);
  });
  
  /**
   * @swagger
   * /api/courses/{id}/review:
   *   post:
   *     summary: Review a course
   *     tags: [Courses]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Course ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               comment:
   *                 type: string
   *               rating:
   *                 type: number
   *     responses:
   *       201:
   *         description: Review added successfully
   */
  router.post('/:id/review', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { comment, rating } = req.body;
  
    const course = await Course.findById(id);
    course.reviews.push({ comment, rating });
    await course.save();
  
    res.status(201).json(course);
  });
  
  /**
   * @swagger
   * /api/courses/{id}:
   *   get:
   *     summary: Get course details
   *     tags: [Courses]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Course ID
   *     responses:
   *       200:
   *         description: Successful retrieval of course details
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 _id:
   *                   type: string
   *                 name:
   *                   type: string
   *                 description:
   *                   type: string
   *                 rating:
   *                   type: number
   *                 reviews:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       comment:
   *                         type: string
   *                       rating:
   *                         type: number
   */
  router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const course = await Course.findById(id);
    res.json(course);
  });
  
  /**
   * @swagger
   * /api/courses/{id}/like:
   *   post:
   *     summary: Like a course
   *     tags: [Courses]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Course ID
   *     responses:
   *       200:
   *         description: Course liked successfully
   */
  router.post('/:id/like', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
  
    const user = await User.findById(userId);
    user.favorites.push(id);
    await user.save();
  
    res.json({ message: 'Course liked' });
  });
  
  /**
   * @swagger
   * /api/courses/{id}/unlike:
   *   post:
   *     summary: Unlike a course
   *     tags: [Courses]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: Course ID
   *     responses:
   *       200:
   *         description: Course unliked successfully
   */
  router.post('/:id/unlike', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
  
    const user = await User.findById(userId);
    user.favorites = user.favorites.filter(courseId => courseId.toString() !== id);
    await user.save();
  
    res.json({ message: 'Course unliked' });
  });
  
  /**
   * @swagger
   * /api/courses/me/favorites:
   *   get:
   *     summary: Get favorite courses of logged-in user
   *     tags: [Users]
   *     responses:
   *       200:
   *         description: Successful retrieval of favorite courses
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   _id:
   *                     type: string
   *                   name:
   *                     type: string
   *                   description:
   *                     type: string
   *                   rating:
   *                     type: number
   */
  router.get('/me/favorites', authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('favorites');
  
    res.json(user.favorites);
  });

  
  module.exports = router;
