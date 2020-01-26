import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import {
  Col,
  Container,
  Row,
} from 'reactstrap';
import { Button } from 'components/Button';

import { nextAction } from 'actions/workflow';
import { parseUrlParams } from 'utils/parseUrlParams';
import PersonifyApprovedImage from 'assets/images/personify-approve.svg';
import PersonifyLogoDark from 'assets/images/personify-logo-dark.png';

class PersonifyApproved extends Component {
  state = {
    isLoading: false,
  }

  componentWillMount() {
    const { history, workflow } = this.props;
    const params = parseUrlParams(window.location.search);

    if (!params.key) {
      history.push('/dashboard');
    }

    if (get(workflow, 'data') === undefined || get(workflow, 'activity') !== 'Approved') {
      history.push(`/personify/checkin?key=${params.key}`);
    }
  }

  handleClickContiune = (e) => {
    e.preventDefault();

    const params = parseUrlParams(window.location.search);

    this.setState({ isLoading: true });
    this.props.nextAction({
      data: {},
      url: `/workflows/adf/${params.key}/next`,
      success: (response) => {
        this.setState({ isLoading: false });
        this.props.history.push(response.data.url);
      },
      fail: (error) => { // eslint-disable-line
        this.setState({ isLoading: false });
        if (get(error, 'status') === 400) {
          this.props.history.push({
            pathname: '/personify/error',
            search: `key=${params.key}`,
            state: {
              data: get(error, 'data.failure'),
            },
          });
        } else if (get(error, 'status') === 504) {
          this.props.history.push({
            pathname: '/personify/timeout',
            search: `key=${params.key}`,
          });
        } else {
          this.props.history.push({
            pathname: '/personify/error',
            search: `key=${params.key}`,
          });
        }
      },
    });
  }

  render() {
    const { isLoading } = this.state;

    return (
      <div className="page-personify narrow">
        <Container>
          <Row>
            <Col className="text-center mb-2 mt-2 mt-md-5 align-item-center">
              <img src={PersonifyApprovedImage} alt="Approved" className="mb-3" />
              <h2 className="mb-4 text-center">Congratulations!<br /> Your loan is pre-qualified<sup style={{ fontWeight: 300, fontSize: 22 }}>&dagger;</sup> with</h2>
              <div><img src={PersonifyLogoDark} alt="Personify Financial" width="290" className="mb-4" /></div>
              <Button
                color="personify"
                size="lg"
                className="mb-2 mt-1"
                onClick={this.handleClickContiune}
                disabled={isLoading}
                isLoading={isLoading}
              >
                CONTINUE
              </Button>
              <p><sup style={{ fontFamily: 'none', fontSize: 16 }}>&#10013;</sup>Pending underwriting.</p>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

PersonifyApproved.propTypes = {
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
)(PersonifyApproved);

