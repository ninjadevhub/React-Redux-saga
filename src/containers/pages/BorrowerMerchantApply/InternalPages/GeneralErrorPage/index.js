import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';

import {
  Container, Row, Col,
} from 'reactstrap';
import { Button } from 'components/Button';
import { parseUrlParams } from 'utils/parseUrlParams';
import {
  nextAction,
} from 'actions/workflow';
import CircleDeclined from 'assets/icons/circle-declined.svg';

class GeneralErrorPage extends Component {
  handleMerchantReturnClick = (e) => {
    e.preventDefault();
    const params = parseUrlParams(window.location.search);
    if (params.pid) {
      this.props.history.push(`/applications/${this.props.match.params.workflowtype}/application/?pid=${params.pid}`);
    } else {
      this.props.history.push('/dashboard');
    }
  }

  render() {
    const { location } = this.props;
    let errorMessage = '';

    if (get(location, 'state.data.errorMessages') && get(location, 'state.data.errorMessages').length) {
      errorMessage = get(location, 'state.data.errorMessages').join(',');
    }
    return (
      <Fragment>
        <Container fluid>
          <Row style={{ minHeight: 550 }}>
            <Col sm={12} lg={{ size: 8, offset: 2 }} className="d-flex flex-column justify-content-center">
              <img src={CircleDeclined} alt="Circle Declined" className="mb-5" />
              <h2 className="text-center mb-5">Unfortunately, we were unable to process your application at this time</h2>
              {
                errorMessage &&
                  <p className="p-xlarge error text-center mb-2">{errorMessage}</p>
              }
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
      </Fragment>
    );
  }
}

GeneralErrorPage.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

GeneralErrorPage.defaultProps = {
};

export default compose(
  withRouter,
  connect(
    null,
    {
      nextAction,
    }
  )
)(GeneralErrorPage);
