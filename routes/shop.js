import express from 'express';

import isAuth from '../middleware/isAuth.js';

import {
  getCart,
  getDetail,
  getIndex,
  getOrder,
  postCart,
  postDeleteCart,
  postOrder,
} from '../controllers/shop.js';

const router = express.Router();

router.get('/', getIndex);

router.get('/products/:prodId', isAuth, getDetail);

router.get('/cart', isAuth, getCart);

router.post('/cart', isAuth, postCart);

router.post('/cart-delete-item', isAuth, postDeleteCart);

router.get('/orders', isAuth, getOrder);

router.post('/orders', isAuth, postOrder);

export default router;
