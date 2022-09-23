import express from 'express';
import Product from '../models/product.js';
import Order from '../models/order.js';

const router = express.Router();

const ITEMS_PER_PAGE = 4;

export const getIndex = async (req, res, next) => {
  const currentPage = +req.query.page || 1;
  let totalItems;
  totalItems = await Product.countDocuments();
  const lastPage = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const products = await Product.find()
    .skip((currentPage - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE);
  res.render('shop/index.ejs', {
    prods: products,
    pageTitle: 'Shop',
    path: '/',
    currentPage: currentPage,
    hasNextPage: ITEMS_PER_PAGE * currentPage < totalItems,
    hasPreviousPage: currentPage > 1,
    nextPage: currentPage + 1,
    previousPage: currentPage - 1,
    lastPage: lastPage,
  });
};

export const getDetail = async (req, res, next) => {
  const prodId = req.params.prodId;
  const product = await Product.findById(prodId);

  res.render('shop/detail', {
    product: product,
    pageTitle: 'shop',
    path: '/',
  });
};

export const postCart = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    const product = await Product.findById(prodId);
    if (!product) {
      res.redirect('/');
    }
    await req.user.addToCart(product);
    res.redirect('/cart');
  } catch (err) {
    console.log(err);
  }
};

export const getCart = async (req, res, next) => {
  try {
    const user = await req.user.populate('cart.items.productId');
    const products = user.cart.items;
    res.render('shop/cart', {
      products: products,
      pageTitle: 'cart',
      path: '/cart',
    });
  } catch (err) {
    console.log(err);
  }
};

export const postDeleteCart = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    await req.user.removeFromCart(prodId);
    res.redirect('/cart');
  } catch (err) {
    console.log(err);
  }
};

export const getOrder = async (req, res, next) => {
  const orders = await Order.find({ 'user.userId': req.user._id });
  if (!orders) {
    orders = [];
  }
  res.render('shop/order', {
    orders: orders,
    pageTitle: 'cart',
    path: '/orders',
  });
};

export const postOrder = async (req, res, next) => {
  const user = await req.user.populate('cart.items.productId');
  const products = user.cart.items.map((i) => {
    return {
      quantity: i.quantity,
      product: { ...i.productId._doc },
    };
  });

  const order = new Order({
    products,
    user: { email: req.user.email, userId: req.user._id },
  });
  await order.save();
  await req.user.clearCart();
  res.redirect('/orders');
};

export default router;
