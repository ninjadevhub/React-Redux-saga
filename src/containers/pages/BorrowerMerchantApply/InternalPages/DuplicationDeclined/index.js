import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';

import { Button } from 'components/Button';

import {
  nextAction,
} from 'actions/workflow';
import { parseUrlParams } from 'utils/parseUrlParams';
import circleDeclined from 'assets/icons/circle-declined.svg';

class DuplicationDeclined extends Component {
  state = {
    // eslint-disable-next-line
    response: {},
  };

  componentWillMount() {
    const params = parseUrlParams(window.location.search);
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
    return (
      <Container fluid>
        <Row>
          <Col sm={{ size: 8, offset: 2 }} className="d-flex flex-column justify-content-center" style={{ minHeight: 600 }}>
            <img src={circleDeclined} alt="Circle Declined" />
            <h2 className="text-center mt-3" style={{ lineHeight: 1.5 }}>Unfortunately, we are unable to approve your request for credit due to having an existing credit application submitted in the last 30 days.  You are welcome to resubmit a credit application with after 30 days from the date of your existing application.</h2>
            {
              localStorage.getItem('token') && (
                <Row>
                  <Col className="d-flex justify-content-center mt-3">
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

DuplicationDeclined.propTypes = {
  history: PropTypes.object.isRequired,
  nextAction: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
};

DuplicationDeclined.defaultProps = {
};

export default connect(
  state => ({
    auth: state.auth,
  }),
  {
    nextAction,
  }
)(DuplicationDeclined);
