import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';
import { Col, Container, Row } from 'reactstrap';
// import { Button } from 'components/Button';

import {
  nextAction,
} from 'actions/workflow';
import { parseUrlParams } from 'utils/parseUrlParams';
import ugaImage from 'assets/images/uga-finance-logo.png';
// import starImage from 'assets/icons/star-decline-partner.svg';

class UgaDeclined extends Component {
  state = {
    // eslint-disable-next-line
    response: {},
  };

  componentWillMount() {
    const params = parseUrlParams(window.location.search);
    const { history, workflow } = this.props;

    if (get(workflow, 'state.data') === undefined) {
      history.push(`/applications/${this.props.match.params.workflowtype}/checkin?applicationId=${params.applicationId || ''}`);
    }
    if (!params.applicationId) {
      this.props.history.push(`/applications/${this.props.match.params.workflowtype}/application`);
    }
  }

  handleButtonClick = (e) => {
    e.preventDefault();
    const params = parseUrlParams(window.location.search);
    if (params.applicationId) {
      this.props.nextAction({
        data: {},
        url: `/workflows/application/${params.applicationId}/workflow/${this.props.match.params.workflowtype}/next`,
        success: (response) => {
          const routeUrl = response.state && response.state.url;
          this.props.history.push(routeUrl);
        },
        fail: (error) => {
          console.log(error);
        },
      });
    }
  }

  handleMerchantReturnClick = (e) => {
    e.preventDefault();
    const params = parseUrlParams(window.location.search);
    if (params.applicationId) {
      this.props.history.push('/dashboard/application-review');
    }
  }

  handleClickContinue = (e) => {
    e.preventDefault();
    const { workflow } = this.props;

    window.location = get(workflow, 'state.data.ugaDeclinedRedirectUrl');
  }

  render() {
    return (
      <div className="page-ugadeclined">
        <Container fluid>
          <Row>
            <Col>
              <Row>
                <Col sm={12} lg={{ size: 8, offset: 2 }}>
                  <div className="credit-score">
                    {/* <div class="score">613</div>
                    <span>Your Credit Score</span> */}
                  </div>
                  <h4>Unfortunately we are unable to approve you for a loan at this time.</h4>
                  <p>Our partner UGA Finance might be able to help.</p>
                  <h5><span>NEXT STEP:</span> Contact UGA Finance</h5>
                  <div className="green-arrows" />
                </Col>
              </Row>
              <Row className="promo">
                <Col sm={12} lg={{ size: 10, offset: 1 }}>

                  <div className="partner-logo">
                    <img src={ugaImage} width="160" alt="UGA Finance Logo" />
                  </div>

                  <div className="phone-cta" onClick={this.handleClickContinue}>
                    <div className="d-flex-container">
                      <p>Click to Continue</p>
                    </div>
                  </div>
                  {/* <div className={style.or}>OR</div>
                  <a target="_blank" rel="noopener noreferrer" href="https://fjfj" className="button secondary">Learn more about UGA Finance</a>

                  <div className={cn('grid-x grid-margin-x', style['partner-bullets'])}>
                    <div className="cell small-12 medium-4">
                      <img src={starImage} alt="" />
                      <p>Lorem ipsum dolor sit amet consectetur adipiscing elit eiusmod</p>
                    </div>
                    <div className="cell small-12 medium-4">
                      <img src={starImage} alt="" />
                      <p>Lorem ipsum dolor sit amet consectetur adipiscing elit eiusmod</p>
                    </div>
                    <div className="cell small-12 medium-4">
                      <img src={starImage} alt="" />
                      <p>Lorem ipsum dolor sit amet consectetur adipiscing elit eiusmod</p>
                    </div>
                  </div> */}

                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

UgaDeclined.propTypes = {
  history: PropTypes.object.isRequired,
  nextAction: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  workflow: PropTypes.object.isRequired,
};

UgaDeclined.defaultProps = {
};

export default connect(
  state => ({
    auth: state.auth,
    workflow: state.workflow,
  }),
  {
    nextAction,
  }
)(UgaDeclined);
