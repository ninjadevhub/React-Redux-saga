import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Sticky from 'react-stickynode';

import IconLabel from 'components/IconLabel';
import Timer from 'components/Icons/Timer';
import Dollar from 'components/Icons/Dollar';
import Percent from 'components/Icons/Percent';
import SecurityLock from 'components/Icons/SecurityLock';
import digicert from 'assets/images/digicert.png';
import { Row, Col } from 'reactstrap';

const Sidebar = ({ bottomBoundary }) => (
  /* <!-- Apply Sidebar --> */
  <Col id="Sidebar" lg={4} className="sidebar-apply show-for-large" data-sticky-container>
    <Sticky
      enabled
      innerZ={9}
      top={120}
      bottomBoundary={bottomBoundary}
    >
      <div className="sticky" data-sticky data-top-anchor="Sidebar" data-btm-anchor="Footer" data-margin-top="7.5">
        <div className="card">
          <div className="card-section">
            <IconLabel
              icon={<Timer />}
              content={<Fragment><strong>Fast &amp; Easy Process</strong> with loan decisions in seconds</Fragment>}
            />
            <IconLabel
              icon={<Dollar />}
              content={<Fragment><strong>Fixed Rates</strong> and <strong>Low Monthly Payments</strong></Fragment>}
            />
            <IconLabel
              icon={<Percent />}
              content={<Fragment><strong>No Interest on Principal</strong> if paid in full within Promotional Period*</Fragment>}
            />
          </div>
        </div>

        <Row className="grid-x security">
          <Col sm={9} className="ssl" style={{ display: 'flex' }}>
            <SecurityLock width="28" />
            <p className="p-small ml-1 mb-0"><strong>128-bit SSL</strong> protection and strict encryption</p>
          </Col>
          <Col sm={3} className="certificate">
            <img src={digicert} alt="" />
          </Col>
        </Row>
      </div>
    </Sticky>
  </Col>
);

Sidebar.propTypes = {
  bottomBoundary: PropTypes.any,
};

Sidebar.defaultProps = {
  bottomBoundary: '#footer',
};

export default Sidebar;
