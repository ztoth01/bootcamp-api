const ErrorHandler = require('../utils/errorResopnse');
const Bootcamp = require('../models/Bootcamp');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single bootcamp
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id).populate({
    path: 'courses',
    select: 'tuition'
  });

  if (!bootcamp) {
    // return is important otherwise 'error: header has already sent'
    return next(
      new ErrorHandler(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc    Create bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  // Add user to req.user
  req.body.user = req.user.id;

  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

  // If the user is not admin only can publish one
  if (publishedBootcamp && req.user.role !== 'admin') {
    return next(
      new ErrorHandler(
        `User with ${req.user.id} has already published a bootcamp`,
        400
      )
    );
  }

  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp
  });
});

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorHandler(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is the bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorHandler(
        `User ${req.user.id} is not authorized to update this bootcamp`,
        401
      )
    );
  }

  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  // findByIdAndDelete would not work with the "Cascade delete courses when a bootcamp is deleted"
  // middlware hence we have to use findById first and then delete
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    // return is important otherwise 'error: header has already sent'
    return next(
      new ErrorHandler(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is the bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorHandler(
        `User ${req.user.id} is not authorized to delete this bootcamp`,
        401
      )
    );
  }

  bootcamp.remove();

  res.status(200).json({ success: true, data: {} });
});

// @desc    Get bootcamps within a radius
// @route   Get /api/v1/bootcamps/radius/:zipcode/:distance/:unit
// @access  Private
exports.getBootcampsWithinRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance, unit } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius usign radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const earthRadius = unit === 'km' ? 6378 : 3963;
  const radius = distance / earthRadius;
  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps
  });
});

// @desc    Upload photo for bootcamp
// @route   Put /api/v1/bootcamps/:id/photo
// @access  Private
exports.uploadBootcampPhoto = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    // return is important otherwise 'error: header has already sent'
    return next(
      new ErrorHandler(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is the bootcamp owner
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorHandler(
        `User ${req.user.id} is not authorized to delete this bootcamp`,
        401
      )
    );
  }

  if (!req.files) {
    return next(new ErrorHandler(`Please upload a file`, 400));
  }

  const file = req.files.file;

  if (!file.mimetype.startsWith('image')) {
    return next(
      new ErrorHandler(
        `Please upload a valid image file eg jpg, png or gif`,
        400
      )
    );
  }

  // Check the file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorHandler(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD} file size`,
        400
      )
    );
  }

  // Create a unique photo name
  file.name = `${req.params.id}_${file.name}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorHandler(`Problem with file upload`, 500));
    }

    await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

    res.status(200).json({
      sucess: true,
      data: file.name
    });
  });
});
