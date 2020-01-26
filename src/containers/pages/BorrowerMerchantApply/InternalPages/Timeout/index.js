import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Col, Container, Row } from 'reactstrap';
import { Button } from 'components/Button';

import TimeoutImg from 'assets/images/timeout.png';
import { parseUrlParams } from 'utils/parseUrlParams';
import { nextAction } from 'actions/workflow';

class Timeout extends Component {
  state = {
    isLoading: false,
  };

  handleButtonClick = (e) => {
    e.preventDefault();
    const params = parseUrlParams(window.location.search);
    if (params.applicationId) {
      this.setState({
        isLoading: true,
      });
      this.props.nextAction({
        data: {
          returnURL: `${window.location.origin}/applications/${this.props.match.params.workflowtype}/complete?applicationId=${params.applicationId}`,
        },
        url: `/workflows/application/${params.applicationId}/workflow/${this.props.match.params.workflowtype}/next`,
        success: (response) => {
          this.setState({
            isLoading: false,
          });
          const routeUrl = response.state && response.state.url;
          this.props.history.push(routeUrl);
        },
        // eslint-disable-next-line
        fail: (error) => {
          this.setState({
            isLoading: false,
          });
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
    const { isLoading } = this.state;
    return (
      <Container fluid>
        <Row>
          <Col sm={{ size: 8, offset: 2 }} className="d-flex flex-column justify-content-center" style={{ minHeight: 600 }}>
            <img src={TimeoutImg} style={{ width: 100, margin: '0 auto' }} alt="circle declined" />
            <h2 className="text-center mt-3">Your Session Timed Out</h2>
            <p className="mb-1" style={{ fontSize: 16, marginTop: 10, textAlign: 'center' }}>Please click the button below to resume signing your loan document.</p>
            <br />
            <Row>
              <Col className="d-flex justify-content-center">
                <Button
                  className="large"
                  onClick={this.handleButtonClick}
                  isLoading={isLoading}
                  color="primary"
                >
                  Esign Now
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

Timeout.propTypes = {
  history: PropTypes.object.isRequired,
  nextAction: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
};

Timeout.defaultProps = {
};

export default connect(
  state => ({
    auth: state.auth,
  }),
  {
    nextAction,
  }
)(Timeout);
