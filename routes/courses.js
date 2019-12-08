const express = require('express');

const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courses');

const Course = require('../models/Course');

// Middlewares
const advancedResults = require('../middleware/advancedResults');
const { protect, authorise } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(
    advancedResults(Course, {
      path: 'bootcamp',
      select: 'name description'
    }),
    getCourses
  )
  .post(protect, authorise('publisher', 'admin'), createCourse);

router
  .route('/:id')
  .get(getCourse)
  .put(protect, authorise('publisher', 'admin'), updateCourse)
  .delete(protect, authorise('publisher', 'admin'), deleteCourse);

module.exports = router;
