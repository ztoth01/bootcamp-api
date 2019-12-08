const express = require('express');

const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/reviews');

const router = express.Router({ mergeParams: true });

const Review = require('../models/Review');

const advancedResults = require('../middleware/advancedResults');
const { protect, authorise } = require('../middleware/auth');

router
  .route('/')
  .get(
    advancedResults(Review, {
      path: 'bootcamp',
      select: 'name description'
    }),
    getReviews
  )
  .post(protect, authorise('user', 'admin'), createReview);

router
  .route('/:id')
  .get(getReview)
  .put(protect, authorise('user', 'admin'), updateReview)
  .delete(protect, authorise('user', 'admin'), deleteReview);

module.exports = router;
