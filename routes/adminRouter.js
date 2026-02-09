import express from "express";

const router = express.Router();

import {
  loginAdmin,
  adminPage,
  chefPage,
  waitersPage,
  cashierPage,
  AllReviews,
} from '../controller/adminController.js';

// Admin Routes
router.get('/login', loginAdmin);

router.get(`/dashboard/:password`, adminPage);

router.get(`/chef/:password`, chefPage);

router.get(`/waiter/:password`, waitersPage);

router.get(`/cashier/:password`, cashierPage);

router.get(`/reviews/:password`, AllReviews);


export default router;
