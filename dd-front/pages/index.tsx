import Page from '../modules/page';
import { MyPageContext } from '../modules/shared/interfaces/my-page-context';

interface HomeProps {
  readonly blocks: any[];
}

const Home = (props: HomeProps) => {
  return <Page {...props} />;
};

Home.getInitialProps = async ({ reduxStore, query, res }: MyPageContext) => {
  query.slug = 'home';
  return Page.getInitialProps({ reduxStore, query, res });
};

export default Home;
