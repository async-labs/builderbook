import publicApi from './public';

export default function api(server) {
  server.use('/api/v1/public', publicApi);
}
