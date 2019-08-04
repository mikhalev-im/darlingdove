import React from 'react';
import PropTypes from 'prop-types';

const style = {
  paddingBottom: '20px'
};

const Wrapper = ({ children }) => {
  return <div style={style}>{children}</div>;
};

Wrapper.propTypes = {
  children: PropTypes.node
};

export default Wrapper;
