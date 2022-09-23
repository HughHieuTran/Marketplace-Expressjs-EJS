import express from 'express';
import {
  getAddProduct,
  getAdminProducts,
  getEditProduct,
  postAddProduct,
  postEditProduct,
  postDeleteProduct,
} from '../controllers/admin.js';

import isAuth from '../middleware/isAuth.js';

const router = express.Router();

router.get('/add-product', isAuth, getAddProduct);

router.post('/add-product', isAuth, postAddProduct);

router.get('/products', isAuth, getAdminProducts);

router.get('/edit-product/:prodId', isAuth, getEditProduct);

router.post('/edit-product', isAuth, postEditProduct);

router.post('/delete-product', isAuth, postDeleteProduct);

export default router;
