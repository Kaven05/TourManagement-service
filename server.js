const app = require('./app');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('./models/tourModel');
console.log(process.env);
dotenv.config({ path: './config.env' });

const db = process.env.DATABASE_LOCAL;
mongoose
  .connect(db, {
    // useNewUrlParser:true,
    // useCreateIndex:true,
    // useFindAndModify:false
  })
  .then((con) => {
    console.log(con.connections);
  })
  .catch((err) => console.log(err));

// const testTour=new Tour({
//     name:"The Forest Hi ker",
//     rating:4.5,
//     price:879
// });
// testTour.save().then(doc=>{
//     console.log(doc);

// }).catch(err=>{
//     console.log(err);
// });
app.listen(process.env.PORT || 8000, () => {
  console.log('App started');
});
