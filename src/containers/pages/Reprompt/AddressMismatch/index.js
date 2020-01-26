import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import {
  Row,
  Col,
  Container,
  Button,
} from 'reactstrap';

class AddressMismatch extends Component {
  handleButtonClick = (e) => {
    e.preventDefault();

    this.props.history.push('/dashboard');
  }
  render() {
    return (
      <div className="reprompt-page d-flex">
        <Container className="d-flex align-center">
          <Row>
            <Col xs={12} className="d-flex flex-column justify-content-center align-items-center">
              <h1 className="text-center mb-4">
                We sent a text message to <span className="reprompt-blue">[PHONE]</span>. Please click link in the text and follow the prompts to upload the front and back of your ID.
              </h1>

              <Button
                color="reprompt"
                className="mb-2 mt-1 text-transform-intialize"
                onClick={this.handleButtonClick}
              >
                I didn&apos;t receive the text message
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

AddressMismatch.propTypes = {
  history: PropTypes.object.isRequired,
};

AddressMismatch.defaultProps = {

};

export default withRouter(AddressMismatch);
