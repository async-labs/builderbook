import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';
import Avatar from 'material-ui/Avatar';
import { styleBigAvatar } from '../lib/SharedStyles';

const styleH1 = {
  textAlign: 'center',
  fontWeight: '400',
  lineHeight: '45px',
};

const styleReview = {
  backgroundColor: 'white',
  padding: '15px',

  textAlign: 'left',
};

function getSingleReview(i, review) {
  return (
    <Grid item sm={3} xs={12} style={{ textAlign: 'center', padding: '10px' }} key={review.order}>
      <Avatar src={review.photoUrl} style={styleBigAvatar} alt={review.name} />
      <p>
        <a href={review.link} target="_blank" rel="noopener noreferrer">
          {review.name}
        </a>
        <br />
        {review.location}
      </p>
      <p style={styleReview}>
        <i>&quot;{review.reviewText}.&quot;</i>
      </p>
    </Grid>
  );
}

export default function BookReviews({ reviewsArray, numberOfReviews }) {
  if (!reviewsArray || reviewsArray.length === 0) {
    return null;
  }
  const multipleItems = [];
  const maxLimit = numberOfReviews || reviewsArray.length;
  for (let i = 1; i <= maxLimit; i += 1) {
    multipleItems.push(getSingleReview(i, reviewsArray[i - 1]));
  }

  return (
    <div>
      <h1 style={styleH1}>Book Reviews</h1>
      <p />
      <Grid container direction="row" justify="space-around" align="flex-start">
        {multipleItems}
      </Grid>
    </div>
  );
}

BookReviews.propTypes = {
  reviewsArray: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    order: PropTypes.number.isRequired,
    location: PropTypes.string.isRequired,
    photoUrl: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    reviewText: PropTypes.string.isRequired,
  })).isRequired,
  numberOfReviews: PropTypes.number.isRequired,
};
