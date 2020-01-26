import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import cn from 'classnames';
import Datetime from 'react-datetime';
import {
  Card,
  CardHeader,
  CardBody,
  Col,
  Container,
  CustomInput,
  Form,
  FormGroup,
  Row,
  Modal as PopupModal,
  ModalBody,
} from 'reactstrap';
import { Button } from 'components/Button';
import dateFns from 'date-fns';
import get from 'lodash/get';

import Validator from 'components/Validator/Validator';
import Input from 'components/Form/Input';
import Modal from 'react-modal';
import SlidingPane from 'react-sliding-pane';

import { parseUrlParams } from 'utils/parseUrlParams';
import { nextAction, checkPreviousAction } from 'actions/workflow';
import { floatUnmask, currencyMask, unmask, confirmAmountOfSaleMask } from 'utils/masks';
import ArrowLeftGrey from 'assets/icons/arrow-left-grey.svg';
import { formatCurrency } from 'utils/formatCurrency';
import { toTitleCase } from 'utils/toTitleCase';
import LowerMyRateProgram from './lowerMyRateProgram.png';
import AddressCard from 'components/Icons/AddressCard';
import schema from './schema';

class PersonifySelectOffer extends Component {
  state = {
    isPaneOpen: false,
    confirmAmountOfSale: '',
    isUpdating: false,
    isUpdated: false,
    isLoading: false,
    isLearnMoreModalVisible: false,
  }

  componentWillMount() {
    const { history, workflow } = this.props; // eslint-disable-line
    const params = parseUrlParams(window.location.search);

    if (!params.key) {
      history.push('/dashboard');
    }

    if (get(workflow, 'data') === undefined || get(workflow, 'activity') !== 'OfferSelection') {
      history.push(`/personify/checkin?key=${params.key}`);
    } else {
      this.setState({
        confirmAmountOfSale: formatCurrency(get(workflow, 'data.preApprovalAmount') || 0, 2),
      });
    }
  }

  componentDidMount() {
    Modal.setAppElement(this.el);
  }

  getCurrentDate = () => dateFns.format(new Date(), 'MM/DD/YYYY');

  handleTermsCheck = (name, value) => {
    const { validator: { onChangeHandler } } = this.props;
    onChangeHandler(name, value);
  }

