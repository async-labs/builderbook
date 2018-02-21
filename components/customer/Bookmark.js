import React from 'react';
import PropTypes from 'prop-types';
import BookmarkIcon from 'material-ui-icons/Bookmark';
import NProgress from 'nprogress';
import Menu, { MenuItem } from 'material-ui/Menu';

import notify from '../../lib/notifier';
import { addBookmark } from '../../lib/api/customer';

export default class Bookmark extends React.Component {
  static propTypes = {
    chapter: PropTypes.shape({
      _id: PropTypes.string.isRequired,
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

  addBookmark = () => {
    this.setState({ anchorEl: null });

    const { chapter, activeSection } = this.props;

    if (!activeSection) {
      notify('Make sure the section you want to bookmark is highlighted.');
      return;
    }

    NProgress.start();

    addBookmark(Object.assign({ chapterId: chapter._id }, activeSection))
      .then(() => {
        NProgress.done();
        notify(`Success. You created a bookmark for Chapter ${chapter.order - 1}, Section "${
          activeSection.text
        }"`);

        this.props.changeBookmark(activeSection);
      })
      .catch((err) => {
        NProgress.done();
        notify(err);
      });
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
        <BookmarkIcon
          onClick={this.handleClick}
          color="action"
          aria-owns={anchorEl ? 'simple-menu' : null}
          aria-haspopup="true"
          style={{
            opacity: '0.5',
            fontSize: '24',
            cursor: 'pointer',
          }}
        />
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
