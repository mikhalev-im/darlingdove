import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as api from '../shared/utils/api';
import Layout from '../shared/components/layout';
import renderBlock from '../shared/components/page-blocks';

class Home extends Component {
  static async getInitialProps() {
    const { blocks } = await api.getHomePage();
    return { blocks };
  }

  render() {
    const { blocks } = this.props;

    return <Layout>{blocks.map(renderBlock)}</Layout>;
  }
}

Home.propTypes = {
  blocks: PropTypes.array.isRequired
};

export default Home;
