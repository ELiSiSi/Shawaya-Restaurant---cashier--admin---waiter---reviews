import mongoose from 'mongoose';
import slugify from 'slugify';

const mealSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Meal must have a name'],
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
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: [true, 'Meal must have a category'],
      trim: true,
    },
  },
  { timestamps: true }
);

mealSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

// ✅ شيل الـ indexes دي - مش محتاجها
mealSchema.index({ name: 1 });
mealSchema.index({ slug: 1 });

const Meal = mongoose.model('Meal', mealSchema);
export default Meal;
