import React from 'react';

import withAuth from '../../lib/withAuth';

const MyBooks = () => (
  <div style={{ padding: '10px 45px' }}>
    <h2>Your books</h2>
  </div>
);

export default withAuth(MyBooks);
