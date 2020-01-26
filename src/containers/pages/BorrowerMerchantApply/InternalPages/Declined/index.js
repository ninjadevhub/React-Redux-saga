import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';
import get from 'lodash/get';
import { Button } from 'components/Button';

import {
  nextAction,
} from 'actions/workflow';
import { parseUrlParams } from 'utils/parseUrlParams';
import LoanDeclined from 'assets/icons/loan-declined.svg';

class Declined extends Component {
  state = {
    // eslint-disable-next-line
    response: {},
  };

  componentWillMount() {
    const params = parseUrlParams(window.location.search);
    const { history, workflow } = this.props;

    if (get(workflow, 'state.data') === undefined) {
      history.push(`/applications/${this.props.match.params.workflowtype}/checkin?applicationId=${params.applicationId || ''}`);
    }

    if (!params.applicationId) {
      this.props.history.push(`/applications/${this.props.match.params.workflowtype}/application`);
    }
  }

  handleButtonClick = (e) => {
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

  handleMerchantReturnClick = (e) => {
    e.preventDefault();
    const params = parseUrlParams(window.location.search);
    if (params.applicationId) {
      this.props.history.push('/dashboard');
    }
  }

  render() {
    const { workflow } = this.props;
    const hardPullDisclosure = get(workflow, 'state.data.hardPullDisclosure');
    const strHeadLine = hardPullDisclosure ? 'Your loan status has changed. After further review, unfortunately we are no longer able to approve your application.' : 'Unfortunately, we were unable to approve your application at this time';

    return (
      <Container fluid>
        <Row>
          <Col sm={{ size: 8, offset: 2 }} className="d-flex flex-column justify-content-center" style={{ minHeight: 600 }}>
            <img src={LoanDeclined} alt="Circle Declined" />
            <h2 className="text-center mt-3">
              {strHeadLine}
            </h2>
            <p className="p-xlarge text-center mt-2 mb-4">You will receive an adverse action notice within 30 days that will provide you with the specific reason(s) as to why we were unable to approve your application.</p>
            {
              localStorage.getItem('token') && (
                <Row>
                  <Col className="d-flex justify-content-center">
                    <Button
                      className="large arrow buttonStyle"
                      onClick={this.handleMerchantReturnClick}
                      color="primary"
                    >
                      Merchant Return to Dashboard
                    </Button>
                  </Col>
                </Row>
              )
            }
          </Col>
        </Row>
      </Container>
    );
  }
}

Declined.propTypes = {
  history: PropTypes.object.isRequired,
  nextAction: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  workflow: PropTypes.object.isRequired,
};

Declined.defaultProps = {
};

export default connect(
  state => ({
    auth: state.auth,
    workflow: state.workflow,
  }),
  {
    nextAction,
  }
)(Declined);
