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


router.get(`/chef/:password`, chefPage);

router.get(`/waiter/:password`, waitersPage);

router.get(`/cashier/:password`, cashierPage);

router.get(`/dashboard/:password/admin/juewsorfewofsihgnfvijsdgjsdjkigfsdgfierhiugfheruiwfierugf`, adminPage);

router.get(
  `/reviews/:password/admin/juewsorfewofsihgnfvijsdgjsdjkigfsdgfierhiugfheruiwfierugf`,
  AllReviews
);


export default router;
