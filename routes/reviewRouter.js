import express from 'express';
import {
   submitReview,
  deleteAllReviews,
 } from '../controller/reviewController.js';

const router = express.Router();

 router.post('/', submitReview);
 router.get('/', deleteAllReviews);
export default router;
