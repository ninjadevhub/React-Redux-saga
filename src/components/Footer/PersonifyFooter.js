import React from 'react';
import {
  Col,
  Container,
  Row,
} from 'reactstrap';
import personifyFooterLogo from 'assets/images/logo-personify-footer.png';

const PersonifyFooter = () => (
  // Personify Footer
  <div className="personify-footer-container">
    <Container fluid className="important-informations">
      <Row>
        <Col sm={{ size: 10, offset: 1 }}>
          <div>
            <h6>IMPORTANT INFORMATION ABOUT PROCEDURES FOR OPENING A NEW ACCOUNT</h6>

            <p className="mb-1">To help the government fight the funding of terrorism and money laundering activities, Federal law requires all financial institutions to obtain, verify, and record information that identifies each person who opens an account. What this means for you: When you open an account, we will ask for your name, address, date of birth, and other information that will allow us to identify you. We may also ask to see your government-issued photo identification or other identifying documents. The approval process may take longer if additional documents are requested.</p>

            <p className="mb-1">Applications submitted will be evaluated for installment loans made by First Electronic Bank, a Utah-chartered industrial bank located in Salt Lake City, Utah, member FDIC. Personify works with First Electronic Bank to originate installment loans made by First Electronic Bank using the Personify Platform. To verify the rates and program for which your application will be evaluated, please select your state of residence on our Rates, Terms and Licensing Information page found <a href="https://www.personifyfinancial.com/rates-terms-and-licensing-information" target="_blank" rel="noopener noreferrer">here.</a></p>

            <p>To obtain a loan, you must apply electronically. Loans offered vary by loan program and state. The actual loan amount, term, and APR that you may qualify for may vary based upon your creditworthiness and program parameters. Your creditworthiness will be confirmed anytime pre-funding of your loan. APR = Annual Percentage Rate. The APR is the cost you pay each year to borrow money, including any fees charged for the loan, expressed as a percentage. The APR is a broader measure of the cost to you of borrowing money since it reflects not only the interest rate but also the fees that you have to pay to get the loan. To see payment examples and program parameters please select our Rates, Terms and Licensing Information page found <a href="https://www.personifyfinancial.com/rates-terms-and-licensing-information" target="_blank" rel="noopener noreferrer">here.</a></p>
          </div>
        </Col>
      </Row>
    </Container>
    <Container fluid className="footer-contact">
      <Row>
        <Col lg={{ size: 2, offset: 1 }} md={{ size: 3 }}>
          <img src={personifyFooterLogo} alt="Personify Financial logo bird on left" width="120" className="footer-logo mb-1" />
        </Col>
        <Col lg={{ size: 2 }} md={{ size: 3 }}>
          <p className="mb-1">
            <strong>Applied Data Finance</strong><br />
            PO Box 500650<br />
            San Diego, CA 92150
          </p>
        </Col>
        <Col lg={{ size: 3 }} md={{ size: 4 }}>
          <h6><strong>Additional Information</strong></h6>
          <div className="links">
            <a tabIndex="-1" target="_blank" without rel="noopener noreferrer" href="https://www.personifyfinancial.com/rates-terms-and-licensing-information">Terms &amp; Conditions</a>
            <a tabIndex="-1" target="_blank" without rel="noopener noreferrer" href="https://www.personifyfinancial.com/privacy-policy">Privacy Policy</a>
          </div>
        </Col>
      </Row>
    </Container>
    <div className="footer-copyright">Copyright &#64;2019, Applied Data Finance, LLC D/B/A Personify Financial, All rights reserved</div>
  </div>
  // End Global Footer
);

PersonifyFooter.propTypes = {

};

PersonifyFooter.defaultProps = {

};

export default PersonifyFooter;
