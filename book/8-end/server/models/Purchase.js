import mongoose, { Schema } from 'mongoose';

const mongoSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  bookId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  stripeCharge: {
    id: String,
    amount: Number,
    created: Number,
    livemode: Boolean,
    paid: Boolean,
    status: String,
  },
});

mongoSchema.index({ bookId: 1, userId: 1 }, { unique: true });

const Purchase = mongoose.model('Purchase', mongoSchema);

export default Purchase;
