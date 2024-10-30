var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('express-flash');
var session = require('express-session');
var expressLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var cors = require("cors")

const db = require('./models');
db.sequelize.sync({ alter: true }).then((req) => {
  console.log("database connection successfully !");
}).catch((err) => {
  console.log("database error: ", err);
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');

var app = express();

// Enable CORS for all routes
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));

// Middleware for CORS and JSON parsing
app.use(
  cors({
    origin: ["http://139.162.11.50:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);

// Increase limit for JSON and URL-encoded data
app.use(express.json({ limit: '4000mb' }));
app.use(express.urlencoded({ limit: '4000mb', extended: true }));

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  key: 'MessengerPharmaAdminUser',
  secret: 'messenger@pharma@123',
  cookie: {  }
}))
app.use(flash());

app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/users', usersRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
