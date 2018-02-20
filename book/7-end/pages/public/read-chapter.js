import React from 'react';
import PropTypes from 'prop-types';
import Error from 'next/error';
import Head from 'next/head';
import throttle from 'lodash/throttle';

import Link from 'next/link';

import { getChapterDetail } from '../../lib/api/public';
import withLayout from '../../lib/withLayout';
import withAuth from '../../lib/withAuth';

const styleIcon = {
  opacity: '0.5',
  fontSize: '24',
  cursor: 'pointer',
};

class ReadChapter extends React.Component {
  static propTypes = {
    chapter: PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }),
    user: PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }),
    hideHeader: PropTypes.bool,
  };

  static defaultProps = {
    chapter: null,
    user: null,
    hideHeader: false,
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

  constructor(props, ...args) {
    super(props, ...args);

    const { chapter } = props;
    let htmlContent = '';
    if (chapter && (chapter.isPurchased || chapter.isFree)) {
      htmlContent = chapter.htmlContent;
    } else {
      htmlContent = chapter.htmlExcerpt;
    }

    this.state = {
      showChapters: false,
      chapter,
      htmlContent,
      isMobile: false,
    };
  }

  componentDidMount() {
    this.mainContentElm.addEventListener('scroll', this.onScroll);

    let isMobile = false;
    if (window.innerWidth < 768) {
      isMobile = true;
    }

    this.setState({ isMobile }); // eslint-disable-line
  }

  componentWillReceiveProps(nextProps) {
    const { chapter } = nextProps;

    if (chapter && chapter._id !== this.props.chapter._id) {
      this.mainContent.scrollIntoView();

      let htmlContent;

      if (chapter.isPurchased || chapter.isFree) {
        htmlContent = chapter.htmlContent;
      } else {
        htmlContent = chapter.htmlExcerpt;
      }

      this.setState({ chapter: nextProps.chapter, htmlContent });
    }
  }

  componentWillUnmount() {
    this.mainContentElm.removeEventListener('scroll', this.onScroll);
  }

  onScroll = throttle(() => {
    const sectionElms = document.querySelectorAll('a.section-anchor');
    let activeSection;

    let preBound;
    for (let i = 0; i < sectionElms.length; i += 1) {
      const s = sectionElms[i];
      const b = s.getBoundingClientRect();

      const isInViewport = b.top >= 0 && b.bottom <= window.innerHeight;
      if (isInViewport) {
        activeSection = {
          text: s.textContent.replace(/\n/g, '').trim(),
          hash: s.attributes.getNamedItem('name').value,
        };

        break;
      }

      if (b.bottom > window.innerHeight && i > 0) {
        if (preBound.top <= 0) {
          activeSection = {
            text: sectionElms[i - 1].textContent.replace(/\n/g, '').trim(),
            hash: sectionElms[i - 1].attributes.getNamedItem('name').value,
          };
          break;
        }
      } else if (i + 1 === sectionElms.length) {
        // if it is last section, it is active anyway
        activeSection = {
          text: s.textContent.replace(/\n/g, '').trim(),
          hash: s.attributes.getNamedItem('name').value,
        };
      }

      preBound = b;
    }

    this.setState({ activeSection });
  }, 500);

  toggleChapterList = () => {
    this.setState({ showChapters: !this.state.showChapters });
  };

  closeTocWhenMobile = () => {
    this.setState({ showChapters: !this.state.isMobile });
  };

  renderMainContent() {
    const { user } = this.props;
    const {
      chapter,
      htmlContent,
      isMobile,
      showChapters,
    } = this.state;

    let padding = '20px 20%';
    if (!isMobile && showChapters) {
      padding = '20px 10%';
    } else if (isMobile) {
      padding = '0px 10px';
    }

    return (
      <div
        style={{ padding }}
        ref={(c) => {
          this.mainContent = c;
        }}
        id="chapter-content"
      >
        <h2 style={{ fontWeight: '400', lineHeight: '1.5em' }}>
          {chapter.order > 1 ? `Chapter ${chapter.order - 1}: ` : null}
          {chapter.title}
        </h2>
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    );
  }

  renderSections() {
    const { sections } = this.state.chapter;
    const { activeSection } = this.state;

    if (!sections || !sections.length === 0) {
      return null;
    }

    return (
      <ul>
        {sections.map(s => (
          <li key={s.escapedText} style={{ paddingTop: '10px' }}>
            <a
              style={{
                color: activeSection && activeSection.hash === s.escapedText ? '#1565C0' : '#222',
              }}
              href={`#${s.escapedText}`}
              onClick={this.closeTocWhenMobile}
            >
              {s.text}
            </a>
          </li>
        ))}
      </ul>
    );
  }

  renderSidebar() {
    const { showChapters, chapter, isMobile } = this.state;
    const { hideHeader } = this.props;

    if (!showChapters) {
      return null;
    }

    const { book, book: { chapters } } = chapter;

    return (
      <div
        style={{
          textAlign: 'left',
          position: 'fixed',
          bottom: 0,
          top: hideHeader ? '0px' : '64px',
          transition: 'top 0.5s ease-in',
          left: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          width: isMobile ? '100%' : '300px',
          padding: '0px 25px',
        }}
      >
        <p style={{ padding: '0px 40px', fontSize: '17px', fontWeight: '400' }}>{book.name}</p>
        <ol start="0" style={{ padding: '0 25', fontSize: '14px', fontWeight: '300' }}>
          {chapters.map((ch, i) => (
            <li
              key={ch._id}
              role="presentation"
              style={{ listStyle: i === 0 ? 'none' : 'decimal', paddingBottom: '10px' }}
              onClick={this.closeTocWhenMobile}
            >
              <Link
                prefetch
                as={`/books/${book.slug}/${ch.slug}`}
                href={`/public/read-chapter?bookSlug=${book.slug}&chapterSlug=${ch.slug}`}
              >
                <a style={{ color: chapter._id === ch._id ? '#1565C0' : '#222' }}>{ch.title}</a>
              </Link>
              {chapter._id === ch._id ? this.renderSections() : null}
            </li>
          ))}
        </ol>
      </div>
    );
  }

  render() {
    const { chapter, showChapters, isMobile } = this.state;
    const { hideHeader } = this.props;

    if (!chapter) {
      return <Error statusCode={404} />;
    }

    const { book } = chapter;

    let left = 20;
    if (showChapters) {
      left = isMobile ? '100%' : '320px';
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

        {this.renderSidebar()}

        <div
          style={{
            textAlign: 'left',
            padding: '0px 10px 20px 30px',
            position: 'fixed',
            right: 0,
            bottom: 0,
            top: hideHeader ? '0px' : '64px',
            transition: 'top 0.5s ease-in',
            left,
            overflowY: 'auto',
            overflowX: 'hidden',
            zIndex: '1000',
          }}
          ref={(elm) => {
            this.mainContentElm = elm;
          }}
          id="main-content"
        >
          <div
            style={{
              position: 'fixed',
              top: hideHeader ? '20px' : '80px',
              transition: 'top 0.5s ease-in',
              left: '15px',
            }}
          >
            <i // eslint-disable-line
              className="material-icons"
              style={styleIcon}
              onClick={this.toggleChapterList}
              onKeyPress={this.toggleChapterList}
              role="button"
            >
              format_list_bulleted
            </i>

            {book.supportURL ? (
              <div>
                <a
                  href={book.supportURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#222', opacity: '1' }}
                >
                  <i
                    className="material-icons"
                    style={{
                      opacity: '0.5',
                      fontSize: '24',
                      cursor: 'pointer',
                    }}
                  >
                    help_outline
                  </i>
                </a>
              </div>
            ) : null}
          </div>

          {this.renderMainContent()}
        </div>
      </div>
    );
  }
}

export default withAuth(withLayout(ReadChapter), { loginRequired: false });
