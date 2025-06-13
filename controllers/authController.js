const { promisify } = require('util');
const AppError = require('../appError');
const sendEmail = require('./../util/email');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../util/catchAsync');
const crypto = require('crypto');
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  //   const newUser = await User.create(req.body); security flaw
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirmation: req.body.passwordConfirmation,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return next(new AppError('Please provide email,password', 404));
  }
  const user = await User.findOne({ email: email }).select('+password');

  const correct = await user.correctPassword(password, user.password);
  console.log(correct);
  if (!user || !correct) {
    return next(new AppError('Please provide correct details', 404));
  }
  const token = signToken(user._id);
  res.status(201).json({
    status: 'success',
    token,
    data: { user },
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return next(new AppError('User must be logged in', 401));

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const freshUser = await User.findById(decoded.id);
  console.log(freshUser);
  if (!freshUser) {
    return next(new AppError('User doesnt exist', 401));
  }

  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('user changed password recently', 401));
  }
  req.user = freshUser;

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('u dont have permission todo', 401));
    }
    next();
  };
};

// exports.restrictTo = (req, res, next) => {
//   if (!(req.user.role === 'admin')) {
//     return next(new AppError('not allowed', 401));
//   }
//   next();
// };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    console.log(user);

    if (!user) {
      return next(new AppError('no user', 401));
    }
    // res.send(user);
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a   patch  request with your new password and passwordConfirm to
  ${resetURL}`;

    // await sendEmail({
    //   email: user.email,
    //   subject: 'Regarding password change',
    //   message,
    // });

    res.status(201).json({
      status: 'Success',
      message: 'Token send to email',
      mail: message,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('Try again', 401));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.t)
    .digest('hex');

  const user = await User.findOne({
    passwordResetExpires: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('No user  or timeout', 401));
  }

  user.password = req.body.password;
  user.passwordConfirmation = req.body.passwordConfirmation;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  const token = signToken(user._id);
  res.status(201).json({
    status: 'success',
    token,
    data: { user },
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.correctPassword(req.body.passwordcurrent, user.password))) {
    return next(new AppError('Enter the correct password', 401));
  }

  user.password = req.body.password;
  user.passwordConfirmation = req.body.passwordConfirmation;
  await user.save({ validateBeforeSave: true });
  //none of this work for findbyidandupdate only by this method

  const token = signToken(user._id);
  res.status(201).json({
    status: 'success',
    token,
    data: { user },
  });
});
