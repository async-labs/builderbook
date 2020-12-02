import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Menu from '@material-ui/core/Menu';
import Avatar from '@material-ui/core/Avatar';

const propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(String).isRequired,
};

class MenuDrop extends React.Component {
  button = undefined;

  constructor() {
    super();
  
    this.state = {
      open: false,
      anchorEl: undefined,
    };
  }


  handleClick = (event) => {
    this.setState({ open: true, anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { options, src, alt } = this.props;

    return (
      <div>
        <Avatar
          role="presentation"
          aria-owns="simple-menu"
          onClick={this.handleClick}
          onKeyPress={this.handleClick}
          src={src}
          alt={alt}
          style={{ margin: '0px 20px 0px auto', cursor: 'pointer' }}
        />
        <Menu
          id="simple-menu"
          anchorEl={this.state.anchorEl}
    
          onClose={this.handleClose}
        >
          <p />
          {options.map((option) => (
            <div id="wrappingLink" key={option.text}>
              <Link href={option.href} as={option.as || option.href}>
                <a style={{ padding: '0px 20px' }}>{option.text}</a>
              </Link>
              <p />
            </div>
          ))}
        </Menu>
      </div>
    );
  }
}

MenuDrop.propTypes = propTypes;

export default MenuDrop;
