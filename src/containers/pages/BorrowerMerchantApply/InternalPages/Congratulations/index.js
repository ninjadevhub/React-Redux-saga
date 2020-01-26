import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cn from 'classnames';

import { Button } from 'components/Button';
import {
  Col,
  Container,
  Row,
} from 'reactstrap';

import { nextAction } from 'actions/workflow';
import { parseUrlParams } from 'utils/parseUrlParams';
import { appConfig } from 'config/appConfig';
import PreApproved from 'assets/icons/pre-approved.svg';

class Congratulations extends Component {
  state = {
    // eslint-disable-next-line
    response: {},
    isLoading: false,
  };

  componentWillMount() {
    const { history } = this.props;
    const params = parseUrlParams(window.location.search);
    if (!params.applicationId) {
      history.push(`/applications/${this.props.match.params.workflowtype}/application`);
    }
  }

  handleButtonClick = (e) => {
    e.preventDefault();
    const params = parseUrlParams(window.location.search);
    this.setState({ isLoading: true });
    if (params.applicationId) {
      this.props.nextAction({
        data: {},
        url: `/workflows/application/${params.applicationId}/workflow/${this.props.match.params.workflowtype}/next`,
        success: (response) => {
          this.setState({ isLoading: false });
          const routeUrl = response.state && response.state.url;
          console.log(routeUrl);
          this.props.history.push(routeUrl);
        },
        fail: (error) => {
          this.props.history.push({
            pathname: `/applications/${this.props.match.params.workflowtype}/general-error-page`,
            search: '',
            state: {
              data: error.data,
            },
          });
        },
      });
    }
  }

  render() {
    const { isLoading } = this.state;
    const isADFMerchant = appConfig.adfMerchantId === localStorage.getItem('merchantId');

    const params = parseUrlParams(window.location.search);
    const isIframeSet = params.iframe === '1';
    const title = isIframeSet ? 'Please proceed to the next step' : 'Please have your merchant proceed to the next step';
    const btnTitle = isIframeSet ? 'Continue to Next Step' : 'Merchant Continue to Next Step';
    return (
      <Container>
        <Row>
          <Col className="text-center mb-2 mt-2 mt-md-4">
            <img src={PreApproved} alt="check-icon" className="mb-3" />
            <h2 className="mb-4 text-center">Congratulations!<br />Your Loan is Pre-Approved</h2>
            <p className="p-xlarge" style={{ marginBottom: '40px', textAlign: 'center' }}>{title}</p>
            {
              (localStorage.getItem('token') || (localStorage.getItem('token') && !isADFMerchant) || isIframeSet) && (
                <Row>
                  <Col className="d-flex justify-content-center">
                    <Button
                      className={cn('large buttonStyle', isLoading ? '' : 'arrow')}
                      onClick={this.handleButtonClick}
                      isLoading={isLoading}
                      color="primary"
                    >
                      {btnTitle}
                    </Button>
                  </Col>
                </Row>
              )
            }
          </Col>
        </Row>
      </Container>
    );
  }
}

Congratulations.propTypes = {
  history: PropTypes.object.isRequired,
  nextAction: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
};

export default connect(
  state => ({
    auth: state.auth,
    workflow: state.workflow,
  }),
  {
    nextAction,
  }
)(Congratulations);
