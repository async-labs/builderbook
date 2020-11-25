const publicApi = require('./public');
const customerApi = require('./customer');
const adminApi = require('./admin');

function api(server) {
  server.use('/api/v1/admin', adminApi);
  server.use('/api/v1/customer', customerApi);
  server.use('/api/v1/public', publicApi);
}

module.exports = api;
