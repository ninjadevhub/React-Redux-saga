import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import {
  Button,
  Col,
  Container,
  Row,
} from 'reactstrap';

import { nextAction } from 'actions/workflow';
import { parseUrlParams } from 'utils/parseUrlParams';
import PersonifyAlert from 'assets/images/personify-alert.svg';

class PersonifySignaturePending extends Component {
  componentWillMount() {
    const { history, workflow } = this.props;
    const params = parseUrlParams(window.location.search);

    if (!params.key) {
      history.push('/dashboard');
    }

    if (get(workflow, 'data') === undefined) {
      history.push(`/personify/checkin?key=${params.key}`);
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const params = parseUrlParams(window.location.search);
    this.props.nextAction({
      data: {},
      url: `/workflows/adf/${params.key}/next`,
      success: (response) => {
        this.props.history.push(response.data.url);
      },
      fail: (error) => { // eslint-disable-line
        this.props.history.push({
          pathname: `/personify/decline?key=${params.key}`,
          search: '',
          state: {
            data: error.data,
          },
        });
      },
    });
  }
  render() {
    return (
      <div className="page-personify narrow">
        <Container>
          <Row>
            <Col md={8} className="text-center mb-2 mt-2 mt-md-5 ml-auto mr-auto">
              <img src={PersonifyAlert} alt="Pending" className="mb-3" />
              <h2 className="mb-2">Agreement Signature Pending</h2>
              <p className="mb-4">Sorry, we were unable to confirm your identity. Call (800) 944-6177 to continue signing the loan agreement.</p>
              <Button color="personify" size="lg" className="mb-2 mt-1" onClick={this.handleSubmit}>Continue Signing Loan Agreement</Button>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

PersonifySignaturePending.propTypes = {
  nextAction: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  workflow: PropTypes.object.isRequired,
};

export default connect(
  state => ({
    workflow: state.workflow,
  }),
  {
    nextAction,
  }
)(PersonifySignaturePending);
