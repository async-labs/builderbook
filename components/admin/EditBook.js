import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Input from 'material-ui/Input';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import Checkbox from 'material-ui/Checkbox';
import { FormControlLabel } from 'material-ui/Form';

import { getGithubRepos } from '../../lib/api/admin';
import { styleTextField } from '../../components/SharedStyles';
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
          <TextField
            onChange={(event) => {
              this.setState({
                book: Object.assign({}, this.state.book, { price: Number(event.target.value) }),
              });
            }}
            value={this.state.book.price || ''}
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
                  book: Object.assign({}, this.state.book, { name: event.target.value }),
                });
              }}
              value={this.state.book.name || ''}
              type="text"
              label="Book's title"
              labelClassName="textFieldLabel"
              style={styleTextField}
              required
            />
          </div>
          <br />
          <div>
            <span>Github repo: </span>
            <Select
              value={this.state.book.githubRepo || ''}
              input={<Input />}
              onChange={(event) => {
                this.setState({
                  book: Object.assign({}, this.state.book, { githubRepo: event.target.value }),
                });
              }}
            >
              <MenuItem value="">
                <em>-- choose github repo --</em>
              </MenuItem>
              {this.state.repos.map(r => (
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
                book: Object.assign({}, this.state.book, {
                  supportURL: event.target.value,
                }),
              });
            }}
            value={this.state.book.supportURL || ''}
            label="Support URL"
            className="textFieldInput"
            style={styleTextField}
          />
          <br />
          <br />

          <TextField
            onChange={(event) => {
              this.setState({
                book: Object.assign({}, this.state.book, {
                  preorderPrice: Number(event.target.value),
                }),
              });
            }}
            value={this.state.book.preorderPrice || ''}
            type="number"
            label="Book's preorder price"
            className="textFieldInput"
            style={styleTextField}
            step="1"
          />
          <br />
          <FormControlLabel
            control={
              <Checkbox
                checked={this.state.book.isInPreorder}
                onChange={(event) => {
                  this.setState({
                    book: Object.assign({}, this.state.book, {
                      isInPreorder: event.target.checked,
                    }),
                  });
                }}
                value="on"
              />
            }
            label="Preorder"
          />
          <br />
          <Button variant="raised" type="submit">
            Save
          </Button>
        </form>
      </div>
    );
  }
}

export default EditBook;
