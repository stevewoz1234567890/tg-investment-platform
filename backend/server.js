const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const users = require('./routes/api/users');
const price = require('./routes/api/price');
const admin = require('./routes/api/admin');
const license = require('./routes/api/license');
const app = express();
const SocketServer = require('./socket.js');
const auth = require('./controllers/AuthController');
global.paypalAccessToken = '';

const publicDir = path.join(__dirname, 'public');
const frontendBuildDir = path.join(__dirname, '../frontend/build');

app.use(cors());
app.options('*', cors());
app.use(express.static(publicDir));

app.use(express.urlencoded({ extended: true }));
app.use(
  express.json({
    verify: (req, res, buf) => {
      if (req.originalUrl.includes('/stripe/webhook')) {
        req.rawBody = buf;
      }
    },
  }),
);

app.use('/api/user', users);
app.use('/api/price', price);
app.use('/api/admin', auth.isAuthorized, admin);
app.use('/api/license', license);

if (fs.existsSync(frontendBuildDir)) {
  app.use(express.static(frontendBuildDir));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ success: false, msg: 'Not found' });
    }
    res.sendFile(path.join(frontendBuildDir, 'index.html'));
  });
} else {
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ success: false, msg: 'Not found' });
    }
    res
      .status(503)
      .type('text')
      .send(
        'Frontend build not found. Run "npm run build" in frontend/, or use the React dev server for local UI.',
      );
  });
}

const mongoURI = require('./config/keys').mongoURI;

const dbUser = process.env.DB_USERNAME;
const dbPass = process.env.DB_PASSWORD;
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  dbName: process.env.DB_NAME || 'TG',
  retryWrites: true,
};
if (dbUser && dbPass) {
  mongoOptions.user = dbUser;
  mongoOptions.pass = dbPass;
}

mongoose
  .connect(mongoURI, mongoOptions)
  .then(() => console.log('MongoDB successfully connected'))
  .catch((err) => console.log(err));

const port = process.env.PORT || 5000;
const server = app.listen(port, () => console.log(`Server up and running on port ${port} !`));

SocketServer.getInstance(server);
