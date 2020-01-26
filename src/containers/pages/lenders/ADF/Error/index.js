import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { parseUrlParams } from 'utils/parseUrlParams';
import {
  Button,
  Col,
  Container,
  Row,
} from 'reactstrap';
import CircleDeclined from 'assets/icons/circle-declined.svg';

class PersonifyError extends Component {
  componentWillMount() {
    const params = parseUrlParams(window.location.search);
    const { history, workflow } = this.props;

    if (!params.key) {
      history.push('/dashboard');
    }

    if (get(workflow, 'data') === undefined) {
      history.push(`/personify/checkin?key=${params.key}`);
    }
  }

  renderDeclineContent = (reasonCode) => {
    switch (reasonCode) {
      case 'ABC123456789':
        return (
          <Fragment>
            <img src={CircleDeclined} alt="Declined" className="mb-3" />
            <h2 className="mb-2">Unfortunately, we are unable to process your request at this time due to a technical issue. Please call us at 855-419-1242.</h2>
          </Fragment>
        );
      default:
        return (
          <Fragment>
            <img src={CircleDeclined} alt="Declined" className="mb-3" />
            <h2 className="mb-2">Unfortunately, we were unable to approve your application at this time.</h2>
          </Fragment>
        );
    }
  }

  render() {
    const { workflow } = this.props;
    const reasonCode = get(workflow, 'data.trackingId');

    return (
      <div className="page-personify narrow">
        <Container>
          <Row>
            <Col lg={10} className="text-center mb-2 mt-2 mt-md-5 ml-auto mr-auto">
              {
                this.renderDeclineContent(reasonCode)
              }
              <Button tag={Link} to="/dashboard" color="personify" size="lg" className="mb-2 mt-1">Merchant Return to Portal</Button>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

PersonifyError.propTypes = {
  history: PropTypes.object.isRequired,
  workflow: PropTypes.object.isRequired,
};

export default connect(state => ({
  workflow: state.workflow,
}))(PersonifyError);
