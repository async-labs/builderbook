import PropTypes from 'prop-types';
import marked from 'marked';

import Header from '../../components/HomeHeader';
import Footer from '../../components/HomeFooter';
import { getTOS } from '../../lib/api/public';
import withLayout from '../../lib/withLayout';
import withAuth from '../../lib/withAuth';

const Terms = ({ user, content }) => (
  <div>
    <Header user={user} />
    <div style={{ padding: '10px 45px' }}>
      <div dangerouslySetInnerHTML={{ __html: marked(content) }} />
    </div>
    <Footer />
  </div>
);

Terms.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }),
  content: PropTypes.string.isRequired,
};

Terms.defaultProps = {
  user: null,
};

Terms.getInitialProps = async () => {
  try {
    const { content = '' } = await getTOS();
    return { content };
  } catch (err) {
    return { content: 'error' };
  }
};

export default withAuth(withLayout(Terms, { noHeader: true }), { loginRequired: false });
