import React from 'react';
import PropTypes from 'prop-types';
import Error from 'next/error';
import Head from 'next/head';
import Grid from 'material-ui/Grid';

import { getChapterDetail } from '../../lib/api/public';
import withLayout from '../../lib/withLayout';
import withAuth from '../../lib/withAuth';

const styleGrid = {
  flexGrow: '1',
};

class ReadChapter extends React.Component {
  static propTypes = {
    chapter: PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }),
  };

  static defaultProps = {
    chapter: null,
  };

  static async getInitialProps({ req, query }) {
    const { bookSlug, chapterSlug } = query;

    const headers = {};
    if (req && req.headers && req.headers.cookie) {
      headers.cookie = req.headers.cookie;
    }

    const chapter = await getChapterDetail({ bookSlug, chapterSlug }, { headers });

    return { chapter };
  }

  constructor(props) {
    super(props);

    const { chapter } = props;

    const htmlContent = '' || chapter.htmlContent;

    this.state = {
      chapter,
      htmlContent,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { chapter } = nextProps;
    if (!chapter) {
      return;
    }

    const htmlContent = '' || chapter.htmlContent;

    this.setState({ chapter: nextProps.chapter, htmlContent });
  }

  renderChapterContent() {
    const { chapter, htmlContent } = this.state;

    return (
      <div>
        <h3>Chapter: {chapter.title}</h3>

        <div className="main-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    );
  }

  render() {
    const { chapter } = this.state;

    if (!chapter) {
      return <Error statusCode={404} />;
    }

    const { book } = chapter;

    return (
      <div style={{ padding: '10px 45px' }}>
        <Head>
          <title>
            {chapter.title === 'Introduction'
              ? 'Introduction'
              : `Chapter ${chapter.order - 1}. ${chapter.title}`}
          </title>
          {chapter.seoDescription ? (
            <meta name="description" content={chapter.seoDescription} />
          ) : null}
        </Head>

        <Grid style={styleGrid} container direction="row" justify="space-around" align="flex-start">
          <Grid
            item
            sm={10}
            xs={12}
            style={{
              textAlign: 'left',
              paddingLeft: '25px',
            }}
          >
            <h2>Book: {book.name}</h2>

            {this.renderChapterContent()}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withAuth(withLayout(ReadChapter), { loginRequired: false });
