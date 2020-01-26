import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import {
  Row, Col,
} from 'reactstrap';

const Footer = ({ pageName, isContentVisible }) => (
  // Global Footer
  <div id="Footer" className="footer-container footer-simple" data-sticky-footer>
    <div>
      <div className="footer">
        {
          isContentVisible &&
          <div className={cn('footer-content')} style={{ fontSize: '.8rem', margin: 30 }}>
            <p style={{ marginBottom: 15 }}>All loans are made by Cross River Bank, a New Jersey State Chartered Bank. Member FDIC. Loan amounts range from $1,000 to $35,000. No loans are offered in Connecticut, New Hampshire, West Virginia, Vermont, Puerto Rico or any other unincorporated US territory. The APR’s range from 14.99% APR to 29.99% APR. An origination fee of up to 8% may be included in the principal loan amount that results in an APR up to 29.99%.</p>
            {
              (
                pageName !== 'congratulation' &&
                pageName !== 'crerditOffer' &&
                pageName !== 'autoPay' &&
                pageName !== 'creditOfferConfirmation'
              ) &&
                <Fragment>
                  <p style={{ marginBottom: 15 }}>* Your loan may have a No Interest on Principal Option Promotion included. This promotion can save you money if you pay off the principal amount of the loan in full within the Promotional Period (&quot;Promotional Period&quot;). During the Promotional Period you will be responsible for making all of your monthly payments and your loan will accrue interest on a monthly basis. If you pay off your loan within the Promotional Period, the monthly payments that you have made during this period, which includes accrued interest, will be deducted from the principal amount of the loan. Length of Promotional Periods vary, please review your loan agreement for full details.</p>
                  <p>† To check the rates you qualify for, LendingUSA does a soft credit pull that will not impact your credit score. However, if you choose to continue your application, your full credit report will be requested from one or more consumer reporting agencies, which is considered a hard credit pull.</p>
                </Fragment>
            }
          </div>
        }
        <Row className={cn('legal', !isContentVisible && 'mb-0 mt-0 pt-0 pb-0', pageName === 'creditOfferConfirmation' ? 'creditOfferConfirmation' : '')} style={{ borderTop: isContentVisible ? '1px solid #f2f1f0' : 'none' }}>
          <Col className={cn('medium-6 security default-footer')}>
            <div className="footer-copy"><p>Copyright © 2019. LendingUSA, LLC. All Rights Reserved.</p></div>
            <img src="https://www.lendingusa.com/wp-content/themes/FoundationPress/src/assets/images/security/temp-security-logos.png" alt="Equal Housing Opportunity - Digicert" className="digicertImage" />
          </Col>
        </Row>
      </div>
    </div>
  </div>
  // End Global Footer
);

Footer.propTypes = {
  pageName: PropTypes.string,
  isContentVisible: PropTypes.bool,
};

Footer.defaultProps = {
  pageName: '',
  isContentVisible: false,
};

export default Footer;
