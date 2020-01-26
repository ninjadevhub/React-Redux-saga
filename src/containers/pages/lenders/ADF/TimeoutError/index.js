import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { parseUrlParams } from 'utils/parseUrlParams';
import {
  Button,
  Col,
  Container,
  Row,
} from 'reactstrap';
import CircleDeclined from 'assets/icons/circle-declined.svg';

class PersonifyTimeoutError extends Component {
  componentWillMount() {
    const params = parseUrlParams(window.location.search);
    const { history } = this.props;

    if (!params.key) {
      history.push('/dashboard');
    }
  }

  handleTryAgain = (e) => {
    e.preventDefault();
    const params = parseUrlParams(window.location.search);
    const { history } = this.props;

    history.push(`/personify/checkin?key=${params.key}`);
  }

  render() {
    return (
      <div className="page-personify narrow">
        <Container>
          <Row>
            <Col lg={10} className="text-center mb-2 mt-2 mt-md-5 ml-auto mr-auto">
              <img src={CircleDeclined} alt="Declined" className="mb-3" />
              <h2 className="mb-2">Looks like the server is taking to long to respond, this can be caused by either poor connectivity or an error with our servers. Please click the reload button and try again.</h2>
              <Button onClick={this.handleTryAgain} color="personify" size="lg" className="mb-2 mt-1">Merchant Return to Portal</Button>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

PersonifyTimeoutError.propTypes = {
  history: PropTypes.object.isRequired,
};

export default connect(state => ({
  workflow: state.workflow,
}))(PersonifyTimeoutError);
