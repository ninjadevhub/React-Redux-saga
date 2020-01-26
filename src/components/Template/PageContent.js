import React from 'react';
import PropTypes from 'prop-types';
import {
  Col,
} from 'reactstrap';
import './PageContent.scss';

const PageContent = ({ children }) => (
  <Col sm={{ size: 10, offset: 1 }} md={{ size: 10, offset: 1 }} className="pageContent form-headline">
    <main className="pageMain">
      {children}
    </main>
  </Col>
);

PageContent.propTypes = {
  children: PropTypes.node,
};

PageContent.defaultProps = {
  children: null,
};

export default PageContent;
