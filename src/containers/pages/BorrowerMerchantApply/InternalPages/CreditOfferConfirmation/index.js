import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cn from 'classnames';
import get from 'lodash/get';
import {
  Card,
  Container,
  FormGroup,
  Row,
  Col,
} from 'reactstrap';

import { Button } from 'components/Button';
import NotificationSystem from 'react-notification-system';

import { nextAction, sendContractToConsumer } from 'actions/workflow';
import { parseUrlParams } from 'utils/parseUrlParams';
import { formatCurrency } from 'utils/formatCurrency';

class CreditOfferConfirmation extends Component {
  state = {
    // eslint-disable-next-line
    response: {},
    isLoading: false,
    isSending: false,
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

  toggleModal = () => {
    this.setState(({ isModalShown }) => ({ isModalShown: !isModalShown }));
  }

  handleCheckboxChange = (name, value) => {
    this.setState({
      [name]: value,
    });
  }

  handleButtonClick = (e) => {
    e.preventDefault();
    const params = parseUrlParams(window.location.search);
    if (params.applicationId) {
      this.setState({
        isLoading: true,
      });

      this.props.nextAction({
        data: {
          returnURL: `${window.location.origin}/applications/${this.props.match.params.workflowtype}/complete?applicationId=${params.applicationId}`,
        },
        url: `/workflows/application/${params.applicationId}/workflow/${this.props.match.params.workflowtype}/next`,
        success: (response) => {
          this.setState({
            isLoading: false,
          });
          const routeUrl = response.state && response.state.url;
          this.props.history.push(routeUrl);
        },
        // eslint-disable-next-line
        fail: (error) => {
          this.setState({
            isLoading: false,
          });
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

  handleEmailContractToConsumer = (e) => {
    e.preventDefault();
    const params = parseUrlParams(window.location.search);
    if (params.applicationId) {
      this.setState({
        isSending: true,
      });

      this.props.sendContractToConsumer({
        url: `/applications/${params.applicationId}/applicant/contract`,
        // eslint-disable-next-line
        success: (response) => {
          this.setState({
            isSending: false,
          });

          if (response && response.message) {
            this.notification.addNotification({
              message: response.message,
              level: 'success',
              position: 'tc',
            });
          }
        },
        // eslint-disable-next-line
        fail: (error) => {
          this.setState({
            isSending: false,
          });

          if (error && error.message) {
            this.notification.addNotification({
              message: error.message,
              level: 'error',
              position: 'tc',
            });
          }
        },
      });
    }
  }

  render() {
    const { workflow } = this.props;
    const { isLoading, isSending } = this.state;
    return (
      <div className="page-dashboard">
        <NotificationSystem ref={(item) => { this.notification = item; }} />
        <Container>
          <Row className="mb-3 align-items-center d-flex justify-content-center">
            <Col md={7} lg={9} className="text-center text-md-left">
              <h3 className="mb-0">Offer Confirmation</h3>
            </Col>
          </Row>
          <Row className="d-flex justify-content-center">
            <Col md={7} lg={9}>
              <Card className={cn('lu-offer-card', 'offer-selected')}>
                <Container fluid className="p-0">
                  <Row noGutters>
                    <Col lg={4} className="bg-light p-3 lu-offer-cta">
                      <h5 className="mb-lg-2">Estimated<br className="d-none d-lg-block" /> Monthly Payment</h5>
                      <h1 className="mb-0 text-primary">${formatCurrency(get(workflow, 'state.data.paymentAmount'), 2) || '-'}</h1>
                    </Col>
                    <Col lg={8}>
                      <Container className="p-3" fluid>
                        <Row className="mb-2" noGutters>
                          <Col xs={12} className="bg-white pt-0 pl-3 pr-3 text-center" style={{ zIndex: 1, position: 'relative' }}>
                            {
                              !!Number(get(workflow, 'state.data.zipTerm')) && (
                                <Fragment>
                                  <h2 className="mb-0 text-success text-center" style={{ fontWeight: 500 }}>
                                    {
                                      Number(get(workflow, 'state.data.originationPercentage')) ? 'NO INTEREST' : '0% APR'
                                    }
                                  </h2>
                                  <h5 className="mb-2">if paid within {get(workflow, 'state.data.zipTerm')} months*</h5>
                                </Fragment>
                              )
                            }
                          </Col>
                        </Row>
                        <Row className="mb-2" noGutters>
                          <Col xs={8}>
                            <h5 className="mb-0">Amount Financed</h5>
                          </Col>
                          <Col xs={4} className="text-primary">${formatCurrency(get(workflow, 'state.data.amountTaken'), 2) || '-'}</Col>
                        </Row>
                        <Row className="mb-2" noGutters>
                          <Col xs={8}>
                            <h5 className="mb-0">Loan Term</h5>
                          </Col>
                          <Col xs={4} className="text-primary">{get(workflow, 'state.data.term')} Months</Col>
                        </Row>
                        <Row className="mb-2" noGutters>
                          <Col xs={8}>
                            <h5 className="mb-0">Interest Rate</h5>
                          </Col>
                          <Col xs={4} className="text-primary">{formatCurrency(get(workflow, 'state.data.rate'), 2) || '-'}%</Col>
                        </Row>
                        <Row className="mb-2" noGutters>
                          <Col xs={8}>
                            <h5 className="mb-0">APR</h5>
                          </Col>
                          <Col xs={4} className="text-primary">{formatCurrency(get(workflow, 'state.data.apr'), 4) || '-'}%</Col>
                        </Row>
                        {
                          !!Number(get(workflow, 'state.data.originationPercentage')) && (
                            <Row className="mb-1" noGutters>
                              <Col xs={8}>
                                <h5 className="mb-0">Origination Fee**</h5>
                                <small>Included in monthly payment</small>
                              </Col>
                              <Col xs={4} className="text-primary">{Number(get(workflow, 'state.data.originationPercentage')) ? formatCurrency(Number(get(workflow, 'state.data.originationPercentage')) * 100, 2) : '0'}%</Col>
                            </Row>
                          )
                        }
                      </Container>
                    </Col>
                  </Row>
                </Container>
              </Card>
              <FormGroup className="form-group">
                <Row>
                  <Col md={6}>
                    <Button
                      className="large w-100 mb-2"
                      onClick={this.handleButtonClick}
                      isLoading={isLoading}
                      color="primary"
                    >
                      ESIGN NOW
                    </Button>
                  </Col>
                  <Col md={6}>
                    <Button
                      className="large w-100 mb-2"
                      onClick={this.handleEmailContractToConsumer}
                      isLoading={isSending}
                      color="primary"
                    >
                      Email Contract to Consumer
                    </Button>
                  </Col>
                  <Col sm={12} md={12}>
                    <p className="offerDisclaimer">
                      Before your application can be finalized, LendingUSA and/or Cross River Bank will request a full credit report from on or more of the credit reporting agencies. This request will occur after you click the “ESIGN NOW” button above. This request will appear as a hard inquiry on your credit report and may affect your credit score.
                    </p>
                  </Col>
                  {
                    (get(workflow, 'state.data.zipTerm') !== 0) &&
                      <Col sm={12} md={12}>
                        <p className="offerDisclaimer">
                          * Your loan may have a No Interest on Principal Option Promotion included. This promotion can save you money if you pay off the principal amount of the loan in full within the Promotional Period (&#34;Promotional Period&#34;). During the Promotional Period you will be responsible for making all of your monthly payments and your loan will accrue interest on a monthly basis. If you pay off your loan within the Promotional Period, the monthly payments that you have made during this period, which includes accrued interest, will be deducted from the principal amount of the loan. Length of Promotional Periods vary, please review your loan agreement for full details.
                        </p>
                      </Col>
                  }
                  {
                    (get(workflow, 'state.data.originationPercentage') !== 0) &&
                      <Col sm={12} md={12}>
                        <p className="offerDisclaimer">
                        ** The Origination Fee may be up to 8% of the Amount Financed, is non-refundable, and is considered earned upon the funding of your loan. You can calculate the dollar amount of the Origination Fee for each offer listed above by multiplying the Amount Financed figure for that offer by .08 if the Origination Fee is 8%, by .05 if it is 5%, etc. For example, if the Origination Fee is 8% and if the Amount Financed is $1,000 the corresponding Origination Fee would be $80 ($1000 x .08 = $80). The total Principal Amount of your loan is the sum of the Amount Financed and the Origination Fee (i.e. if the Origination Fee is 8% and if the Amount Financed is $1,000 the Principal Amount of the loan would be $1080). Please review your Loan Agreement for additional terms and conditions.
                        </p>
                      </Col>
                  }
                </Row>
              </FormGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

CreditOfferConfirmation.propTypes = {
  history: PropTypes.object.isRequired,
  nextAction: PropTypes.func.isRequired,
  sendContractToConsumer: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  workflow: PropTypes.object.isRequired,
};


export default connect(
  state => ({
    workflow: state.workflow,
    auth: state.auth,
  }),
  {
    nextAction,
    sendContractToConsumer,
  }
)(CreditOfferConfirmation);
