import mongoose from 'mongoose';
import slugify from 'slugify';

const offerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Offer must have a name'],
      trim: true,
      unique: true,

    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Meal must have a price'],
        },
    newprice: {
      type: Number,
      required: [true, 'Offer must have a new price'],
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: [true, 'Offer must have a category'],
      trim: true,
    },
  },
  { timestamps: true }
);

offerSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

// ✅ شيل الـ indexes دي - مش محتاجها
offerSchema.index({ name: 1 });
offerSchema.index({ slug: 1 });
const Offer = mongoose.model('Offer', offerSchema);
export default Offer;
