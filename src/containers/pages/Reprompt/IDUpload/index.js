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
  Row,
} from 'reactstrap';
import { FilePond } from 'react-filepond';
// import Input from 'components/Form/Input';

class TextLink extends Component {
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
              <h1 className="mb-1">Upload a Photo ID</h1>
              <p className="mb-1"><strong>For your security</strong>, Please upload a US Government-issued photo ID.</p>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col md={4} xl={3} className="pb-3">
              <Card className="h-100 mb-0">
                <CardHeader>ID Requirements</CardHeader>
                <CardBody>
                  <ol className="mb-0 pl-2">
                    <li className="mb-1 mb-md-2">Full name must match application.</li>
                    <li className="mb-1 mb-md-2">Date of birth must match application.</li>
                    <li className="mb-1 mb-md-2">Address must match application.</li>
                    <li className="mb-1 mb-md-2">Must be issued by US Government.</li>
                    <li><strong>Cannot</strong> be a military ID, temporary license, or expired.</li>
                  </ol>
                </CardBody>
              </Card>
            </Col>
            <Col sm={6} md={4} xl={3} className="pb-3">
              <Card className="border-primary h-100">
                <CardHeader>Front of ID</CardHeader>
                <CardBody className="text-center justify-content-center pb-0">
                  <img src="/icons/id-front.svg" alt="Front of ID" className="mb-3" />
                  <FilePond />
                </CardBody>
              </Card>
            </Col>
            <Col sm={6} md={4} xl={3} className="pb-3">
              <Card className="border-primary h-100">
                <CardHeader>Back of ID</CardHeader>
                <CardBody className="text-center">
                  <img src="/icons/id-back.svg" alt="Front of ID" className="mb-3" />
                  <FilePond />
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col className="text-center">
              <Button color="primary" size="lg" className="ml-auto mr-auto" disabled>Submit</Button>
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
