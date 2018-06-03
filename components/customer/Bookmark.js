import React from 'react';
import PropTypes from 'prop-types';
import NProgress from 'nprogress';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import notify from '../../lib/notifier';
import { addBookmark } from '../../lib/api/customer';

export default class Bookmark extends React.PureComponent {
  static propTypes = {
    chapter: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
    }).isRequired,
    bookmark: PropTypes.shape({
      hash: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }),
    activeSection: PropTypes.shape({
      hash: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }),
    changeBookmark: PropTypes.func.isRequired,
  };

  static defaultProps = {
    bookmark: null,
    activeSection: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
    };
  }

  addBookmark = async () => {
    this.setState({ anchorEl: null });

    const { chapter, activeSection } = this.props;

    if (!activeSection) {
      notify('To bookmark a new section, scroll to that section.');
      return;
    }

    NProgress.start();

    try {
      await addBookmark(Object.assign({ chapterId: chapter._id, chapterSlug: chapter.slug, chapterOrder: chapter.order }, activeSection));
      NProgress.done();
      notify(`You successfully bookmarked Chapter ${chapter.order - 1}, Section "${
        activeSection.text
      }".`);
      this.props.changeBookmark(activeSection);
    } catch (err) {
      NProgress.done();
      notify(err);
    }
  };

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;
    const { bookmark, activeSection } = this.props;

    return (
      <div>
        <i // eslint-disable-line
          className="material-icons"
          onClick={this.handleClick}
          onKeyPress={this.handleClick}
          aria-owns={anchorEl ? 'simple-menu' : null}
          aria-haspopup="true"
          style={{
            opacity: '0.75',
            fontSize: '24px',
            cursor: 'pointer',
          }}
          role="button"
        >
          bookmark_border
        </i>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          {bookmark ? (
            <a href={`#${bookmark.hash}`}>
              <MenuItem onClick={this.handleClose}>
                Go to section &quot;{bookmark.text}&quot;
              </MenuItem>
            </a>
          ) : null}
          {!bookmark ? (
            <MenuItem onClick={this.addBookmark}>
              {!activeSection
                ? 'To bookmark a new section, scroll to that section'
                : `Bookmark section "${activeSection.text}"`}
            </MenuItem>
          ) : (
            <MenuItem onClick={this.addBookmark}>
              {!activeSection
                ? 'To bookmark a new section, scroll to that section'
                : `Bookmark section "${activeSection.text}"`}
            </MenuItem>
          )}
        </Menu>
      </div>
    );
  }
}
