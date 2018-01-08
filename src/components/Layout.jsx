import React from 'react';
import { Nav, Footer } from 'components';

const Layout = (props) => {
  const { children } = props;
  return (
    <div>
      <Nav />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
