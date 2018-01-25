import React from 'react';
import PropTypes from 'prop-types';
import Error from 'next/error';
import Head from 'next/head';
import HelpOutline from 'material-ui-icons/HelpOutline';
import FormatListBulleted from 'material-ui-icons/FormatListBulleted';
import throttle from 'lodash/throttle';

import Link from 'next/link';
import marked from 'marked';
import he from 'he';
import hljs from 'highlight.js';

import BuyButton from '../../components/customer/BuyButton';
import Bookmark from '../../components/customer/Bookmark';

import { getChapterDetail } from '../../lib/api/public';
import withLayout from '../../lib/withLayout';
import withAuth from '../../lib/withAuth';

const styleHyperlinkedIcon = {
  opacity: '1',
};

const styleIcon = {
  opacity: '0.5',
  fontSize: '24',
  cursor: 'pointer',
};

const renderer = new marked.Renderer();
renderer.link = (href, title, text) => {
  const t = title ? ` title="${title}"` : '';
  return `<a target="_blank" href="${href}" rel="noopener noreferrer"${t}>${text}</a>`;
};

renderer.image = href => `<img src="${href}" width="100%" alt="Builder Book">`;

renderer.heading = (text, level) => {
  if (level !== 2 && level !== 4) {
    return `<h${level}>${text}</h${level}>`;
  }

  const escapedText = text
    .trim()
    .toLowerCase()
    .replace(/[^\w]+/g, '-');

  if (level === 2) {
    return `<a name="${escapedText}" class="section-anchor"
      style="color: black;"
      href="#${escapedText}"
    >
      <h${level} class="chapter-section">
        ${text}
      </h${level}>
  </a>`;
  }

  return `<a name="${escapedText}" style="color: black;" href="#${escapedText}">
      <h${level}>
        ${text}
      </h${level}>
  </a>`;
};

marked.setOptions({
  renderer,
  breaks: true,
  highlight(code, lang) {
    if (!lang) {
      return hljs.highlightAuto(code).value;
    }

    return hljs.highlight(lang, code).value;
  },
});

class ReadChapter extends React.Component {
  static propTypes = {
    chapter: PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }),
    user: PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }),
    showStripeModal: PropTypes.bool.isRequired,
    hideHeader: PropTypes.bool,
  };

  static defaultProps = {
    user: null,
    chapter: null,
    hideHeader: false,
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
      htmlContent = marked(he.decode(chapter.content));
    } else {
      htmlContent = marked(he.decode(chapter.excerpt));
    }

    this.state = {
      showChapters: false,
      chapter,
      htmlContent,
    };
  }

  componentDidMount() {
    this.mainContentElm.addEventListener('scroll', this.onScroll);
  }

  componentWillReceiveProps(nextProps) {
    const { chapter } = nextProps;

    if (chapter && chapter._id !== this.props.chapter._id) {
      this.mainContent.scrollIntoView();

      let htmlContent;

      if (chapter.isPurchased || chapter.isFree) {
        htmlContent = marked(he.decode(chapter.content));
      } else {
        htmlContent = marked(he.decode(chapter.excerpt));
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

  changeBookmark = (bookmark) => {
    const { chapter } = this.state;

    this.setState({
      chapter: Object.assign({}, chapter, { bookmark }),
    });
  };

  renderMainContent() {
    const { user, showStripeModal } = this.props;
    const { chapter, htmlContent } = this.state;

    return (
      <div
        style={{ padding: '0px 8% 20px 6%' }}
        ref={(c) => {
          this.mainContent = c;
        }}
        id="chapter-content"
      >
        <h3>
          {chapter.order > 1 ? `Chapter ${chapter.order - 1}: ` : null}
          {chapter.title}
        </h3>
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
        {!chapter.isPurchased ? (
          <BuyButton user={user} book={chapter.book} showModal={showStripeModal} />
        ) : null}
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
                color: activeSection && activeSection.hash === s.escapedText ? 'blue' : 'black',
              }}
              href={`#${s.escapedText}`}
            >
              {he.decode(s.text)}
            </a>
          </li>
        ))}
      </ul>
    );
  }

  renderSidebar() {
    const { showChapters, chapter } = this.state;
    const { hideHeader } = this.props;

    if (!showChapters) {
      return null;
    }

    const { book, book: { chapters } } = chapter;

    return (
      <div
        style={{
          textAlign: 'left',
          position: 'absolute',
          bottom: 0,
          top: hideHeader ? 0 : '65px',
          left: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          width: window.innerWidth < 820 ? '100%' : '300px',
          padding: '0px 25px',
        }}
      >
        <p style={{ padding: '0px 40px', fontSize: '17px', fontWeight: '600' }}>{book.name}</p>
        <ol start="0" style={{ padding: '0 25', fontSize: '14px', fontWeight: '300' }}>
          {chapters.map((ch, i) => (
            <li
              key={ch._id}
              role="presentation"
              style={{ listStyle: i === 0 ? 'none' : 'decimal', paddingBottom: '10px' }}
            >
              <Link
                prefetch
                as={`/books/${book.slug}/${ch.slug}`}
                href={`/public/read-chapter?bookSlug=${book.slug}&chapterSlug=${ch.slug}`}
              >
                <a style={{ color: chapter._id === ch._id ? 'blue' : 'black' }}>{ch.title}</a>
              </Link>
              {chapter._id === ch._id ? this.renderSections() : null}
            </li>
          ))}
        </ol>
      </div>
    );
  }

  render() {
    const { chapter, showChapters } = this.state;
    const { hideHeader } = this.props;

    if (!chapter) {
      return <Error statusCode={404} />;
    }

    const { book, bookmark } = chapter;
    let left = 20;
    if (showChapters) {
      left = window.innerWidth < 600 ? '100%' : '320px';
    }

    return (
      <div style={{ padding: '10px 45px' }}>
        <Head>
          <title>{chapter.seoTitle || chapter.title}</title>
          {chapter.seoDescription ? (
            <meta name="description" content={chapter.seoDescription} />
          ) : null}
        </Head>

        <div>
          {this.renderSidebar()}

          <div
            style={{
              textAlign: 'left',
              padding: '0px 10px 20px 30px',
              position: 'fixed',
              right: 0,
              bottom: 0,
              top: hideHeader ? 0 : '65px',
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
                left: '15px',
              }}
            >
              <FormatListBulleted
                color="action"
                style={styleIcon}
                onClick={this.toggleChapterList}
              />

              {book.supportURL ? (
                <div>
                  <a
                    href={book.supportURL}
                    style={styleHyperlinkedIcon}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <HelpOutline color="action" style={styleIcon} />
                  </a>
                </div>
              ) : null}

              {chapter.isPurchased ? (
                <Bookmark
                  chapter={chapter}
                  bookmark={bookmark}
                  changeBookmark={this.changeBookmark}
                  activeSection={this.state.activeSection}
                />
              ) : null}
            </div>

            {this.renderMainContent()}
          </div>
        </div>
      </div>
    );
  }
}

export default withAuth(withLayout(ReadChapter), { loginRequired: false });
