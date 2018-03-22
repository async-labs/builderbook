import mongoose, { Schema } from 'mongoose';

const mongoSchema = new Schema({
  bookId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  reviews: [
    {
      name: {
        type: String,
        required: true,
      },
      location: {
        type: String,
        required: true,
      },
      photoUrl: {
        type: String,
        required: true,
      },
      link: {
        type: String,
        required: true,
      },
      reviewText: {
        type: String,
        required: true,
      },
      order: {
        type: Number,
        required: true,
        unique: true,
      },
    },
  ],
});

const Review = mongoose.model('Review', mongoSchema);

export default Review;
