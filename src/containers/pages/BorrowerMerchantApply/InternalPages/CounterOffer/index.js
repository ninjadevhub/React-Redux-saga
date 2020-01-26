import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';

import { parseUrlParams } from 'utils/parseUrlParams';
import LoanBlocked from 'assets/icons/loan-declined.svg';

class CounterOffer extends Component {
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

  render() {
    return (
      <Container fluid>
        <Row>
          <Col sm={{ size: 8, offset: 2 }} className="d-flex flex-column justify-content-center" style={{ minHeight: 600 }}>
            <img src={LoanBlocked} alt="Circle Blocked" />
            <p className="p-xlarge text-center mt-2 mb-4">Your offer has changed. Please contact your merchant for next steps.</p>
          </Col>
        </Row>
      </Container>
    );
  }
}

CounterOffer.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

CounterOffer.defaultProps = {
};

export default connect(state => ({
  auth: state.auth,
}))(CounterOffer);
