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
import PersonifyApprovedImage from 'assets/images/personify-approve.svg';
import PersonifyLogoDark from 'assets/images/personify-logo-dark.png';

class EmailSent extends Component {
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

  handleClickContiune = (e) => {
    e.preventDefault();
    this.props.history.push('/dashboard');
  }

  render() {
    return (
      <div className="page-personify narrow">
        <Container>
          <Row>
            <Col className="text-center mb-2 mt-2 mt-md-5 align-item-center">
              <img src={PersonifyApprovedImage} alt="Approved" className="mb-3" />
              <h2 className="mb-4">Email has been sent</h2>
              <div><img src={PersonifyLogoDark} alt="Personify Financial" width="290" className="mb-4" /></div>
              <Button
                color="personify"
                size="lg"
                className="mb-2 mt-1"
                onClick={this.handleClickContiune}
              >
                MERCHANT RETURN TO PORTAL
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

EmailSent.propTypes = {
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
)(EmailSent);

