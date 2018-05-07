const mongoose = require('mongoose');

const { Schema } = mongoose;

const mongoSchema = new Schema({
  bookSlug: {
    type: String,
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

async function insertReviewDocument() {
  const review = {
    bookSlug: 'builder-book',
    reviews: [
      {
        name: 'Kelly Burke',
        order: 1,
        location: 'WA',
        photoUrl: 'https://storage.googleapis.com/builderbook/kelly-picture.png',
        link: 'https://builderbook.org/',
        reviewText:
          'I use various online resources like udemy.com and acloud.guru for eLearning, but this book is the best thus far to get one up to speed with the necessary skill sets to immediately run a web application.',
      },
      {
        name: 'Kelly Burke',
        order: 2,
        location: 'WA',
        photoUrl: 'https://storage.googleapis.com/builderbook/kelly-picture.png',
        link: 'https://builderbook.org/',
        reviewText:
          'I use various online resources like udemy.com and acloud.guru for eLearning, but this book is the best thus far to get one up to speed with the necessary skill sets to immediately run a web application.',
      },
      {
        name: 'Kelly Burke',
        order: 3,
        location: 'WA',
        photoUrl: 'https://storage.googleapis.com/builderbook/kelly-picture.png',
        link: 'https://builderbook.org/',
        reviewText:
          'I use various online resources like udemy.com and acloud.guru for eLearning, but this book is the best thus far to get one up to speed with the necessary skill sets to immediately run a web application.',
      },
      {
        name: 'Kelly Burke',
        order: 4,
        location: 'WA',
        photoUrl: 'https://storage.googleapis.com/builderbook/kelly-picture.png',
        link: 'https://builderbook.org/',
        reviewText:
          'I use various online resources like udemy.com and acloud.guru for eLearning, but this book is the best thus far to get one up to speed with the necessary skill sets to immediately run a web application.',
      },
    ],
  };

  const count = await Review.findOne({ bookSlug: 'builder-book' }).count();

  if (count === 0) {
    Review.create(Object.assign({}, review));
  }
}

insertReviewDocument();

module.exports = Review;
