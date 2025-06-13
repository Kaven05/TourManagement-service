const express = require('express');
const path = require('path');
const fs = require('fs');
const tourRouter = require('./routes/tourRouter');
const userRouter = require('./routes/userRouter');
const reviewRouter = require('./routes/reviewRouter');
const AppError = require('./appError');
const errorControllor = require('./controllers/errorController');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.get('/', (req, res) => {
  res.status(201).render('base');
});

app.use((req, res, next) => {
  console.log('Middleware');
  next();
});

app.use((req, res, next) => {
  const r = new Date().toISOString();
  console.log(req.headers);

  next();
});

// app.get("/api/v1/tours/:id",gettour);
// app.post("/api/v1/tours",createtour);
// app.patch("/api/v1/tours/:id",updatetour);
// app.delete("/api/v1/tours/:id",deletetour);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError('no url in this server', 404));
});

app.use(errorControllor);

module.exports = app;
