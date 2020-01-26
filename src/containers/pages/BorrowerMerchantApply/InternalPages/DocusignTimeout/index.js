import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Col, Container, Row } from 'reactstrap';
import { Button } from 'components/Button';

import CircleDeclined from 'assets/icons/circle-declined.svg';
import { parseUrlParams } from 'utils/parseUrlParams';

class DocusignTimeout extends Component {
  handleButtonClick = (e) => {
    e.preventDefault();
    const params = parseUrlParams(window.location.search);
    this.props.history.replace(`/fsl/autopayelection?applicationId=${params.applicationId}`);
  };

  render() {
    return (
      <Container fluid>
        <Row>
          <Col sm={{ size: 8, offset: 2 }} className="d-flex flex-column justify-content-center" style={{ minHeight: 600 }}>
            <img src={CircleDeclined} alt="circle declined" />
            <h2 className="text-center mt-3">Signing document timed out</h2>
            <Row>
              <Col className="d-flex justify-content-center">
                <Button
                  className="large"
                  onClick={this.handleButtonClick}
                  color="primary"
                >
                  Click here to Esign the document
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

DocusignTimeout.propTypes = {
  history: PropTypes.object.isRequired,
};

DocusignTimeout.defaultProps = {
};

export default connect(state => ({
  auth: state.auth,
}))(DocusignTimeout);
