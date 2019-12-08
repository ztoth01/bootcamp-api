const express = require('express');
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsWithinRadius,
  uploadBootcampPhoto
} = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamp');

// Include other resource routers
const courseRouter = require('./courses');
const reviewRouter = require('./reviews');

const router = express.Router();

// Middleware
const advancedResults = require('../middleware/advancedResults');
const { protect, authorise } = require('../middleware/auth');

// re-route into other resource routes
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, authorise('publisher', 'admin'), createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(protect, authorise('publisher', 'admin'), updateBootcamp)
  .delete(protect, authorise('publisher', 'admin'), deleteBootcamp);

router
  .route('/:id/photo')
  .put(protect, authorise('publisher', 'admin'), uploadBootcampPhoto);

router.route('/radius/:zipcode/:distance/:unit').get(getBootcampsWithinRadius);

module.exports = router;
