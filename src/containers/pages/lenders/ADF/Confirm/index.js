import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cn from 'classnames';
import {
  Card,
  Col,
  Container,
  Row,
} from 'reactstrap';
import { Button } from 'components/Button';
import { toast } from 'react-toastify';
import get from 'lodash/get';

import { nextAction } from 'actions/workflow';
import { parseUrlParams } from 'utils/parseUrlParams';
import { formatCurrency } from 'utils/formatCurrency';

class PersonifyConfirm extends Component {
  state = {
    offerSent: false,
    isLoading: false,
    isSendingEmail: false,
  }

  componentWillMount() {
    const { history, workflow } = this.props;
    const params = parseUrlParams(window.location.search);

    if (!params.key) {
      history.push('/dashboard');
    }

    if (get(workflow, 'data') === undefined || get(workflow, 'activity') !== 'OfferConfirmation') {
      history.push(`/personify/checkin?key=${params.key}`);
    }
  }

  handleSendContract = () => {
    this.setState({ offerSent: true });

    toast.info(<div><h5>Contract has been successfully sent to kylefoundry@gmail.com</h5></div>);
  }

  handleSubmit = (isSendingEmailContract, e) => {
    e.preventDefault();

    const params = parseUrlParams(window.location.search);
    this.setState({ [isSendingEmailContract ? 'isSendingEmail' : 'isLoading']: true });
    this.props.nextAction({
      data: {
        emailContract: isSendingEmailContract,
      },
      url: `/workflows/adf/${params.key}/next`,
      success: (response) => {
        this.setState({ [isSendingEmailContract ? 'isSendingEmail' : 'isLoading']: false });
        this.props.history.push(response.data.url);
      },
      fail: (error) => {
        this.setState({ [isSendingEmailContract ? 'isSendingEmail' : 'isLoading']: false });
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
    const { offerSent, isLoading, isSendingEmail } = this.state;
    const { workflow } = this.props;

    return (
      <div className="page-personify narrow">
        <Container>
          <Row className="mb-3 mt-1">
            <Col>
              <Card className="lu-offer-card">
                <Container fluid className="p-0">
                  <Row noGutters>
                    <Col lg={4} className="bg-light p-3 lu-offer-cta">
                      <h5 className="mb-lg-1">Estimated&nbsp;<br className="d-none d-lg-block" /><font className="text-success">{get(workflow, 'data.offer.paymentFrequency')} Payment</font></h5>
                      <small className="mb-lg-1">(Your payment schedule is based upon your income schedule)</small>
                      <h1 className="mb-0 text-success">${formatCurrency(get(workflow, 'data.offer.paymentAmount') || 0, 2)}<sup className="asterisk text-success">&dagger;</sup></h1>
                    </Col>
                    <Col lg={8}>
                      <Container className="p-3" fluid>
                        <Row className="mb-2" noGutters>
                          <Col xs={8}>
                            <h5 className="mb-0">Amount to be Financed</h5>
                          </Col>
                          <Col xs={4} className="text-secondary font-weight-bold">${formatCurrency(get(workflow, 'data.offer.approvalAmount') || 0, 2)}</Col>
                        </Row>
                        <Row className="mb-2" noGutters>
                          <Col xs={8}>
                            <h5 className="mb-0">Loan Term</h5>
                          </Col>
                          <Col xs={4} className="text-secondary font-weight-bold">{get(workflow, 'data.offer.term') || 0} Months</Col>
                        </Row>
                        <Row className="mb-2" noGutters>
                          <Col xs={8}>
                            <h5 className="mb-0">Estimated APR <span className="asterisk"><sup>&dagger;&dagger;</sup></span></h5>
                          </Col>
                          <Col xs={4} className="text-secondary font-weight-bold">{formatCurrency(get(workflow, 'data.offer.apr') || 0, 2)}%</Col>
                        </Row>
                        <Row noGutters>
                          <Col xs={8}>
                            <h5 className="mb-2">Origination Fee</h5>
                          </Col>
                          <Col xs={4} className="text-secondary font-weight-bold">{get(workflow, 'data.offer.originationPercentage') || 0}%</Col>
                        </Row>
                        {
                          get(workflow, 'data.offer.paymentFrequency') !== 'Monthly' &&
                            <Row noGutters>
                              <Col xs={8}>
                                <h5 className="mb-0">Estimated Monthly Payment Total</h5>
                              </Col>
                              <Col xs={4} className="text-secondary font-weight-bold">${formatCurrency(get(workflow, 'data.offer.estimatedMonthlyTotal') || 0, 2)}</Col>
                            </Row>
                        }
                      </Container>
                    </Col>
                  </Row>
                </Container>
              </Card>
            </Col>
          </Row>

          <Row className="mb-5">
            <Col md={6}>
              <Button
                color="personify"
                className="mr-md-2 mb-1 mb-md-0 w-100"
                onClick={this.handleSubmit.bind(null, false)}
                isLoading={isLoading}
                disabled={isLoading}
              >
                Finalize Application Now
              </Button>
            </Col>
            <Col md={6}>
              <Button
                onClick={this.handleSubmit.bind(null, true)}
                color="secondary"
                className={cn('w-100', offerSent ? ' d-none' : ' d-block')}
                isLoading={isSendingEmail}
                disabled={isSendingEmail}
              >
                EMAIL LINK TO CUSTOMER
              </Button>
            </Col>
          </Row>

          <Row>
            <Col>
              <p className="mb-1"><small>Scroll down for further information. These offers are not a guarantee of approval.</small></p>
              <p className="mb-1"><small>&dagger; Estimated payment at the beginning of the loan, prior to any interest rate reduction application.</small></p>
              <p className="mb-1"><small>&dagger;&dagger; Estimated Annual Percentage Rate at time of funding; does not include any interest rate reduction.</small></p>
              <p className="mb-1"><small>Rate reduction applies to interest rate only, not APR. Your interest rate will not be reduced below the program minimum interest rate of 30.00%.</small></p>
              <p className="mb-1"><small>Loans under this program are governed by Utah state law.</small></p>
              <p className="mb-2"><small>The maximum APR is 99.99%. Payment examples shown below are for illustrative purposes only and not an actual representation of offers available.</small></p>
              <Container className="disclaimer-table mb-2 pb-0">
                <Row className="header">
                  <Col>For example, for a $3,500, 36-month loan, with an APR of:</Col>
                </Row>
                <Row>
                  <Col xs={3} md={2} className="text-center"><strong>APR</strong></Col>
                  <Col><strong>SAMPLE MONTHLY PAYMENT SCHEDULE</strong></Col>
                </Row>
                <Row>
                  <Col xs={3} md={2} className="d-flex align-items-center justify-content-center">37.30%</Col>
                  <Col><small>6 Payments of $168.41, 6 Payments of $164.88, 6 Payments of $161.95, 6 Payments of $159.68, 6 Payments of $158.08, and 6 Payments of $157.20, repaying a total of $5,821.20 over the life of the loan, with a finance charge of $2,321.20.</small></Col>
                </Row>
                <Row>
                  <Col xs={3} md={2} className="d-flex align-items-center justify-content-center">57.2%</Col>
                  <Col><small>6 Payments of $211.56, 6 Payments of $207.56, 6 Payments of $204.17, 6 Payments of $201.49, 6 Payments of $199.57, and 6 Payments of $198.49, repaying a total of $7,337.04 over the life of the loan, with a finance charge of $3,837.04.</small></Col>
                </Row>
                <Row>
                  <Col xs={3} md={2} className="d-flex align-items-center justify-content-center">97.45%</Col>
                  <Col><small>6 Payments of $307.74, 6 Payments of $303.00, 6 Payments of $298.82, 6 Payments of $295.38, 6 Payments of $292.81, and 6 Payments of $291.32, repaying a total of $10,734.42 over the life of the loan, with a finance charge of $7,234.42.</small></Col>
                </Row>
              </Container>
              <p className="mb-1"><small>Your interest rate may decrease every 6 months with on-time payments. In disclosing the APR, finance charge, total amount to be repaid, as well as the number and amount of payments to be made, the lender has assumed that each payment you make will be an on-time payment. If you do not make any on-time payment, the APR, finance charge, total of payments and scheduled payments you must pay under your loan agreement will be greater than the amounts shown. For example, the loan payment you must make by a scheduled payment due date will not decrease to a lower payment unless and until you have made the number of consecutive on-time payments required to qualify for a reduced interest rate and reduced payment.</small></p>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

PersonifyConfirm.propTypes = {
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
)(PersonifyConfirm);
