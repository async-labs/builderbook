import React from 'react';
import PropTypes from 'prop-types';
import Error from 'next/error';
import Head from 'next/head';

import { getChapterDetailApiMethod } from '../../lib/api/public';
import withAuth from '../../lib/withAuth';

const propTypes = {
  chapter: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    htmlContent: PropTypes.string,
  }),
};

const defaultProps = {
  chapter: null,
};

class ReadChapter extends React.Component {
  constructor(props) {
    super(props);

    const { chapter } = props;

    let htmlContent = '';
    if (chapter) {
      htmlContent = chapter.htmlContent;
    }

    this.state = {
      chapter,
      htmlContent,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.chapter && prevProps.chapter._id !== this.props.chapter._id) {
      const { htmlContent } = prevProps.chapter;

      // eslint-disable-next-line
      this.setState({ chapter: this.props.chapter, htmlContent });
    }
  }

  static async getInitialProps(ctx) {
    const { bookSlug, chapterSlug } = ctx.query;
    const { req } = ctx;

    const headers = {};
    if (req && req.headers && req.headers.cookie) {
      headers.cookie = req.headers.cookie;
    }

    const chapter = await getChapterDetailApiMethod({ bookSlug, chapterSlug }, { headers });

    return { chapter };
  }

  renderMainContent() {
    const { chapter, htmlContent } = this.state;

    return (
      <div>
        <h2>
          Chapter:
          {chapter.title}
        </h2>

        <div
          className="main-content"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    );
  }

  render() {
    const { chapter } = this.state;

    if (!chapter) {
      return <Error statusCode={404} />;
    }

    return (
      <div>
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

        <div
          style={{
            textAlign: 'left',
            padding: '0px 10px 20px 30px',
            position: 'fixed',
            right: 0,
            bottom: 0,
            top: '64px',
            left: '320px',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <div
            style={{
              position: 'fixed',
              top: '80px',
              left: '15px',
            }}
          />
          {this.renderMainContent()}
        </div>
      </div>
    );
  }
}

ReadChapter.propTypes = propTypes;
ReadChapter.defaultProps = defaultProps;

export default withAuth(ReadChapter, { loginRequired: false });
