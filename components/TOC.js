import PropTypes from 'prop-types';
import Grid from 'material-ui/Grid';

function getItemElm(i, chapter, bookSlug) {
  return (
    <div key={chapter._id}>
      <b>
        <a
          href={`/books/${bookSlug}/${chapter.slug}`}
          style={{ color: 'primary' }}
          target="_blank"
          rel="noopener noreferrer"
        >
          Chapter {i}: {chapter.title}
        </a>
      </b>
      <br />
      {chapter.sections.map(s => <li key={s._id}>{s.text}</li>)}
      <br />
    </div>
  );
}

export default function TOC({ toc, bookSlug }) {
  if (!toc || toc.length === 0) {
    return null;
  }

  const left = [];
  const right = [];

  const middle = Math.floor(toc.length / 2) + toc.length % 2 + 1;
  for (let i = 1; i < middle; i += 1) {
    left.push(getItemElm(i, toc[i - 1], bookSlug));
  }

  for (let i = middle; i <= toc.length; i += 1) {
    right.push(getItemElm(i, toc[i - 1], bookSlug));
  }

  return (
    <div>
      <h1
        style={{
          textAlign: 'center',
          fontWeight: '400',
          lineHeight: '45px',
        }}
      >
        Table of Contents
      </h1>
      <p />
      <Grid
        style={{ padding: '0% 8%' }}
        container
        direction="row"
        justify="space-around"
        align="flex-start"
      >
        <Grid item sm={6} xs={12} style={{ textAlign: 'left' }}>
          {left}
        </Grid>
        <Grid item sm={6} xs={12} style={{ textAlign: 'left' }}>
          {right}
        </Grid>
      </Grid>
    </div>
  );
}

TOC.propTypes = {
  toc: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
  })).isRequired,
  bookSlug: PropTypes.string.isRequired,
};
