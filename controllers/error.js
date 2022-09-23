import express from 'express';
const router = express.Router();

export const get404 = (req, res, next) => {
  res.status(404).render('404', {
    pageTitle: 'Page Not Found',
    path: '/404',
    editing: false,
  });
};

export default router;
