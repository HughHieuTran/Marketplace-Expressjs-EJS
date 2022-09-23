import express from 'express';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import sgMail from '@sendgrid/mail';

const router = express.Router();

sgMail.setApiKey(
  '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'
);

export const getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    errorMessage: '',
    email: '',
  });
};

export const postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.render('auth/login', {
      pageTitle: 'Login',
      path: '/login',
      errorMessage: 'Email is not exist on the system',
      email: email,
    });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  console.log(isMatch);
  if (isMatch) {
    req.session.user = user;
    req.session.isLoggedIn = true;
    console.log(req.session.user);
    console.log(req.session.isLoggedIn);
    try {
      await req.session.save();
      return res.redirect('/');
    } catch (err) {
      console.log(err);
    }
  } else {
    return res.status(422).render('auth/login', {
      pageTitle: 'Login',
      path: '/login',
      errorMessage: 'Password is incorrect',
      email: email,
    });
  }
};

export const getSignup = (req, res, next) => {
  res.render('auth/signup', {
    pageTitle: 'Singup',
    path: '/signup',
    errorMessage: '',
  });
};
export const postSignup = async (req, res, render) => {
  const email = req.body.email;
  const password = req.body.password;
  const userDoc = await User.findOne({ email: email });
  if (userDoc) {
    return res.status(422).render('auth/signup', {
      pageTitle: 'Signup',
      path: '/signup',
      errorMessage: 'email has already been used',
    });
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = new User({
    email,
    password: hashedPassword,
    cart: { items: [] },
  });
  try {
    await user.save();
    res.redirect('/login');
  } catch (err) {
    console.log(err);
  }
};

export const postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};

export const getReset = (req, res, next) => {
  res.render('auth/reset', {
    pageTitle: 'Reset',
    path: '/Reset',
    errorMessage: '',
    email: '',
  });
};

export const postReset = async (req, res, next) => {
  const email = req.body.email;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(422).render('auth/reset', {
        pageTitle: 'Reset',
        path: '/Reset',
        errorMessage: 'Email is not exist on the system',
        email: '',
      });
    }
    const token = Math.floor(Math.random() * 1000) + 10;
    // await sgMail.send({
    //   to: email, // Change to your recipient
    //   from: 'nhotaikhoanok@gmail.com', // Change to your verified sender
    //   subject: 'Request a new password',
    //   text: 'Go to this link and enter a new password',
    //   html: `<a href="http://localhost:3000/reset/${token}">Your request for a new password link</a>`,
    // });
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000;
    await user.save();
    res.redirect('/');
  } catch (err) {
    console.log(err);
  }
};

export const getNewPassword = async (req, res, next) => {
  const token = req.params.token;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  });

  if (!user) {
    return res.render('auth/reset', {
      pageTitle: 'Reset',
      path: '/Reset',
      errorMessage: 'Email is not exist or token is expired',
      email: '',
      token: token,
    });
  }

  return res.render('auth/getNewPassword', {
    pageTitle: 'New password',
    path: '/new-password',
    errorMessage: '',
    token: token,
    userId: user._id.toString(),
  });
};

export const postNewPassword = async (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.token;

  try {
    const user = await User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId,
    });
    console.log(user);
    if (!user) {
      return res.status(422).render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: 'Request for new password expired',
        userId: user._id.toString(),
      });
    }
    user.token = undefined;
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();
    return res.redirect('/login');
  } catch (err) {
    console.log(err);
  }
};

export default router;
