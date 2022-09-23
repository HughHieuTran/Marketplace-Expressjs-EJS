import Product from '../models/product.js';
import express from 'express';

const router = express.Router();

export const getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add new product',
    path: '/admin/add-product',
    editing: false,
  });
};

export const postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const imageUrl = req.body.imageUrl;

  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: req.user,
  });
  try {
    await product.save();
    res.redirect('/');
  } catch (err) {
    console.log(err);
  }
};

export const getAdminProducts = async (req, res, next) => {
  try {
    const adminProducts = await Product.find({ userId: req.user._id });
    res.render('admin/adminProducts', {
      prods: adminProducts,
      pageTitle: 'My own products',
      path: '/admin/products',
      editing: false,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getEditProduct = async (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.prodId;

  try {
    const product = await Product.findById(prodId);
    if (!product) {
      res.redirect('/');
    }
    res.render('admin/add-product', {
      pageTitle: 'Update product',
      path: '/admin/add-product',
      editing: editMode,
      product: product,
    });
  } catch (err) {
    console.log(err);
  }
};

export const postEditProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const imageUrl = req.body.imageUrl;

  try {
    const product = await Product.findById(prodId);
    product.title = title;
    product.price = price;
    product.description = description;
    product.imageUrl = imageUrl;

    await product.save();

    res.redirect('/admin/products');
  } catch (err) {
    console.log(err);
  }
};

export const postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    await Product.deleteOne({ _id: prodId, userId: req.user._id });
    res.redirect('/admin/products');
  } catch (err) {
    console.log(err);
  }
};

export default router;
