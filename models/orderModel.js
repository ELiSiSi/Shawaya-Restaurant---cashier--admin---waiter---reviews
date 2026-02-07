import mongoose from 'mongoose';
import AutoIncrementFactory from 'mongoose-sequence';

// لازم تبعت الموديل نفسه للـ plugin
const AutoIncrement = AutoIncrementFactory(mongoose);

const orderSchema = new mongoose.Schema(
  {
    numberOrder: {
      type: Number,
      unique: true,
    },
    name: {
      type: String,
      trim: true,
      default: '',
    },
    number: {
      type: String,
      trim: true,
      match: [/^01[0125][0-9]{8}$/, 'رقم الهاتف غير صحيح'],
    },
    address: {
      type: String,
      required: [true, 'يجب إدخال العنوان'],
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    cart: [
      {
        name: {
          type: String,
          required: [true, 'يجب إدخال اسم المنتج'],
          trim: true,
        },
        price: {
          type: Number,
          required: [true, 'يجب إدخال سعر المنتج'],
          min: [0, 'السعر يجب أن يكون أكبر من 0'],
        },
        image: {
          type: String,
        },
        quantity: {
          type: Number,
          required: [true, 'يجب إدخال كمية المنتج'],
          min: [1, 'الكمية يجب أن تكون 1 على الأقل'],
        },
      },
    ],
    total: {
      type: Number,
      required: [true, 'يجب إدخال المجموع الكلي'],
      min: [0, 'المجموع يجب أن يكون أكبر من 0'],
    },
    status: {
      type: String,
      enum: ['pending', 'done', 'cancel'],
      default: 'pending',
    },
    paying: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.plugin(AutoIncrement, {
  inc_field: 'numberOrder', // اسم الحقل اللي هنزود فيه
  start_seq: 1000, // تبدأ من أي رقم (اختياري، ممكن 1 أو 10000 ...)
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
