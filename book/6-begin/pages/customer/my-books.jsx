import React from 'react';

import withAuth from '../../lib/withAuth';

const MyBooks = () => (
  <div style={{ padding: '10px 45px' }}>
    <h3>Your books</h3>
  </div>
);

export default withAuth(MyBooks);
