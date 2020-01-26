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

class PersonifyKba extends Component {
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
          <Row className="mb-3 mt-2">
            <Col className="text-center">
              <h2 className="mb-2">For your security, we need to verify your identity</h2>
              <p>Please review the below questions and select the best answers for each.</p>
            </Col>
          </Row>
          <Row>
            <div className="e-sign-placeholder col">&nbsp;</div>
          </Row>
          <Row className="mt-4">
            <Col md={4} className="ml-auto mr-auto">
              <Button color="personify" size="lg" className="w-100" onClick={this.handleSubmit}>CONFIRM</Button>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

PersonifyKba.propTypes = {
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
)(PersonifyKba);

