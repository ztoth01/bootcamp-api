const express = require('express');
const router = express.Router();

// Ger all bootcamps
router.get('/', (req, res) => {
  res.status(200).json({ success: true, msg: 'Show all bootcamps' });
});

// Get single bootcamp
router.get('/:id', (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: `Show a bootcamp with id:${req.params.id}` });
});

// Create a new bootcamp
router.post('/', (req, res) => {
  res.status(201).json({ success: true, msg: 'Created a bootcamp' });
});

// Update a bootcamp
router.put('/:id', (req, res) => {
  res
    .status(201)
    .json({ success: true, msg: `Update bootcamp with id:${req.params.id}` });
});

// Delte a bootcampp
router.delete('/:id', (req, res) => {
  res
    .status(201)
    .json({ success: true, msg: `Delte bootcamp with id:${req.params.id}` });
});

module.exports = router;
