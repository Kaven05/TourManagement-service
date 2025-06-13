const Tour = require('./../models/tourModel');
const AppError = require('./../appError');

const catchAsync = require('./../util/catchAsync');
const factory = require('./handleFactory');

exports.alias = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.deletetour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gt: 4.5 } },
    },
    {
      $group: {
        // _id:null,
        _id: { $toUpper: '$difficulty' },
        numTour: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    {
      $match: { _id: { $ne: 'EASY' } },
    },
  ]);
  res.status(201).json({
    status: 'Success',
    data: {
      stats,
    },
  });
});

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

// exports.getalltour = catchAsync(async (req, res, next) => {
//   //FILTERING
//   console.log(req.query);

//   // const queryObj = {...req.query};
//   // const exculdedfields=['page','sort','limit','fields'];
//   // exculdedfields.forEach(el=> delete queryObj[el]);
//   // var queryStr=JSON.stringify(queryObj);
//   // queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match =>`$${match}`);

//   // let query =  Tour.find(JSON.parse(queryStr));

//   // if(req.query.sort){
//   //     const sortBy =req.query.sort.split(',').join(' ');
//   //     query=query.sort(req.query.sort);
//   // }else{
//   //     query=query.sort('-createdAt');

//   // }
//   // if (req.query.fields) {
//   //     const fields=req.query.fields.split(',').join(' ');
//   //     query=query.select(fields);
//   // } else {
//   //     query=query.select('-__v');
//   // }

//   //PAGING
//   // const page=req.query.page*1 ||1;
//   // const limit=req.query.limit*1||1;
//   // const skip=(page-1)*limit;
//   // query=query.skip(skip).limit(limit);
//   // if (req.query.page) {
//   //     const numTours=await Tour.countDocuments();
//   //     if(skip>=numTours) throw new Error("This page does not exise");
//   //  }
//   const features = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .fields()
//     .paging();
//   const files = await features.query;
//   res.status(201).json(files);
// });

// exports.gettour = catchAsync(async (req, res, next) => {
//   // console.log(req.params);
//   const id = req.params.id;
//   const tour = await Tour.findById(id).populate({ path: 'reviews' });

//   if (!tour) {
//     return next(new AppError('Correct id', 404));
//   }

//   res.status(201).json(tour);
// });

// exports.createtour = catchAsync(async (req, res, next) => {
//   const newTour = await Tour.create(req.body);
//   res.status(201).json({
//     status: 'Success',
//     data: {
//       tour: newTour,
//     },
//   });
//   // try {

//   // } catch (err) {
//   //   res.json({
//   //     status: 'unSuccess',
//   //     data: {
//   //       tour: err,
//   //     },
//   //   });
// });

// exports.updatetour = catchAsync(async (req, res, next) => {
//   const id = req.params.id;
//   const tour = await Tour.findByIdAndUpdate(id, req.body, {
//     new: true,
//     runValidators: true,
//   });
//   if (!tour) {
//     return next(new AppError('Correct id', 404));
//   }
//   res.status(201).json(tour);
// });

// exports.deletetour = catchAsync(async (req, res, next) => {
//   const id = req.params.id;
//   const tour = await Tour.deleteOne({ _id: id });
//   if (!tour) {
//     return next(new AppError('Correct id', 404));
//   }
//   res.status(201).json({ status: 'Deleted', data: { tour } });
// });

// exports.checkbody=(req,res,next)=>{
//     if(!req.body.name || !req.body.price){
//         res.status(200).json({
//             message:'No name price'
//         });
//     }
//     next();
// }
// exports.checkid=(req,res,next,id)=>{
//     if (req.params.id*1>tours.length){
//         return res.status(404).json({
//             message:'invalid',
//             status:'nil'
//         })
//     }
//     next();
// }
