import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';

import { Button } from 'components/Button';
import { parseUrlParams } from 'utils/parseUrlParams';

class Pending extends Component {
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
            <h2 className="text-center">APPLICATION PENDING</h2>
            <p className="p-xlarge text-center mt-2 mb-4">You are pre-approved, but we need more information before we can move forward. Please upload your valid ID in the Merchant Portal and call us at (877) 203-4747.</p>
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
          </Col>
        </Row>
      </Container>
    );
  }
}

Pending.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

Pending.defaultProps = {
};

export default connect(state => ({
  auth: state.auth,
}))(Pending);
