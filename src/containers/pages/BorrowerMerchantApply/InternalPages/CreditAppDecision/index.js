import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import dateFns from 'date-fns';
import cn from 'classnames';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import findIndex from 'lodash/findIndex';
import {
  Alert,
  Card,
  CardHeader,
  Col,
  Container,
  FormGroup,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';

import { Button } from 'components/Button';
import Input from 'components/Form/Input';
import Datetime from 'react-datetime';
import Checkbox from 'components/Form/Checkbox';
import { Info } from 'components/Icons';

import { parseUrlParams } from 'utils/parseUrlParams';
import { currencyMask, unmask, floatUnmask, confirmAmountOfSaleMask, numberUnmask } from 'utils/masks';
import { formatCurrency } from 'utils/formatCurrency';

import {
  nextAction,
  updateOffer,
  checkPreviousAction,
} from 'actions/workflow';

class CreditAppDecision extends Component {
  state = {
    // eslint-disable-next-line
    response: {
      offers: null,
    },
    isModalShown: false,
    isChecked1: false,
    isChecked2: false,
    isChecked1Error: '',
    isChecked2Error: '',
    selectedIndex: -1,
    isLoading: false,
    purchaseDate: '',
    purchaseDateError: '',
    signature: '',
    signatureError: '',
    confirmAmountOfSale: '',
    confirmAmountOfSaleError: '',
    isUpdating: false,
    isUpdated: false,
  }

  componentWillMount() {
    const params = parseUrlParams(window.location.search);

    const { history, workflow } = this.props;
    if (get(workflow, 'state.data') === undefined) {
      history.push(`/applications/${this.props.match.params.workflowtype}/checkin?applicationId=${params.applicationId || ''}`);
    } else {
      const selectedIndex = findIndex(get(workflow, 'state.data.offers'), item => item.selected);
      this.setState({
        confirmAmountOfSale: formatCurrency(get(workflow, 'state.data.initialApprovalAmount') || 0, 2),
        selectedIndex,
      });
    }
    if (!params.applicationId) {
      this.props.history.push(`/applications/${this.props.match.params.workflowtype}/application`);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.workflow, this.props.workflow)) {
      const selectedIndex = findIndex(get(nextProps.workflow, 'state.data.offers'), item => item.selected);
      this.setState({
        confirmAmountOfSale: formatCurrency(get(nextProps.workflow, 'state.data.initialApprovalAmount') || 0, 2),
        selectedIndex,
      });
    }
  }

  toggleModal = () => {
    this.setState(({ isModalShown }) => ({ isModalShown: !isModalShown }));
  }

  handleCheckboxChange = (name, value) => {
    this.setState({
      [name]: value,
      [`${name}Error`]: '',
    });
  }

  handleFinalizeSale = (e) => {
    e.preventDefault();
    const { workflow } = this.props;
    const response = get(workflow, 'state.data');

    const { purchaseDate, isChecked1, isChecked2, signature, confirmAmountOfSale } = this.state;
    const params = parseUrlParams(window.location.search);
    let isPurchaseDateValid = true;

    if (!purchaseDate) {
      this.setState({
        purchaseDateError: 'This field is required!',
      });
    } else {
      if (numberUnmask(purchaseDate).length < 8) {
        this.setState({
          purchaseDateError: 'Date of Service is not valid!',
        });
        isPurchaseDateValid = false;
      }

      if (!moment(purchaseDate, 'MM/DD/YYYY').isValid()) {
        this.setState({
          purchaseDateError: 'Date of Service is not valid!',
        });
        isPurchaseDateValid = false;
      }
    }

    if (!signature) {
      this.setState({
        signatureError: 'This field is required!',
      });
    }
    if (!isChecked1) {
      this.setState({
        isChecked1Error: 'This field is required!',
      });
    }
    if (!isChecked2) {
      this.setState({
        isChecked2Error: 'This field is required!',
      });
    }
    if (Number(confirmAmountOfSale) < 1000 || Number(confirmAmountOfSale) > confirmAmountOfSale) {
      this.setState({
        confirmAmountOfSaleError: 'Confirm Amount of Sale must be between $1,000 and $35,000',
      });
    } else if (!!params.applicationId && purchaseDate && isPurchaseDateValid && isChecked1 && isChecked2 && !!signature) {
      this.setState({ isLoading: true });
      this.props.nextAction({
        data: {
          subEntityId: response.subEntityId,
          subEntityType: response.subEntityType,
          Term: response.offers[this.state.selectedIndex].term,
          ServiceDate: this.state.purchaseDate,
          AmountTaken: response.offers[this.state.selectedIndex].amountTaken,
          offerName: response.offers[this.state.selectedIndex].offerName,
        },
        url: `/workflows/application/${params.applicationId}/workflow/${this.props.match.params.workflowtype}/next`,
        success: (res) => {
          this.setState({ isLoading: false });
          const routeUrl = res.state && res.state.url;
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
  // eslint-disable-next-line
  selectOffer = (selectedIndex, e) => {
    e.preventDefault();
    const { workflow } = this.props;
    const response = get(workflow, 'state.data');
    response.offers && response.offers.forEach((item, index) => {
      if (index === selectedIndex) {
        this.setState((prevState) => {
          const updatedOffers = prevState.response.offers.map(offer => ({
            ...offer,
            selected: false,
          }));
          updatedOffers[selectedIndex] = {
            ...updatedOffers[selectedIndex],
            selected: !updatedOffers[selectedIndex].selected,
          };
          return {
            response: {
              ...prevState.response,
              offers: updatedOffers,
            },
            selectedIndex,
          };
        });
      }
    });
    this.setState({
      isModalShown: true,
    });
  }

  handleSelect = (selectedIndex, e) => {
    e.preventDefault();
    this.setState({
      selectedIndex,
      isModalShown: true,
    });
  }

  handleChange = (e) => {
    e.preventDefault();
    this.setState({
      signature: e.target.value,
      signatureError: '',
    });
  }

  handleProductTotalChange = (e) => {
    e.preventDefault();

    this.setState({
      confirmAmountOfSale: e.target.value,
    });
  }

  handleDateChange = (date) => {
    if (typeof date.toISOString === 'function') {
      this.setState({
        purchaseDate: dateFns.format(date.toISOString(), 'MM/DD/YYYY'),
        purchaseDateError: '',
      });
    } else {
      this.setState({
        purchaseDate: date,
        purchaseDateError: '',
      });
    }
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
    this.props.updateOffer({
      data: {
        SequenceId: 'SQTU01',
        RequestedAmount: unmask(`${this.state.confirmAmountOfSale}`),
      },
      url: `/workflows/application/${params.applicationId}/workflow/pricing/checkin`,
      // eslint-disable-next-line
      success: (res) => {
        this.props.checkPreviousAction({
          data: {},
          url: `/workflows/application/${params.applicationId}/workflow/${this.props.match.params.workflowtype}/checkin`,
          // eslint-disable-next-line
          success: (response) => {
            this.setState({
              isUpdating: false,
              isUpdated: true,
              errorMessage: '',
            });
            history.push(get(response, 'state.url'));
          },
          // eslint-disable-next-line
          fail: (error) => {
            this.props.history.replace(`/applications/${this.props.match.params.workflowtype}/application?applicationId=${params.applicationId}`);
          },
        });
      },
      fail: (error) => {
        console.log(error);
      },
    });
  }

  handleBlur = (e) => {
    e.preventDefault();
    this.setState({
      confirmAmountOfSale: e.target.value ? formatCurrency(floatUnmask(e.target.value), 2) : '',
    });
  }

  render() {
    const { className, workflow } = this.props;
    const {
      isModalShown,
      selectedIndex,
      isLoading,
      purchaseDate,
      purchaseDateError,
      signature,
      signatureError,
      confirmAmountOfSale,
      confirmAmountOfSaleError,
      isChecked1,
      isChecked1Error,
      isChecked2,
      isChecked2Error,
      isUpdating,
      isUpdated,
      errorMessage,
    } = this.state;
    const response = get(workflow, 'state.data');

    let isOriginationPercentageExist = false;
    let isZipTermExist = false;

    (get(response, 'offers') || []).forEach((item) => {
      if (Number(item.originationPercentage)) {
        isOriginationPercentageExist = true;
      }

      if (Number(item.zipTerm)) {
        isZipTermExist = true;
      }
    });
    return (
      response ?
        <div className="page-loanoffer">
          <Container className="pt-0">
            <Row className="justify-content-center">
              <Col lg={10} xl={8}>
                {
                  (
                    isUpdated && (
                      Number(response.initialApprovalAmount) > Number(response.maxAmount) ||
                      Number(response.initialApprovalAmount) === Number(response.maxAmount)
                    )
                  ) &&
                  <Row className="mt-1">
                    <Col>
                      <Alert color="primary text-center">
                        <img src="/icons/info-alert.svg" height="20" alt="Info" className="d-none d-md-inline" /><span className="text-dark">&nbsp; Congratulations, you&apos;ve been approved for the maximum amount of ${response && formatCurrency(response.initialApprovalAmount, 2)}.</span>
                      </Alert>
                    </Col>
                  </Row>
                }
                <Row>
                  <Col className="mb-2 mb-md-4 mt-1 mt-md-3">
                    <h1>Select Loan Offer</h1>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col xs={12}>
                    <h3 className="border-bottom pb-2 mb-3">
                      <span className={`flag-merchant${response.status === 'Pending' ? ' bg-success' : ''}`}>
                        Merchant
                      </span>&nbsp; Confirm Amount of Sale
                    </h3>
                    {
                      response.status === 'Pending' &&
                      <p className="mb-3 text-danger normal-font-size"><strong>Note:</strong> This offer is subject to a verification call</p>
                    }
                  </Col>
                  <Col md={5}>
                    <FormGroup className="mb-0 pb-0">
                      <Input
                        name="serviceOfProductTotal"
                        label="Pre-Approval Amount"
                        value={`${formatCurrency((response && response.initialApprovalAmount) || 0, 2)}`}
                        isBadgeVisible={false}
                        isMasked={currencyMask}
                        readOnly
                      />
                    </FormGroup>
                  </Col>
                  <Col md={5}>
                    <FormGroup className="mb-0 pb-0">
                      <Input
                        name="serviceOfProductTotal"
                        label="Confirm Amount of Sale"
                        onChange={this.handleProductTotalChange}
                        value={`${confirmAmountOfSale || ''}`}
                        isRequired
                        isMasked={confirmAmountOfSaleMask}
                        notification="Changing the total will update the estimated monthly payment"
                        isBadgeVisible={false}
                        placeHolder="$1,000.00 minimum"
                        onBlur={this.handleBlur}
                        hasError={!!errorMessage}
                        errorMessage={errorMessage}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <Button
                      className="w-100 pl-0 pr-0"
                      isDisabled={!confirmAmountOfSale}
                      onClick={this.handleClickUpdate}
                      isLoading={isUpdating}
                      color="primary"
                    >
                      Update
                    </Button>
                  </Col>
                </Row>
                {
                  response.hardPullDisclosure && (
                    <Row className="mt-1">
                      <Col>
                        <Alert color="success text-center">
                          <Info className="d-none d-md-inline" /><span className="text-dark">&nbsp; <strong>Your pre-approved offer has changed. We now have new offers for you.</strong></span>
                        </Alert>
                      </Col>
                    </Row>
                  )
                }
                <Row>
                  <Col xs={12}>
                    <h3 className="border-bottom pb-2 mb-3">Select an Offer</h3>
                    {
                      response.status === 'Pending' &&
                      <p className="mb-3 text-danger normal-font-size">
                        <strong>In order to proceed with this offer we require additional verification.</strong><br />
                        <a href="tel:8772034747" className="text-danger">Please call us at <u>877-203-4747</u></a>
                      </p>
                    }
                  </Col>
                  {
                    response.offers && response.offers.map((item, key) => (
                      <Col xs={12} md={6} key={key}>
                        <Card
                          style={{ backgroundColor: '#d7e7f9' }}
                          key={`offer-card-${key}`}
                        >
                          <CardHeader>
                            <h5 className="mb-0">{item.term} Months</h5>
                          </CardHeader>
                          <Container fluid className="p-0">
                            <Row noGutters>
                              <Col xs={12} className="bg-white pt-3 pl-3 pr-3 text-center" style={{ zIndex: 1, position: 'relative' }}>
                                {
                                  !!Number(item.zipTerm) && (
                                    <Fragment>
                                      <h2 className="mb-0 text-success text-center" style={{ fontWeight: 500 }}>
                                        {
                                          Number(item.originationPercentage) ? 'NO INTEREST' : '0% APR'
                                        }
                                      </h2>
                                      <h5 className="mb-2">if paid within {item.zipTerm} months*</h5>
                                    </Fragment>
                                  )
                                }
                                <h2 className="mb-0 text-primary text-center">${formatCurrency(item.paymentAmount, 2) || '-'}</h2>
                                <h5>Est. Monthly Payment</h5>
                                <Button
                                  color="primary"
                                  className="w-100 mt-2"
                                  onClick={this.handleSelect.bind(null, key)}
                                >
                                  {
                                    key === selectedIndex ? 'Selected' : 'Select'
                                  }
                                </Button>
                              </Col>
                              <Col xs={12} className="bg-white">
                                <Container className="p-3" fluid>
                                  <Row className="mb-1" noGutters>
                                    <Col xs={8}>
                                      <h5 className="mb-0">Amount Financed</h5>
                                    </Col>
                                    <Col xs={4}><strong>${formatCurrency(item.approvalAmount, 2) || '-'}</strong></Col>
                                  </Row>
                                  <Row className="mb-1" noGutters>
                                    <Col xs={8}><h5 className="mb-0">Loan Term</h5></Col>
                                    <Col xs={4}><strong>{item.term} Months</strong></Col>
                                  </Row>
                                  <Row className="mb-1" noGutters>
                                    <Col xs={8}><h5 className="mb-0">Interest Rate</h5></Col>
                                    <Col xs={4}><strong>{formatCurrency(item.rate, 2) || '-'}%</strong></Col>
                                  </Row>
                                  <Row className="mb-1" noGutters>
                                    <Col xs={8}><h5 className="mb-0">APR</h5></Col>
                                    <Col xs={4}><strong>{formatCurrency(item.apr, 4) || '-'}%</strong></Col>
                                  </Row>
                                  {
                                    !!Number(item.originationPercentage) && (
                                      <Row className="mb-1" noGutters>
                                        <Col xs={8}>
                                          <h5 className="mb-0">Origination Fee**</h5>
                                          <small>Included in monthly payment</small>
                                        </Col>
                                        <Col xs={4}><strong>{Number(item.originationPercentage) ? formatCurrency(Number(item.originationPercentage) * 100, 2) : '0'}%</strong></Col>
                                      </Row>
                                    )
                                  }
                                </Container>
                              </Col>
                            </Row>
                          </Container>
                        </Card>
                      </Col>
                    ))
                  }
                </Row>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col lg={10} xl={8} className="text-center">
                {
                  isZipTermExist &&
                    <p style={{ fontSize: '.8rem' }}>
                      * Your loan may have a No Interest on Principal Option Promotion included. This promotion can save you money if you pay off the principal amount of the loan in full within the Promotional Period (&#34;Promotional Period&#34;). During the Promotional Period you will be responsible for making all of your monthly payments and your loan will accrue interest on a monthly basis. If you pay off your loan within the Promotional Period, the monthly payments that you have made during this period, which includes accrued interest, will be deducted from the principal amount of the loan. Length of Promotional Periods vary, please review your loan agreement for full details.
                    </p>
                }
                {
                  isOriginationPercentageExist &&
                    <p style={{ fontSize: '.8rem' }}>
                      ** The Origination Fee may be up to 8% of the Amount Financed, is non-refundable, and is considered earned upon the funding of your loan. You can calculate the dollar amount of the Origination Fee for each offer listed above by multiplying the Amount Financed figure for that offer by .08 if the Origination Fee is 8%, by .05 if it is 5%, etc. For example, if the Origination Fee is 8% and if the Amount Financed is $1,000 the corresponding Origination Fee would be $80 ($1000 x .08 = $80). The total Principal Amount of your loan is the sum of the Amount Financed and the Origination Fee (i.e. if the Origination Fee is 8% and if the Amount Financed is $1,000 the Principal Amount of the loan would be $1080). Please review your Loan Agreement for additional terms and conditions.
                    </p>
                }
              </Col>
            </Row>
            <Modal
              isOpen={isModalShown}
              toggle={this.toggleModal}
              backdrop="static"
              centered
              size="lg"
            >
              <ModalHeader toggle={this.toggleModal} className="d-flex justify-content-center">
                <span className="flag-merchant bg-success">Merchant</span>&nbsp; Please Confirm the Following
              </ModalHeader>
              <ModalBody>
                <Row className="mb-1">
                  <Col sm={6} lg={4}>
                    <Input
                      name="channel.attributes.serviceProvider.phone"
                      label="Amount Financed"
                      isBadgeVisible={false}
                      value={formatCurrency(get(workflow, `state.data.offers.${selectedIndex}.approvalAmount`), 2)}
                      readOnly
                      isMasked={currencyMask}
                    />
                  </Col>
                  <Col sm={6} lg={4}>
                    <Input
                      name="channel.attributes.serviceProvider.phone"
                      label="Payout Amount"
                      isBadgeVisible={false}
                      value={formatCurrency(get(workflow, `state.data.offers.${selectedIndex}.payoutAmount`), 2)}
                      isMasked={currencyMask}
                      readOnly
                      errorMessage={confirmAmountOfSaleError}
                    />
                  </Col>
                  <Col sm={6} lg={4}>
                    <div className={cn('has-value', 'hasValue')}>
                      <span className="layerOrder">
                        Purchase/Service Date
                      </span>
                      <Datetime
                        name="channel.attributes.serviceProvider.phone"
                        label="Purchase/Service Date"
                        className={cn(className, 'dateTimeInput')}
                        value={purchaseDate || ''}
                        onChange={this.handleDateChange}
                        closeOnSelect
                        dateFormat="MM/DD/YY"
                        timeFormat={false}
                        renderInput={props => (
                          <Input
                            isMasked={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                            isRequired
                            isErrorVisible={false}
                            {...props}
                          />
                        )}
                      />
                      <div className="error">{purchaseDateError}</div>
                    </div>
                  </Col>
                  <Col sm={12} className="padded-bottom">
                    <Checkbox
                      label={['I certify that the amount taken only includes services or products to be rendered. No origination fees or any other finance fees have been added. Non compliances will result in all funds being charged back and loan cancellation. Additionally, it is understood that I am not to attempt to collect additional fees directly from the customer in order to make up for the discount fees that I am incurring.']}
                      name="hasApplicationConsented"
                      onChange={this.handleCheckboxChange.bind(null, 'isChecked1')}
                      isChecked={isChecked1}
                      id="hasApplicationConsented"
                      errorMessage={isChecked1Error}
                    />
                  </Col>
                  <Col sm={12} className="padded-bottom">
                    <Checkbox
                      label={['I certify that I have identified the borrower with a valid government issued ID and have retained a copy for my records which will be provided to LendingUSA upon request.']}
                      name="isCertified"
                      onChange={this.handleCheckboxChange.bind(null, 'isChecked2')}
                      isChecked={isChecked2}
                      id="isCertified"
                      errorMessage={isChecked2Error}
                    />
                  </Col>
                  <Col sm={12} className="mt-2">
                    <Input
                      name="channel.attributes.serviceProvider.phone"
                      label="Authorized Representative Signature"
                      onChange={this.handleChange}
                      isBadgeVisible={false}
                      value={signature}
                      errorMessage={signatureError}
                      className="mb-1"
                    />
                  </Col>
                  <Col lg={{ size: 4, offset: 4 }}>
                    <Button
                      className={cn('large arrow w-100 mb-1')}
                      onClick={this.handleFinalizeSale}
                      isLoading={isLoading}
                      color="primary"
                      size="lg"
                      style={{ padding: '12px 0 14px' }}
                    >
                      Finalize Sale
                    </Button>
                  </Col>
                </Row>
              </ModalBody>
            </Modal>
          </Container>
        </div>
        :
        <div />
    );
  }
}

CreditAppDecision.propTypes = {
  className: PropTypes.string,
  history: PropTypes.object.isRequired,
  nextAction: PropTypes.func.isRequired,
  checkPreviousAction: PropTypes.func.isRequired,
  updateOffer: PropTypes.func.isRequired,
  workflow: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

CreditAppDecision.defaultProps = {
  className: '',
};

export default compose(
  withRouter,
  connect(
    state => ({
      workflow: state.workflow,
    }),
    {
      nextAction,
      updateOffer,
      checkPreviousAction,
    }
  )
)(CreditAppDecision);
