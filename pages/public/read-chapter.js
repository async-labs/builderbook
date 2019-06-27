import React from 'react';
import PropTypes from 'prop-types';
import Error from 'next/error';
import Head from 'next/head';
import { withRouter } from 'next/router';
import throttle from 'lodash/throttle';

import Link from 'next/link';

import Header from '../../components/Header';
import BuyButton from '../../components/customer/BuyButton';
import Bookmark from '../../components/customer/Bookmark';

import { getChapterDetail } from '../../lib/api/public';
import withAuth from '../../lib/withAuth';

const styleIcon = {
  opacity: '0.75',
  fontSize: '24px',
  cursor: 'pointer',
};

class ReadChapter extends React.Component {
  static propTypes = {
    chapter: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      isPurchased: PropTypes.bool.isRequired,
      isFree: PropTypes.bool.isRequired,
      htmlContent: PropTypes.string,
      htmlExcerpt: PropTypes.string,
    }),
    user: PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }),
    router: PropTypes.shape({
      asPath: PropTypes.string.isRequired,
    }).isRequired,
    showStripeModal: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    chapter: null,
    user: null,
  };

  static async getInitialProps({ req, query }) {
    const { bookSlug, chapterSlug } = query;

    const headers = {};
    if (req && req.headers && req.headers.cookie) {
      headers.cookie = req.headers.cookie;
    }

    const chapter = await getChapterDetail({ bookSlug, chapterSlug }, { headers });

    const showStripeModal = req ? !!req.query.buy : window.location.search.includes('buy=1');

    return { chapter, showStripeModal };
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
      showTOC: false,
      chapter,
      htmlContent,
      isMobile: false,
      hideHeader: false,
      darkTheme: true,
    };
  }

  componentDidMount() {
    document.getElementById('main-content').addEventListener('scroll', this.onScroll);

    const isMobile = window.innerWidth < 768;

    if (this.state.isMobile !== isMobile) {
      this.setState({ isMobile }); // eslint-disable-line
    }

    if (typeof localStorage !== 'undefined') {
      if (localStorage.getItem('darkTheme') === 'true') {
        this.loadDarkTheme();
        this.setState({ darkTheme: true });
      } else if (localStorage.getItem('darkTheme') === 'false') {
        this.loadLightTheme();
        this.setState({ darkTheme: false });
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { chapter } = nextProps;

    if (chapter && chapter._id !== this.props.chapter._id) {
      document.getElementById('chapter-content').scrollIntoView();

      let htmlContent;

      if (chapter.isPurchased || chapter.isFree) {
        htmlContent = chapter.htmlContent;
      } else {
        htmlContent = chapter.htmlExcerpt;
      }

      this.setState({ chapter, htmlContent });
    }
  }

  componentWillUnmount() {
    document.getElementById('main-content').removeEventListener('scroll', this.onScroll);
  }

  onScroll = throttle(() => {
    this.onScrollActiveSection();
    this.onScrollHideHeader();
  }, 500);

  onScrollActiveSection = () => {
    const sectionElms = document.querySelectorAll('span.section-anchor');
    let activeSection;

    let aboveSection;
    for (let i = 0; i < sectionElms.length; i += 1) {
      const s = sectionElms[i];
      const b = s.getBoundingClientRect();
      const anchorBottom = b.bottom;

      if (anchorBottom >= 0 && anchorBottom <= window.innerHeight) {
        activeSection = {
          text: s.textContent.replace(/\n/g, '').trim(),
          hash: s.attributes.getNamedItem('name').value,
        };

        break;
      }

      if (anchorBottom > window.innerHeight && i > 0) {
        if (aboveSection.bottom <= 0) {
          activeSection = {
            text: sectionElms[i - 1].textContent.replace(/\n/g, '').trim(),
            hash: sectionElms[i - 1].attributes.getNamedItem('name').value,
          };
          break;
        }
      } else if (i + 1 === sectionElms.length) {
        activeSection = {
          text: s.textContent.replace(/\n/g, '').trim(),
          hash: s.attributes.getNamedItem('name').value,
        };
      }

      aboveSection = b;
    }

    if (this.state.activeSection !== activeSection) {
      this.setState({ activeSection });
    }
  };

  onScrollHideHeader = () => {
    const distanceFromTop = document.getElementById('main-content').scrollTop;
    const hideHeader = distanceFromTop > 500;

    if (this.state.hideHeader !== hideHeader) {
      this.setState({ hideHeader });
    }
  };

  toggleChapterList = () => {
    this.setState({ showTOC: !this.state.showTOC });
  };

  changeBookmark = (bookmark) => {
    const { chapter } = this.state;

    this.setState({
      chapter: Object.assign({}, chapter, { bookmark }),
    });
  };

  changeThemeType = () => {
    const { darkTheme } = this.state;

    if (darkTheme === true) {
      this.loadLightTheme();
      localStorage.setItem('darkTheme', false);
      this.setState({ darkTheme: false });
    } else if (darkTheme === false) {
      this.loadDarkTheme();
      localStorage.setItem('darkTheme', true);
      this.setState({ darkTheme: true });
    }
  };

  loadLightTheme = () => {
    const $ = document.querySelectorAll.bind(document);

    const changeColors = (color, background) => (e) => {
      e.style.backgroundColor = background;
      e.style.color = color;
    };

    const elements = [
      $('body'),
      $('ol li a'),
      $('h1'),
      $('h2'),
      $('h3'),
      $('h4'),
      $('h5'),
      $('h6'),
      $('i.material-icons'),
      $('p code'),
      $('#__next div'),
    ];

    const black = 'black';
    const white = 'white';
    const blue = '#2289d1';

    elements.forEach((e) => e.forEach(changeColors(black, white)));
    $('p a').forEach(changeColors(blue, white));
  };

  loadDarkTheme = () => {
    const $ = document.querySelectorAll.bind(document);

    const changeColors = (color, background) => (e) => {
      e.style.backgroundColor = background;
      e.style.color = color;
    };

    const elements = [
      $('body'),
      $('ol li a'),
      $('h1'),
      $('h2'),
      $('h3'),
      $('h4'),
      $('h5'),
      $('h6'),
      $('i.material-icons'),
      $('p code'),
      $('#__next div'),
    ];

    const black = 'black';
    const white = 'white';

    elements.forEach((e) => e.forEach(changeColors(white, black)));
    $('p a').forEach(changeColors(white, black));
  };

  closeTocWhenMobile = () => {
    const { isMobile } = this.state;
    this.setState({ showTOC: !isMobile });
  };

  renderMainContent() {
    const { user, showStripeModal } = this.props;
    const { chapter, htmlContent, isMobile, showTOC } = this.state;

    let padding = '20px 20%';
    if (!isMobile && showTOC) {
      padding = '20px 10%';
    } else if (isMobile) {
      padding = '0px 10px';
    }

    return (
      <div style={{ padding }} id="chapter-content">
        <h2 style={{ fontWeight: '400', lineHeight: '1.5em' }}>
          {chapter.order > 1 ? `Chapter ${chapter.order - 1}: ` : null}
          {chapter.title}
        </h2>
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
        {!chapter.isPurchased && !chapter.isFree ? (
          <BuyButton user={user} book={chapter.book} showModal={showStripeModal} />
        ) : null}
      </div>
    );
  }

  renderSections() {
    const { chapter } = this.state;
    const { sections } = chapter;
    const { activeSection } = this.state;

    if (!sections || !sections.length === 0) {
      return null;
    }

    return (
      <ul>
        {sections.map((s) => (
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
    const { showTOC, chapter, hideHeader, isMobile } = this.state;

    if (!showTOC) {
      return null;
    }

    const { book } = chapter;
    const { chapters } = book;

    return (
      <div
        style={{
          textAlign: 'left',
          position: 'absolute',
          bottom: 0,
          top: hideHeader ? 0 : '64px',
          transition: 'top 0.5s ease-in',
          left: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          width: isMobile ? '100%' : '400px',
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
    const { user, router } = this.props;

    const { chapter, showTOC, isMobile, hideHeader, darkTheme, activeSection } = this.state;

    if (!chapter) {
      return <Error statusCode={404} />;
    }

    const { book, bookmark } = chapter;

    let left = '20px';
    if (showTOC) {
      left = isMobile ? '100%' : '400px';
    }

    return (
      <div style={{ overflowScrolling: 'touch', WebkitOverflowScrolling: 'touch' }}>
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

        <Header user={user} hideHeader={hideHeader} next={router.asPath} />

        {this.renderSidebar()}

        <div
          style={{
            textAlign: 'left',
            padding: '0px 10px 20px 30px',
            position: 'fixed',
            right: 0,
            bottom: 0,
            top: hideHeader ? 0 : '64px',
            transition: 'top 0.5s ease-in',
            left,
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
          id="main-content"
        >
          {this.renderMainContent()}
        </div>

        <div
          style={{
            position: 'fixed',
            top: hideHeader ? '20px' : '80px',
            transition: 'top 0.5s ease-in',
            left: '15px',
          }}
        >
          <i //eslint-disable-line
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
                <i className="material-icons" style={styleIcon}>
                  help_outline
                </i>
              </a>
            </div>
          ) : null}

          {chapter.isPurchased && !chapter.isFree ? (
            <Bookmark
              chapter={chapter}
              bookmark={bookmark}
              changeBookmark={this.changeBookmark}
              activeSection={activeSection}
            />
          ) : null}
          <div>
            {darkTheme ? (
              <i
                className="material-icons"
                style={{ opacity: '0.75', fontSize: '24px', cursor: 'pointer', color: 'white' }}
                onClick={this.changeThemeType}
                onKeyPress={this.changeThemeType}
                role="none"
              >
                lens
              </i>
            ) : (
              <i
                className="material-icons"
                style={{ opacity: '0.75', fontSize: '24px', cursor: 'pointer', color: 'black' }}
                onClick={this.changeThemeType}
                onKeyPress={this.changeThemeType}
                role="none"
              >
                lens
              </i>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withAuth(withRouter(ReadChapter), {
  loginRequired: false,
});
