import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Col,
  Container,
  Row,
} from 'reactstrap';

import {
  nextAction,
} from 'actions/workflow';

import PhoneIcon from 'assets/icons/lusa-phone-icon.svg';

class NeedVoiceCall extends Component {
  handleButtonClick = (e) => {
    e.preventDefault();
    this.props.history.push('/dashboard');
  }

  render() {
    return (
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} className="text-center mb-2 mt-2 mt-md-4">
            <img src={PhoneIcon} alt="check-icon" className="mb-3" />
            <h1 className="mb-2 text-center">You&apos;re almost done!</h1>
            <p className="mb-4">Please call us at (818) 200-0238 to finalize the process.</p>
          </Col>
        </Row>
      </Container>
    );
  }
}

NeedVoiceCall.propTypes = {
  history: PropTypes.object.isRequired,
};

NeedVoiceCall.defaultProps = {
};

export default connect(
  state => ({
    auth: state.auth,
  }),
  {
    nextAction,
  }
)(NeedVoiceCall);
