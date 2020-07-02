import React, { FunctionComponent } from 'react';

const style = {
  paddingBottom: '20px'
};

const Wrapper: FunctionComponent = ({ children }) => {
  return <div style={style}>{children}</div>;
};

export default Wrapper;
