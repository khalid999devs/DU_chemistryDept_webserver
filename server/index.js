require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const db = require('./models');
const cookieParser = require('cookie-parser');
const cors = require('cors');

//cors
const whitelist = process.env.REMOTE_CLIENT_APP.split(',');
const corOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors());

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('secret'));

app.use('/uploads', express.static(__dirname + '/uploads'));

//routers
app.get('/test', (req, res) => {
  res.json({
    succeed: true,
    msg: 'Successfully connected to the server!',
  });
});

const adminRouter = require('./routers/admin');
const teacherRouter = require('./routers/teachers');
const studentRouter = require('./routers/students');
const noticeRouter = require('./routers/notices');
const memorialRouter = require('./routers/memorials');
const writingRouter = require('./routers/writings');
const alumniwritingRouter = require('./routers/alumniwritings');
const eventRouter = require('./routers/events');

app.use('/api/admin', adminRouter);
app.use('/api/teachers', teacherRouter);
app.use('/api/students', studentRouter);
app.use('/api/notices', noticeRouter);
app.use('/api/memorials', memorialRouter);
app.use('/api/writings', writingRouter);
app.use('/api/alumniwritings', alumniwritingRouter);
app.use('/api/events', eventRouter);

//notfound and errors
const errorHandlerMiddleWare = require('./middlewares/errorHandler');
const notFoundMiddleWare = require('./middlewares/notFound');

app.use(notFoundMiddleWare);
app.use(errorHandlerMiddleWare);

//ports and start
const PORT = process.env.PORT || 8001;
db.sequelize
  .sync()
  .then((_) => {
    console.log(`database connected`);
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}...`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
