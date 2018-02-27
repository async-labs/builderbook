import publicApi from './public';
import userApi from './customer';
import adminApi from './admin';

export default function api(server) {
  server.use('/api/v1/public', publicApi);
  server.use('/api/v1/user', userApi);
  server.use('/api/v1/admin', adminApi);
}
