import Page from '../modules/page';

const Home = props => {
  return <Page {...props} />;
};

Home.getInitialProps = async ({ reduxStore, query }) => {
  query.slug = 'home';
  return Page.getInitialProps({ reduxStore, query });
};

export default Home;
