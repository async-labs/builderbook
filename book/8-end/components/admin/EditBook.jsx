import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { getGithubReposApiMethod } from '../../lib/api/admin';
import { styleTextField } from '../SharedStyles';
import notify from '../../lib/notifier';

const propTypes = {
  book: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }),
  onSave: PropTypes.func.isRequired,
};

const defaultProps = {
  book: null,
};

class EditBook extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      book: props.book || {},
      repos: [],
    };
  }

  async componentDidMount() {
    try {
      const { repos } = await getGithubReposApiMethod();
      this.setState({ repos }); // eslint-disable-line
    } catch (err) {
      console.log(err); // eslint-disable-line
    }
  }

  onSubmit = (event) => {
    event.preventDefault();
    const { name, price, githubRepo } = this.state.book;

    if (!name) {
      notify('Name is required');
      return;
    }

    if (!price) {
      notify('Price is required');
      return;
    }

    if (!githubRepo) {
      notify('Github repo is required');
      return;
    }

    this.props.onSave(this.state.book);
  };

  render() {
    return (
      <div style={{ padding: '10px 45px' }}>
        <form onSubmit={this.onSubmit}>
          <br />
          <div>
            <TextField
              onChange={(event) => {
                this.setState({
                  // eslint-disable-next-line
                  book: { ...this.state.book, name: event.target.value },
                });
              }}
              value={this.state.book.name}
              type="text"
              label="Book's title"
              style={styleTextField}
              required
            />
          </div>
          <br />
          <br />
          <TextField
            onChange={(event) => {
              this.setState({
                // eslint-disable-next-line
                book: { ...this.state.book, price: Number(event.target.value) },
              });
            }}
            value={this.state.book.price}
            type="number"
            label="Book's price"
            className="textFieldInput"
            style={styleTextField}
            step="1"
            required
          />
          <br />
          <br />
          <div>
            <span>Github repo: </span>
            <Select
              value={this.state.book.githubRepo || ''}
              input={<Input />}
              onChange={(event) => {
                this.setState({
                  // eslint-disable-next-line
                  book: { ...this.state.book, githubRepo: event.target.value },
                });
              }}
            >
              <MenuItem value="">
                <em>-- choose github repo --</em>
              </MenuItem>
              {this.state.repos.map((r) => (
                <MenuItem value={r.full_name} key={r.id}>
                  {r.full_name}
                </MenuItem>
              ))}
            </Select>
          </div>
          <br />
          <br />
          <Button variant="contained" type="submit">
            Save
          </Button>
        </form>
      </div>
    );
  }
}

EditBook.propTypes = propTypes;
EditBook.defaultProps = defaultProps;

export default EditBook;
