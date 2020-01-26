import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  Col,
  Container,
  Row,
} from 'reactstrap';

import { nextAction } from 'actions/workflow';
import { parseUrlParams } from 'utils/parseUrlParams';
import CircleDeclined from 'assets/icons/circle-declined.svg';

class ManualVerification extends Component {
  handleContinueSignLoanDocument = (e) => {
    e.preventDefault();
    const params = parseUrlParams(window.location.search);
    if (params.applicationId) {
      this.props.nextAction({
        data: {},
        url: `/workflows/application/${params.applicationId}/workflow/${this.props.match.params.workflowtype}/next`,
        success: (response) => {
          const routeUrl = response.state && response.state.url;
          this.props.history.push(routeUrl);
        },
        fail: (error) => {
          this.props.history.push({
            pathname: `/applications/${this.props.match.params.workflowtype}/general-error-page`,
            search: '',
            state: {
              data: error.data,
            },
          });
        },
      });
    }
  }

  render() {
    return (
      <Container fluid>
        <Row>
          <Col sm={{ size: 8, offset: 2 }} className="d-flex flex-column justify-content-center" style={{ minHeight: 600 }}>
            <img src={CircleDeclined} alt="circle declined" />
            <h2 className="text-center mt-3">Agreement Signature Pending</h2>
            <p className="text-center mb-4" style={{ fontSize: 16, marginTop: 10 }}>Sorry, we were unable to confirm your identity. Call 800-994-6177 Ext 3 to continue signing the loan agreement.</p>
          </Col>
        </Row>
      </Container>
    );
  }
}

ManualVerification.propTypes = {
  history: PropTypes.object.isRequired,
  nextAction: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
};

ManualVerification.defaultProps = {
};

export default connect(
  null,
  {
    nextAction,
  }
)(ManualVerification);
