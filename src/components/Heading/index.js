import React from 'react';
import PropTypes from 'prop-types';
import {
  Col,
  Row,
} from 'reactstrap';

import SecurityLock from 'components/Icons/SecurityLock';

import digicert from 'assets/images/digicert.png';

const Heading = ({ heading, subHeading, isCardVisible }) => (
  // Heading
  <Row>
    <Col>
      <h2>{heading}</h2>
      <p className="p-large">{subHeading}</p>
      {
        isCardVisible &&
        <Row className="security hide-for-large">
          <Col size={{ size: 9 }} className="ssl d-flex justify-content-center align-items-center">
            <SecurityLock width="28" />
            <p className="p-small mb-0 ml-1"><strong>128-bit SSL</strong> protection and strict encryption</p>
          </Col>
          <Col size={{ size: 3 }} className="certificate">
            <img src={digicert} alt="" />
          </Col>
        </Row>
      }
    </Col>
  </Row>
  // End Heading
);

Heading.propTypes = {
  heading: PropTypes.any,
  subHeading: PropTypes.string,
  isCardVisible: PropTypes.bool,
};

Heading.defaultProps = {
  heading: '',
  subHeading: '',
  isCardVisible: false,
};

export default Heading;
