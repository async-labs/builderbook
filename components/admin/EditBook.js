import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import { getGithubRepos } from '../../lib/api/admin';
import { styleTextField } from '../../lib/SharedStyles';
import notify from '../../lib/notifier';

class EditBook extends React.Component {
  static propTypes = {
    book: PropTypes.shape({
      _id: PropTypes.string.isRequired,
    }),
    onSave: PropTypes.func.isRequired,
  };

  static defaultProps = {
    book: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      book: props.book || {},
      repos: [],
    };
  }

  async componentDidMount() {
    try {
      const { repos } = await getGithubRepos();
      this.setState({ repos }); // eslint-disable-line
    } catch (err) {
      console.log(err); // eslint-disable-line
    }
  }

  onSubmit = (event) => {
    event.preventDefault();
    const { onSave } = this.props;
    const { book } = this.state;
    const { name, price, githubRepo } = book;

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

    onSave(book);
  };

  render() {
    const { book, repos } = this.state;
    return (
      <div style={{ padding: '10px 45px' }}>
        <br />
        <form onSubmit={this.onSubmit}>
          <TextField
            onChange={(event) => {
              this.setState({
                book: Object.assign({}, book, { price: Number(event.target.value) }),
              });
            }}
            value={book.price || ''}
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
            <TextField
              onChange={(event) => {
                this.setState({
                  book: Object.assign({}, book, { name: event.target.value }),
                });
              }}
              value={book.name || ''}
              type="text"
              label="Book's title"
              style={styleTextField}
              required
            />
          </div>
          <br />
          <div>
            <span>Github repo: </span>
            <Select
              value={book.githubRepo || ''}
              input={<Input />}
              onChange={(event) => {
                this.setState({
                  book: Object.assign({}, book, { githubRepo: event.target.value }),
                });
              }}
            >
              <MenuItem value="">
                <em>-- choose github repo --</em>
              </MenuItem>
              {repos.map((r) => (
                <MenuItem value={r.full_name} key={r.id}>
                  {r.full_name}
                </MenuItem>
              ))}
            </Select>
          </div>
          <br />

          <TextField
            onChange={(event) => {
              this.setState({
                book: Object.assign({}, book, {
                  supportURL: event.target.value,
                }),
              });
            }}
            value={book.supportURL || ''}
            label="Support URL"
            className="textFieldInput"
            style={styleTextField}
          />
          <br />
          <br />

          <TextField
            onChange={(event) => {
              this.setState({
                book: Object.assign({}, book, {
                  textNearButton: event.target.value,
                }),
              });
            }}
            value={book.textNearButton || ''}
            label="Text next to Buy Button"
            className="textFieldInput"
            style={styleTextField}
          />
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

export default EditBook;
