import React, { useState, useEffect, useRef } from 'react';

import PropTypes from 'prop-types';
import Error from 'next/error';
import Head from 'next/head';
import { withRouter } from 'next/router';
import throttle from 'lodash/throttle';

import Link from 'next/link';

import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

import Header from '../../components/Header';
import BuyButton from '../../components/customer/BuyButton';

import { getChapterDetailApiMethod } from '../../lib/api/public';
import withAuth from '../../lib/withAuth';
import notify from '../../lib/notify';

const styleIcon = {
  opacity: '0.75',
  fontSize: '24px',
  cursor: 'pointer',
};

function ReadChapterFunctional({
  chapter,
  user,
  router,
  redirectToCheckout,
  checkoutCanceled,
  error,
}) {
  const [showTOC, setShowTOC] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [chapterInsideState, setChapterInsideState] = useState(chapter);
  const [htmlContent, setHtmlContent] = useState(
    chapter && (chapter.isPurchased || chapter.isFree) ? chapter.htmlContent : chapter.htmlExcerpt,
  );
  const [activeSection, setActiveSection] = useState(null);

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  const prevChapter = usePrevious(chapter);
  const prevIsMobile = usePrevious(isMobile);

  const mounted = useRef();

  const onScrollActiveSection = () => {
    const sectionElms = document.querySelectorAll('span.section-anchor');
    let activeSectionCurrent;

    let aboveSection;
    for (let i = 0; i < sectionElms.length; i += 1) {
      const s = sectionElms[i];
      const b = s.getBoundingClientRect();
      const anchorBottom = b.bottom;

      if (anchorBottom >= 0 && anchorBottom <= window.innerHeight) {
        activeSectionCurrent = {
          hash: s.attributes.getNamedItem('name').value,
        };

        break;
      }

      if (anchorBottom > window.innerHeight && i > 0) {
        if (aboveSection.bottom <= 0) {
          activeSectionCurrent = {
            hash: sectionElms[i - 1].attributes.getNamedItem('name').value,
          };
          break;
        }
      } else if (i + 1 === sectionElms.length) {
        activeSectionCurrent = {
          hash: s.attributes.getNamedItem('name').value,
        };
      }

      aboveSection = b;
    }

    if (activeSection !== activeSectionCurrent) {
      setActiveSection(activeSectionCurrent);
    }
  };

  const onScrollHideHeader = () => {
    const distanceFromTop = document.getElementById('main-content').scrollTop;
    const hideHeaderCurrent = distanceFromTop > 500;

    // console.log('setHideHeader1', distanceFromTop, hideHeaderCurrent);

    // if (hideHeader !== hideHeaderCurrent) {
    //   console.log('setHideHeader2', hideHeader, hideHeaderCurrent);
    //   setHideHeader(hideHeaderCurrent);
    // }

    setHideHeader(hideHeaderCurrent);
  };

  const onScroll = throttle(() => {
    onScrollActiveSection();
    onScrollHideHeader();
  }, 500);

  useEffect(() => {
    if (!mounted.current) {
      document.getElementById('main-content').addEventListener('scroll', onScroll);

      const isMobileCurrent = window.innerWidth < 768;

      if (prevIsMobile !== isMobileCurrent) {
        setIsMobile(isMobileCurrent);
      }

      if (checkoutCanceled) {
        notify('Checkout canceled');
      }

      if (error) {
        notify(error);
      }

      mounted.current = true;
    } else {
      document.getElementById('chapter-content').scrollIntoView();
      let htmlContentCurrent = '';
      if (prevChapter && (prevChapter.isPurchased || prevChapter.isFree)) {
        htmlContentCurrent = chapter.htmlContent;
      } else {
        htmlContentCurrent = chapter.htmlExcerpt;
      }

      setChapterInsideState(chapter);
      setHtmlContent(htmlContentCurrent);
    }

    return () => {
      if (document.getElementById('main-content')) {
        document.getElementById('main-content').removeEventListener('scroll', onScroll);
      }
    };
  }, [chapter._id]);

  // useEffect(() => {
  //   return () => {
  //     document.getElementById('main-content').removeEventListener('scroll', onScroll);
  //   };
  // }, []);

  const toggleChapterList = () => {
    setShowTOC((prevState) => ({ showTOC: !prevState.showTOC }));
  };

  const closeTocWhenMobile = () => {
    setShowTOC((prevState) => ({ showTOC: !prevState.isMobile }));
  };

  const renderMainContent = () => {
    const { book } = chapterInsideState;

    let padding = '20px 20%';
    if (!isMobile && showTOC) {
      padding = '20px 10%';
    } else if (isMobile) {
      padding = '0px 10px';
    }

    return (
      <div style={{ padding }} id="chapter-content">
        <h2 style={{ fontWeight: '400', lineHeight: '1.5em' }}>
          {chapterInsideState.order > 1 ? `Chapter ${chapterInsideState.order - 1}: ` : null}
          {chapterInsideState.title}
        </h2>
        {!chapterInsideState.isPurchased && !chapterInsideState.isFree ? (
          <BuyButton user={user} book={book} redirectToCheckout={redirectToCheckout} />
        ) : null}
        <div
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
        {!chapterInsideState.isPurchased && !chapterInsideState.isFree ? (
          <BuyButton user={user} book={book} redirectToCheckout={redirectToCheckout} />
        ) : null}
      </div>
    );
  };

  const renderSections = () => {
    const { sections } = chapterInsideState;

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
              onClick={closeTocWhenMobile}
            >
              {s.text}
            </a>
          </li>
        ))}
      </ul>
    );
  };

  const renderSidebar = () => {
    if (!showTOC) {
      return null;
    }

    const { book } = chapterInsideState;
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
        <ol start="0" style={{ padding: '0 25', fontSize: '14px' }}>
          {chapters.map((ch, i) => (
            <li
              key={ch._id}
              role="presentation"
              style={{ listStyle: i === 0 ? 'none' : 'decimal', paddingBottom: '10px' }}
            >
              <Link
                as={`/books/${book.slug}/${ch.slug}`}
                href={`/public/read-chapter?bookSlug=${book.slug}&chapterSlug=${ch.slug}`}
              >
                <a // eslint-disable-line
                  style={{ color: chapterInsideState._id === ch._id ? '#1565C0' : '#222' }}
                  onClick={closeTocWhenMobile}
                >
                  {ch.title}
                </a>
              </Link>
              {chapterInsideState._id === ch._id ? renderSections() : null}
            </li>
          ))}
        </ol>
      </div>
    );
  };

  if (!chapterInsideState) {
    return <Error statusCode={404} />;
  }

  let left = '20px';
  if (showTOC) {
    left = isMobile ? '100%' : '400px';
  }

  return (
    <div style={{ overflowScrolling: 'touch', WebkitOverflowScrolling: 'touch' }}>
      <Head>
        <title>
          {chapterInsideState.title === 'Introduction'
            ? 'Introduction'
            : `Chapter ${chapterInsideState.order - 1}. ${chapterInsideState.title}`}
        </title>
        {chapterInsideState.seoDescription ? (
          <meta name="description" content={chapterInsideState.seoDescription} />
        ) : null}
      </Head>

      <Header user={user} hideHeader={hideHeader} redirectUrl={router.asPath} />

      {renderSidebar()}

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
          fontFamily: 'Roboto, sans-serif',
        }}
        id="main-content"
      >
        {renderMainContent()}
      </div>

      <div
        style={{
          position: 'fixed',
          top: hideHeader ? '20px' : '80px',
          transition: 'top 0.5s ease-in',
          left: '15px',
        }}
      >
        <FormatListBulletedIcon
          style={styleIcon}
          onClick={toggleChapterList}
          onKeyPress={toggleChapterList}
        />
      </div>
    </div>
  );
}

const propTypes = {
  chapter: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    isPurchased: PropTypes.bool,
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
  redirectToCheckout: PropTypes.bool.isRequired,
  checkoutCanceled: PropTypes.bool,
  error: PropTypes.string,
};

const defaultProps = {
  chapter: null,
  user: null,
  checkoutCanceled: false,
  error: '',
};

ReadChapterFunctional.propTypes = propTypes;
ReadChapterFunctional.defaultProps = defaultProps;

ReadChapterFunctional.getInitialProps = async (ctx) => {
  const { bookSlug, chapterSlug, buy, checkout_canceled, error } = ctx.query;
  const { req } = ctx;

  const headers = {};
  if (req && req.headers && req.headers.cookie) {
    headers.cookie = req.headers.cookie;
  }

  const chapter = await getChapterDetailApiMethod({ bookSlug, chapterSlug }, { headers });
  const redirectToCheckout = !!buy;

  return { chapter, redirectToCheckout, checkoutCanceled: !!checkout_canceled, error };
};

export default withAuth(withRouter(ReadChapterFunctional), {
  loginRequired: false,
});
