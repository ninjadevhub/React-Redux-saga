import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import {
  Button,
  Col,
  Container,
  Row,
} from 'reactstrap';
// import Input from 'components/Form/Input';

class TextLink extends Component {
  handleButtonClick = (e) => {
    e.preventDefault();

    this.props.history.push('/dashboard');
  }
  render() {
    return (
      <div className="page-preapproved narrow">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} className="text-center mb-2 mt-2 mt-md-4">
              <img src="/icons/text-message.svg" alt="Pro-Approved" className="mb-3" />
              <h1>We sent a text message<br /> to (123) 456-7890</h1>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col sm={8} md={6} lg={4} className="text-center mb-2">
              <p className="mb-4">Please click link in the text message and follow the prompts to upload a photo ID.</p>
              <Button color="primary" size="lg" className="w-100 mb-1">I didn&apos;t receive a text</Button>
              <Button color="link" size="lg" className="w-100">Close</Button>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

TextLink.propTypes = {
  history: PropTypes.object.isRequired,
};

TextLink.defaultProps = {

};

export default withRouter(TextLink);
