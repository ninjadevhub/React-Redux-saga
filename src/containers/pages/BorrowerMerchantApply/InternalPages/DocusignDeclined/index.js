import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';

import { Button } from 'components/Button';
import {
  Col,
  Container,
  Row,
} from 'reactstrap';

import { nextAction } from 'actions/workflow';
import { parseUrlParams } from 'utils/parseUrlParams';
import CircleDeclined from 'assets/icons/circle-declined.svg';

class DocusignDeclined extends Component {
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
            <p className="p-xlarge text-center mt-2 mb-4">{get(this.props, 'location.state.data.message')}</p>
            {
              get(this.props, 'location.state.data.message') &&
              <Row>
                <Col className="d-flex justify-content-center">
                  <Button
                    className="large arrow buttonStyle"
                    onClick={this.handleContinueSignLoanDocument}
                    color="primary"
                  >
                    Continue Signing Loan Document
                  </Button>
                </Col>
              </Row>
            }
          </Col>
        </Row>
      </Container>
    );
  }
}

DocusignDeclined.propTypes = {
  history: PropTypes.object.isRequired,
  nextAction: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
};

DocusignDeclined.defaultProps = {
};

export default connect(
  null,
  {
    nextAction,
  }
)(DocusignDeclined);
