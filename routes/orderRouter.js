import express from 'express';

const router = express.Router();

import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrder,
  updateOrder,
  deleteAllOrders,
} from '../controller/orderController.js';
import { get } from 'mongoose';

router.route('/').post(createOrder).get(getAllOrders);
router.route('/:id').get(getOrder).patch(updateOrder).delete(deleteOrder);

router.route('/').delete(deleteAllOrders);

export default router;
