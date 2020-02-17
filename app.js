var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const multer = require('multer')
const bodyParse = require('body-parser')
// var cors = require('cors')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With,withcredentials");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  if (req.method == 'OPTIONS') {
    res.send(200); 
  }
  else {
    next();
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// app.use(cors())

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/public')
  },
  filename: function (req, file, cb) {
    cb(null, "aaa")
  }
})
// 
// var upload = multer({ storage: storage })
const upload = multer({
  dest: './'
})
app.use(upload.any())
app.use(bodyParse.urlencoded({extended:false}))
app.use(bodyParse.json())

app.post('/upload', upload.single('file'),(req, res, next) => {
  console.log(req.body)
  console.log(req.files)
  res.send({
    error: 0,
    data: req.body,
    msg: 'succeed'
  })
})

// .get('/download', (req, res, next) => {
//   console.log(req.data)
//   res.download("")
//   // res.send({
//   //   error: 0,
//   //   data: req.data,
//   //   msg: '注册成功'
//   // })
// })

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
