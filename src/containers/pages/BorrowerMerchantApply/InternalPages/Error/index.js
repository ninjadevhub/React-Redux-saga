import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';

import {
  nextAction,
} from 'actions/workflow';
import { parseUrlParams } from 'utils/parseUrlParams';
import circleDeclined from 'assets/icons/circle-declined.svg';

class Error extends Component {
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
    const { location } = this.props;
    return (
      <Container fluid>
        <Row>
          <Col sm={{ size: 8, offset: 2 }} className="d-flex flex-column justify-content-center" style={{ minHeight: 600 }}>
            <img src={circleDeclined} alt="Circle Declined" />
            <h2 className="text-center mt-3">{location.state.message}</h2>
          </Col>
        </Row>
      </Container>
    );
  }
}

Error.propTypes = {
  history: PropTypes.object.isRequired,
  // eslint-disable-next-line
  nextAction: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

Error.defaultProps = {
};

export default connect(
  state => ({
    auth: state.auth,
  }),
  {
    nextAction,
  }
)(Error);
