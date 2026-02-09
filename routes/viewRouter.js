import express from "express";
const router = express.Router();

import {
  homepage,
  menupage,
  offersPage,
  cartpage,
  reviewPage,
} from '../controller/viewController.js';

// View Routes
router.get('/', homepage);
router.get('/menu', menupage);
router.get('/offers', offersPage);
router.get('/cart', cartpage);
router.get('/review', reviewPage);


export default router;
