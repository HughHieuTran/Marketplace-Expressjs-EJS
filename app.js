import * as url from 'url';
export const __filename = url.fileURLToPath(import.meta.url);
export const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoDBStoreSession from 'connect-mongodb-session';
import cors from 'cors';

const database =
  'your mongo uri';
const port = 3000;
const app = express();

const MongoDBStore = MongoDBStoreSession(session);
const store = new MongoDBStore({
  uri: database,
  collection: 'sessions',
});

app.set('views', 'views');
app.set('view engine', 'ejs');

import shopRoutes from './routes/shop.js';
import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js';
import { get404 } from './controllers/error.js';

import User from './models/user.js';

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(get404);

mongoose
  .connect(database)
  .then((result) => {
    app.listen(port, () => {
      console.log(`listening on PORT ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
