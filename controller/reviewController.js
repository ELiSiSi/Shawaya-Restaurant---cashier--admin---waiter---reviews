import asyncHandler from 'express-async-handler';

import Review from '../models/reviewModel.js';



// Submit Review -----------------------------------------------------------------------------------
export const submitReview = asyncHandler(async (req, res) => {
  if (!req.body.name || !req.body.phone || !req.body.numGTables) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  const newReview = new Review(req.body);
  await newReview.save();

  res.status(200).json({ message: 'تم إرسال التقييم بنجاح' });
});


// Delete All -----------------------------------------------------------------------------------
export const deleteAllReviews = asyncHandler(async (req, res) => {
  await Review.deleteMany({});
  res.redirect('/all-reviews');
});
