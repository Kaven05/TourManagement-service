const fs = require('fs');
const User = require('./../models/userModel');
const catchAsync = require('./../util/catchAsync');
const AppError = require('../appError');
const factory = require('./handleFactory');

// exports.checkid = (req, res, next, id) => {
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       message: 'invalid',
//       status: 'nil',
//     });
//   }
//   next();
// };
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;

  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordconfirm) {
    return next(new AppError('This route is not for password change', 401));
  }
  const user = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(201).json(user);
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead',
  });
};

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);

// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
