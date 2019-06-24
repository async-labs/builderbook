import { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';

import { searchUser, giveFreeBook } from '../../lib/api/admin';
import notify from '../../lib/notifier';

class GiveFreeBook extends Component {
  static propTypes = {
    books: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
      }),
    ),
  };

  static defaultProps = {
    books: [],
  };

  state = {
    searchValue: '',
    users: [],
  };

  searchUser = async (event) => {
    event.preventDefault();
    const { searchValue } = this.state;

    if (!searchValue) {
      return;
    }

    try {
      const { users } = await searchUser(searchValue);
      this.setState({ users });
    } catch (err) {
      notify(err);
    }
  };

  renderUser(user) {
    const { books } = this.props;

    const purchasedBooks =
      (user.purchasedBookIds && books.filter((b) => user.purchasedBookIds.includes(b._id))) || [];

    const freeBooks =
      (user.freeBookIds && books.filter((b) => user.freeBookIds.includes(b._id))) || [];

    const userBookIds = purchasedBooks.map((b) => b._id).concat(freeBooks.map((b) => b._id));

    return (
      <div>
        <Paper style={{ padding: '2px 8px' }}>
          <b>{user.displayName}</b>
          <p>Purchased books: {purchasedBooks.map(b => b.name).join(', ')}</p>
          <p>Free books: {freeBooks.map(b => b.name).join(', ')}</p>
        </Paper>
        <br />
        <select
          value={this.state[user._id] || ''}
          onChange={(event) => {
            this.setState({ [user._id]: event.target.value });
          }}
        >
          <option value="">- select book -</option>
          {books
            .filter((b) => !userBookIds.includes(b._id))
            .map((book) => (
              <option value={book._id} key={book._id}>
                {book.name}
              </option>
          ))}
        </select>
        <br />
        <br />
        <Button
          variant="contained"
          onClick={async (event) => {
            event.preventDefault();

            try {
              await giveFreeBook({ userId: user._id, bookId: this.state[user._id] });
              notify('Done');
              this.setState({ [user._id]: '' });
            } catch (err) {
              notify(err);
            }
          }}
        >
          Give free book
        </Button>
        <br />
        <br />
      </div>
    );
  }

  render() {
    const { users = [] } = this.state;

    return (
      <div>
        <h2>Give free book</h2>

        <form onSubmit={this.searchUser}>
          <TextField
            label="Search user by email"
            onChange={(event) => {
              this.setState({ searchValue: event.target.value });
            }}
          />
        </form>
        <br />
        <br />
        <div>{users.map((user) => this.renderUser(user))}</div>
        <br />
        <br />
        <br />
      </div>
    );
  }
}

export default GiveFreeBook;