  handleClickUpdate = (e) => {
    e.preventDefault();
    const { history } = this.props;
    const params = parseUrlParams(window.location.search);

    if (Number.parseFloat(floatUnmask(this.state.confirmAmountOfSale)) < 1000 || Number.parseFloat(floatUnmask(this.state.confirmAmountOfSale)) > 35000) {
      this.setState({
        errorMessage: 'Confirm Amount of Sale must be between $1,000.00 and $35,000.00',
      });
      return false;
    }

    this.setState({
      isUpdating: true,
      errorMessage: '',
    });
    this.props.checkPreviousAction({
      data: {
        newLoanAmount: unmask(`${this.state.confirmAmountOfSale}`),
      },
      url: `/workflows/adf/${params.key}/checkin`,
      // eslint-disable-next-line
      success: (response) => {
        this.setState({
          isUpdating: false,
          isUpdated: true,
          errorMessage: '',
        });
        history.push(get(response, 'data.url'));
      },
      fail: (error) => {
        this.setState({
          isUpdating: false,
          isUpdated: false,
          errorMessage: '',
        });
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

  handleDateChange = (date) => {
    const { validator: { onChangeHandler } } = this.props;
    if (typeof date.toISOString === 'function') {
      onChangeHandler('serviceDate', dateFns.format(date.toISOString(), 'MM/DD/YYYY'));
    } else {
      onChangeHandler('serviceDate', '');
    }
  }

  handleInputChange = (event) => {
    const { validator: { onChangeHandler } } = this.props;
    switch (event.target.name) {
      default:
        onChangeHandler(event.target.name, event.target.value);
    }
  }

  handleProductTotalChange = (e) => {
    e.preventDefault();

    this.setState({
      confirmAmountOfSale: e.target.value,
    });
  }

  handleBlur = (event) => {
    event.preventDefault();

    const { validator: { onChangeHandler } } = this.props;
    switch (event.target.name) {
      case 'payoutAmount':
      case 'amountFinanced':
        onChangeHandler(event.target.name, formatCurrency(floatUnmask(event.target.value || '0'), 2));
        break;
      default:
        onChangeHandler(event.target.name, toTitleCase(event.target.value));
    }
  }

  handleBlurPreapproval = (e) => {
    e.preventDefault();
    this.setState({
      confirmAmountOfSale: e.target.value ? formatCurrency(floatUnmask(e.target.value), 2) : '',
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const params = parseUrlParams(window.location.search);

    const { validator: { validate, values } } = this.props;
    if ((validate(schema).isValid)) {
      delete values.amountFinanced;
      this.setState({ isLoading: true });
      this.props.nextAction({
        data: values,
        url: `/workflows/adf/${params.key}/next`,
        success: (response) => {
          this.setState({ isLoading: false });
          this.props.history.push(response.data.url);
        },
        fail: (error) => {
          this.setState({ isLoading: false });
          if (get(error, 'status') === 400) {
            this.props.history.push({
              pathname: '/personify/error',
              search: `key=${params.key}`,
              state: {
                data: get(error, 'data.failure'),
              },
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
  }

  toggleLearnMoreModal = (e) => {
    e.preventDefault();

    this.setState(prev => ({
      isLearnMoreModalVisible: !prev.isLearnMoreModalVisible,
    }));
  }

  handleSelectOffer = (index) => {
    const { workflow, validator: { setValues } } = this.props;
    this.setState({ isPaneOpen: true });
    const response = get(workflow, `data.offers.${index}`);

    const initialFormData = {
      amountFinanced: formatCurrency(response.approvalAmount, 2),
      payoutAmount: formatCurrency(response.payoutAmount, 2),
      subEntityType: get(workflow, 'data.subEntityType'),
      subEntityId: get(workflow, 'data.subEntityId'),
      offerName: response.offerName,
      isChecked1: false,
      isChecked2: false,
      isApplicantPresent: true,
    };

    setValues(initialFormData);
  }

  formatCurrency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  })

  ConfirmTray = () => {
    const { validator: { values, errors } } = this.props;
    const { isLoading } = this.state;
    return (
      <SlidingPane
        isOpen={this.state.isPaneOpen}
        closeIcon={<img src={ArrowLeftGrey} alt="close" />}
        title={[<span className="flag-merchant">Merchant</span>, <span>Please confirm the following</span>]}
        width="460px"
        className="modal-personify"
        onRequestClose={() => { this.setState({ isPaneOpen: false }); }}
      >
        <Form className="d-flex flex-column" onSubmit={this.handleSubmit}>
          <FormGroup className="pb-0 mb-1">
            <Input
              label="Amount Financed"
              name="amountFinanced"
              value={`${values.amountFinanced}`}
              onChange={this.handleInputChange}
              isMasked={currencyMask}
              hasError={!!errors.amountFinanced}
              errorMessage={errors.amountFinanced}
              onBlur={this.handleBlur}
              isBadgeVisible={false}
              readOnly
            />
          </FormGroup>
          <FormGroup className="pb-0 mb-1">
            <Input
              label="Payout Amount"
              name="payoutAmount"
              onChange={this.handleInputChange}
              isMasked={currencyMask}
              value={`${values.payoutAmount}`}
              hasError={!!errors.payoutAmount}
              errorMessage={errors.payoutAmount}
              isRequired
              onBlur={this.handleBlur}
              isBadgeVisible={false}
              readOnly
            />
          </FormGroup>
          <FormGroup className="pb-0 mb-2 page-personify">
            <div className={cn('has-value', 'hasValue', errors.serviceDate ? 'required' : '')}>
              <span className="layerOrder">
                Purchase/Service Date
                <em>Required</em>
              </span>
              <Datetime
                ref={(el) => { this.dateTime = el; }}
                name="serviceDate"
                label="Purchase/Service Date"
                className="input approximate"
                value={values.serviceDate}
                onChange={this.handleDateChange}
                closeOnSelect
                dateFormat="MM/DD/YYYY"
                timeFormat={false}
                placeHolder="MM/DD/YYYY"
                renderInput={props => (
                  <Input
                    isMasked={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                    isRequired
                    hasError={!!errors.serviceDate}
                    errorMessage={errors.serviceDate}
                    placeHolder="MM/DD/YYYY"
                    {...props}
                  />
                )}
              />
            </div>
          </FormGroup>
          <FormGroup className="pb-0 mb-0">
            <CustomInput
              type="checkbox"
              id="agree1"
              onChange={this.handleTermsCheck.bind(null, 'isChecked1', !values.isChecked1)}
              className="mb-1"
              value={values.isChecked1}
              label="I certify that the amount taken only includes services or products to be rendered. No origination fees or any other finance fees have been added. Non compliances will result in all funds being charged back and loan cancellation. Additionally, it is understood that I am not to attempt to collect additional fees directly from the customer in order to make up for the discount fees that I am incurring."
            />
          </FormGroup>
          <FormGroup className="pb-0">
            <CustomInput
              onChange={this.handleTermsCheck.bind(null, 'isChecked2', !values.isChecked2)}
              type="checkbox"
              id="agree2"
              value={values.isChecked2}
              className="mb-1"
              label="I certify that I have identified the borrower with a valid government issued ID and have retained a copy for my records which will be provided to LendingUSA, on behalf of Personify Financial, upon request."
            />
          </FormGroup>
          <FormGroup className="pb-0 mb-0">
            <Input
              label="Authorized Representative Signature"
              onChange={this.handleInputChange}
              name="signature"
              id="signature"
              value={values.signature}
              isBadgeVisible={false}
              isRequired
            />
          </FormGroup>
          <div className="w-100 mt-auto">
            <Button
              color="personify"
              id="SubmitRefundRequest"
              className="w-100 mb-2"
              disabled={!(values.amountFinanced && values.payoutAmount && values.serviceDate && values.isChecked1 && values.isChecked2 && values.signature) || isLoading}
              isLoading={isLoading}
              onClick={this.handleSubmit}
            >
              Finalize Sale
            </Button>
          </div>
        </Form>
      </SlidingPane>
    );
  }

  render() {
    const { workflow } = this.props;
    const { confirmAmountOfSale, isUpdating, isUpdated, errorMessage, isLearnMoreModalVisible } = this.state;
    const response = get(workflow, 'data');

    return (
      <div className="container-body">
        <div className="page-personify">
          <Container fluid>
            <Row className="mb-3 align-items-center">
              <Col className="text-center text-md-left">
                <h3 className="mb-0">Please Confirm Amount &amp; Select Offer</h3>
                <small>Application ID: {get(workflow, 'attributes.entityId')}</small>
                <p style={{ fontSize: 24, color: '#00a499' }}>Your interest rate drops 2% points for every 6 months of on-time payments!&Dagger; <span className="text-link" onClick={this.toggleLearnMoreModal} style={{ fontSize: 14 }}>(learn more)</span></p>
                {
                  isUpdated &&
                    <h3 style={{ color: '#04bc6c' }} className="mb-0">Congratulations, you&apos;ve been approved for the maximum amount of ${response && formatCurrency(response.preApprovalAmount, 2)}</h3>
                }
              </Col>
            </Row>

            <Row>
              <Col md={5} lg={3}>
                <Card>
                  <CardHeader>Confirm Amount of Sale</CardHeader>
                  <CardBody>
                    <Form>
                      <FormGroup className="pb-0 mb-1">
                        <Input
                          name="amount"
                          label="Pre-qualified Amount"
                          value={`${formatCurrency((response && response.preApprovalAmount) || 0, 2)}`}
                          isBadgeVisible={false}
                          isMasked={currencyMask}
                          readOnly
                          disabled
                        />
                      </FormGroup>
                      <FormGroup className="mb-0 pb-1">
                        <Input
                          name="amount"
                          label="Confirm Amount of Sale"
                          value={`${confirmAmountOfSale || ''}`}
                          onChange={this.handleProductTotalChange}
                          isMasked={confirmAmountOfSaleMask}
                          hasError={!!errorMessage}
                          errorMessage={errorMessage}
                          isBadgeVisible={false}
                          isRequired
                          onBlur={this.handleBlurPreapproval}
                        />
                      </FormGroup>
                      <FormGroup className="mb-0 pb-0">
                        <Button
                          className="w-100 mb-0"
                          onClick={this.handleClickUpdate}
                          color="personify"
                          isLoading={isUpdating}
                          disabled={isUpdating}
                        >
                          Update
                        </Button>
                      </FormGroup>
                    </Form>
                  </CardBody>
                </Card>
                {
                  response && (response.pendWarning === 1 || response.pendWarning === 2) &&
                    <Card className="pend-warning">
                      <CardBody>
                        <div>
                          <AddressCard className="pend-warning-address" width="40" />
                        </div>
                        <div>Additional Verification Will Be Required</div>
                      </CardBody>
                    </Card>
                }
              </Col>

              <Col md={7} lg={9}>
                {
                  response && response.offers && response.offers.map((item, index) => (
                    <Card className="lu-offer-card" key={`offer-card-${index}`}>
                      <Container fluid className="p-0">
                        <Row noGutters>
                          <Col lg={4} className="bg-light p-3 lu-offer-cta">
                            <h5 className="mb-lg-1">Estimated&nbsp;<br className="d-none d-lg-block" /><font className="text-success">{item.paymentFrequency} Payment</font></h5>
                            <small className="mb-lg-1">(Your payment schedule is based upon your income schedule)</small>
                            <h1 className="text-success">${formatCurrency(item.paymentAmount, 2)}<sup className="asterisk text-success">&dagger;</sup></h1>
                            <Button onClick={this.handleSelectOffer.bind(null, index)} color="personify">Select</Button>
                          </Col>
                          <Col lg={8}>
                            <Container className="p-4" fluid>
                              <Row className="mb-2" noGutters>
                                <Col xs={8}>
                                  <h5 className="mb-0">Amount to be Financed</h5>
                                </Col>
                                <Col xs={4} className="text-secondary font-weight-bold">${formatCurrency(item.approvalAmount, 2)}</Col>
                              </Row>
                              <Row className="mb-2" noGutters>
                                <Col xs={8}>
                                  <h5 className="mb-0">Loan Term</h5>
                                </Col>
                                <Col xs={4} className="text-secondary font-weight-bold">{item.term} Months</Col>
                              </Row>
                              <Row className="mb-2" noGutters>
                                <Col xs={8}>
                                  <h5 className="mb-0">Estimated APR <span className="asterisk"><sup>&dagger;&dagger;</sup></span></h5>
                                </Col>
                                <Col xs={4} className="text-secondary font-weight-bold">{formatCurrency(item.apr, 2)}%</Col>
                              </Row>
                              <Row noGutters>
                                <Col xs={8}>
                                  <h5 className="mb-2">Origination Fee</h5>
                                </Col>
                                <Col xs={4} className="text-secondary font-weight-bold">{item.originationPercentage}%</Col>
                              </Row>
                              {
                                item.paymentFrequency !== 'Monthly' &&
                                  <Row noGutters>
                                    <Col xs={8}>
                                      <h5 className="mb-0">Estimated Monthly Payment Total</h5>
                                    </Col>
                                    <Col xs={4} className="text-secondary font-weight-bold">${formatCurrency(item.estimatedMonthlyTotal, 2)}</Col>
                                  </Row>
                              }
                            </Container>
                          </Col>
                        </Row>
                      </Container>
                    </Card>
                  ))
                }
                <Row>
                  <Col>
                    <p className="mb-1"><small>Scroll down for further information. These offers are not a guarantee of approval.</small></p>
                    <p className="mb-1"><small>&dagger; Estimated payment at the beginning of the loan, prior to any interest rate reduction application.</small></p>
                    <p className="mb-1"><small>&dagger;&dagger; Estimated Annual Percentage Rate at time of funding; does not include any interest rate reduction.</small></p>
                    <p className="mb-1"><small>&Dagger; Rate reduction applies to interest rate only, not APR. Your interest rate will not be reduced below the program minimum interest rate of 30.00%.</small></p>
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

              </Col>
            </Row>
          </Container>

          <this.ConfirmTray />
          <PopupModal isOpen={isLearnMoreModalVisible} toggle={this.toggleLearnMoreModal} size="lg">
            <ModalBody className="text-center">
              <button className="close position-absolute" onClick={this.toggleLearnMoreModal} style={{ right: 10 }}>&times;</button>
              <img src={LowerMyRateProgram} alt="learn more" width="650px" />
            </ModalBody>
          </PopupModal>
        </div>
      </div>
    );
  }
}

PersonifySelectOffer.propTypes = {
  nextAction: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  workflow: PropTypes.object.isRequired,
  validator: PropTypes.object.isRequired,
  checkPreviousAction: PropTypes.func.isRequired,
};

export default compose(
  Validator(schema),
  connect(
    state => ({
      workflow: state.workflow,
    }),
    {
      nextAction,
      checkPreviousAction,
    }
  )
)(PersonifySelectOffer);
