import React from 'react';
import PropTypes from 'prop-types';
import Menu from '@material-ui/core/Menu';
import Avatar from '@material-ui/core/Avatar';

class MenuDrop extends React.Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(String).isRequired,
  };

  state = {
    open: false,
    anchorEl: undefined,
  };

  button = undefined;

  handleClick = (event) => {
    this.setState({ open: true, anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { options, src, alt } = this.props;

    return (
      <div style={{ whiteSpace: 'nowrap' }}>
        <Avatar
          role="presentation"
          aria-owns="simple-menu"
          aria-haspopup="true"
          onClick={this.handleClick}
          onKeyPress={this.handleClick}
          src={src}
          alt={alt}
          style={{ margin: '0px 20px 0px auto', cursor: 'pointer' }}
        />
        <Menu
          style={{ padding: '0px 20px' }}
          id="simple-menu"
          anchorEl={this.state.anchorEl}
          open={this.state.open}
          onClose={this.handleClose}
        >
          <p />
          {options.map(option => (
            <div id="wrappingLink" key={option.text}>
              <a
                href={option.url}
                onClick={this.handleClose}
                target={option.target}
                rel={option.rel}
                style={{ padding: '0px 20px' }}
              >
                {option.text}
              </a>
              <p />
            </div>
          ))}
        </Menu>
      </div>
    );
  }
}

export default MenuDrop;
