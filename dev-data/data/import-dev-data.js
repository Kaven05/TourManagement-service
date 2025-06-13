const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('./../../models/tourModel');
const User = require('./../../models/userModel');
const Review = require('./../../models/reviewModel');

const fs = require('fs');

// console.log(process.env);
dotenv.config({ path: './../../config.env' });

const db = process.env.DATABASE_LOCAL;
mongoose
  .connect(db, {
    // useNewUrlParser:true
    // useCreateIndex:true,
    // useFindAndModify:false
  })
  .then((con) => {
    console.log('connection established');
  });

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data successfull');
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    console.log('d');

    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Deleted data');
  } catch (err) {
    console.log(err);
  }
};
if (process.argv[2] === '--import') {
  //node import-dev-data.js --import
  importData();
} else if (process.argv[2] === '--delete') {
  //node import-dev-data.js --delete
  deleteData();
}

console.log(process.argv);
