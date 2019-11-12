// @desc Logs request to console
const logger = (req, res, next) => {
  req.middlewareMsg = 'middleware';
  console.log(
    `${req.method} ${req.protocol}://${req.originalUrl} ${req.middlewareMsg}`
  );
  next();
};

module.exports = logger;
