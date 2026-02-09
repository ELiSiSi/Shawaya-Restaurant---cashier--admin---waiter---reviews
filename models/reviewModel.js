import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    numGTables: {
      type: Number,
      default: 0,
    },
    cashier: Number,
    cleanliness: Number,
    foodQuality: Number,
    service: Number,
    notes: { type: String, default: '' },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Review = mongoose.model('Rating', reviewSchema);

export default Review;
