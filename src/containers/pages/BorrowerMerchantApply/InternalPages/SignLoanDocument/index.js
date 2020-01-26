import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Col,
  Container,
  Row,
} from 'reactstrap';

import {
  nextAction,
} from 'actions/workflow';

import PreApproved from 'assets/icons/pre-approved.svg';

class SignLoanDocument extends Component {
  handleButtonClick = (e) => {
    e.preventDefault();
    this.props.history.push('/dashboard');
  }

  render() {
    return (
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} className="text-center mb-2 mt-2 mt-md-4">
            <img src={PreApproved} alt="check-icon" className="mb-3" />
            <h1 className="mb-2 text-center">That&apos;s it. You&apos;re all set!</h1>
            <p className="mb-4">If you have any questions, please call us at (800) 994-6177</p>
          </Col>
        </Row>
      </Container>
    );
  }
}

SignLoanDocument.propTypes = {
  history: PropTypes.object.isRequired,
};

SignLoanDocument.defaultProps = {
};

export default connect(
  state => ({
    auth: state.auth,
  }),
  {
    nextAction,
  }
)(SignLoanDocument);
