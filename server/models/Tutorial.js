import mongoose, { Schema } from 'mongoose';

const mongoSchema = new Schema({
  tutorials: [
    {
      title: {
        type: String,
        required: true,
      },
      excerpt: {
        type: String,
        required: true,
      },
      link: {
        type: String,
        required: true,
      },
      domain: {
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

const Tutorial = mongoose.model('Tutorial', mongoSchema);

export default Tutorial;
