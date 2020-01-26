import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Col,
  Container,
  Row } from 'reactstrap';
import { FilePond } from 'react-filepond';

class IncomeVerification extends Component {
  handleButtonClick = (e) => {
    e.preventDefault();

    this.props.history.push('/dashboard');
  }
  render() {
    return (
      <div className="page-incomeverification">

        <Container fluid>
          <Row className="mt-3 mb-4 justify-content-center">
            <Col md={10} lg={8} className="text-center">
              <h4 className="mb-1"><span className="flag-borrower">Borrower</span>&nbsp; Please Continue:</h4>
              <h1 className="mb-1">Income Verification</h1>
              <p className="mb-1"><strong>You are almost done!</strong> Please select <strong><u>one</u></strong> of the options below to verify your income:</p>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={6} lg={5} xl={4} className="pb-3">
              <Card className="h-100 mb-0">
                <CardHeader>Connect Bank Account</CardHeader>
                <CardBody className="text-center">
                  <img src="/icons/income-connect.svg" alt="Connect Bank Account" />
                  <p className="mt-2 mb-3">Login and connect your bank account to verify your income</p>
                  <Button color="primary" className="mb-2 w-100">Connect Bank Account</Button>
                  <small className="text-muted"><strong>Note:</strong> For your protection, we do not store any of your bank login credentials</small>
                </CardBody>
              </Card>
            </Col>
            <Col md={6} lg={5} xl={4} className="pb-3">
              <Card className="h-100 mb-0">
                <CardHeader>Upload Paystubs</CardHeader>
                <CardBody className="text-center">
                  <img src="/icons/income-paystubs.svg" alt="Upload Paystubs" />
                  <p className="mt-2 mb-3">Upload 2 of your most recent paystubs to verify your income</p>
                  <FilePond
                    allowMultiple
                    maxFiles={2}
                    dropOnPage
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="mt-2 justify-content-center">
            <Col md={10} lg={8} className="text-center">
              <Button>No thanks, I do not want to verify my income</Button>
            </Col>
          </Row>

        </Container>
      </div>
    );
  }
}

IncomeVerification.propTypes = {
  history: PropTypes.object.isRequired,
};

IncomeVerification.defaultProps = {

};

export default withRouter(IncomeVerification);
