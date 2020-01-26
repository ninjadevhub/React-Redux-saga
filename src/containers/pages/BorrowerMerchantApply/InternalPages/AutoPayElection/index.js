import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cn from 'classnames';
import { compose } from 'redux';

import FormGroup from 'components/Form/FormGroup';
import Input from 'components/Form/Input';
import FormGroupLabel from 'components/FormGroupLabel';
import { Button, ButtonLink } from 'components/Button';
import Checkbox from 'components/Form/Checkbox';
import Select from 'components/Form/Select';
import Validator from 'components/Validator/Validator';
import Plaid from 'components/Plaid';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import ReactLoading from 'react-loading-components';
import get from 'lodash/get';
import {
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Badge,
} from 'reactstrap';


import {
  nextAction,
  checkPreviousAction,
} from 'actions/workflow';
import { parseUrlParams } from 'utils/parseUrlParams';

import schema from './schema';

const numberMask = createNumberMask({
  prefix: '',
  thousandsSeparatorSymbol: '',
  allowLeadingZeroes: true,
});

class AutoPayElection extends Component {
  state = {
    // eslint-disable-next-line
    isChecked: false,
    isLoading: false,
    isPopupVisible: false,
    isPreloaded: false,
    isPlaidVisible: false,
    isBankAcountLoading: false,
  };

  componentWillMount() {
    const params = parseUrlParams(window.location.search);
    const { history, workflow, validator: { setValues } } = this.props;
    if (get(workflow, 'state.data') === undefined) {
      history.push(`/applications/${this.props.match.params.workflowtype}/checkin?applicationId=${params.applicationId || ''}`);
    }
    if (!params.applicationId) {
      this.props.history.push(`/applications/${this.props.match.params.workflowtype}/application`);
    } else {
      this.props.checkPreviousAction({
        data: {},
        url: `/workflows/application/${params.applicationId}/workflow/${this.props.match.params.workflowtype}/checkin`,
        success: (response) => {
          const routeUrl = response.state && response.state.url;
          this.props.history.push(routeUrl);
          const initialBankData = {
            accountHolderName: get(response, 'state.data.bankAccount.accountHolderName') || '',
            bankName: get(response, 'state.data.bankAccount.bankName') || '',
            routingNumber: get(response, 'state.data.bankAccount.routingNumber') || '',
            accountNumber: get(response, 'state.data.bankAccount.accountNumber') || '',
            accountType: get(response, 'state.data.bankAccount.accountType') || 'checking',
            IsPlaidComplete: false,
          };
          setValues(initialBankData);
          if (get(response, 'state.data.bankAccount.accountHolderName')) {
            this.setState({
              isPreloaded: true,
            });
          }
        },
        // eslint-disable-next-line
        fail: (error) => {
          this.props.history.replace(`/applications/${this.props.match.params.workflowtype}/application?applicationId=${params.applicationId}`);
        },
      });
    }
  }

  setFormRef = (el) => { this.form = el; }

  toggleModal = () => {
    this.setState(({ isModalShown }) => ({ isModalShown: !isModalShown }));
  }

  handleCheckboxChange = (name, value) => {
    const { validator: { onChangeHandler } } = this.props;
    onChangeHandler(name, value);
  }

  handleInputChange = (event) => {
    const { validator: { onChangeHandler } } = this.props;
    onChangeHandler(event.target.name, event.target.value);
  };

  handleSubmitForm = (e) => {
    e.preventDefault();
    const params = parseUrlParams(window.location.search);
    if (params.applicationId) {
      const { validator: { values, validate } } = this.props;
      if ((values.isSelfSubmitted === 1 && validate(schema).isValid) || (values.isSelfSubmitted === 2)) {
        this.setState({
          isLoading: true,
        });
        this.props.nextAction({
          data: {
            ...values,
            isAutoPay: values.isSelfSubmitted === 1,
          },
          url: `/workflows/application/${params.applicationId}/workflow/${this.props.match.params.workflowtype}/next`,
          success: (response) => {
            const routeUrl = response.state && response.state.url;
            this.props.history.push(routeUrl);
          },
          // eslint-disable-next-line
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
      } else {
        validate(schema);
      }
    }
  }

  togglePopup = (e) => {
    e.preventDefault();
    this.setState(prev => ({ isPopupVisible: !prev.isPopupVisible }));
  }

  handlePlaidSuccess = (publicToken, metadata, sessionId) => {
    const params = parseUrlParams(window.location.search);
    const { validator: { setValues } } = this.props;
    if (params.applicationId) {
      this.setState({
        isPlaidVisible: false,
        isBankAcountLoading: true,
      });
      this.props.nextAction({
        data: {
          isPlaidComplete: true,
          plaidSessionId: sessionId,
          publicToken: {
            linkSessionId: get(metadata, 'link_session_id'),
            publicToken,
            account: {
              accountId: get(metadata, 'account.id'),
              mask: get(metadata, 'account.mask'),
              name: get(metadata, 'account.name'),
              subtype: get(metadata, 'account.subtype'),
              type: get(metadata, 'account.type'),
            },
            institution: {
              institutionId: get(metadata, 'institution.institution_id'),
              name: get(metadata, 'institution.name'),
            },
          },
        },
        url: `/workflows/application/${params.applicationId}/workflow/${this.props.match.params.workflowtype}/next`,
        success: (response) => {
          const routeUrl = response.state && response.state.url;
          if (get(response, 'state.data.isReady')) {
            this.props.history.push(routeUrl);
          } else {
            this.timerId = setInterval(() => {
              if (get(response, ['state', 'data', 'isReady']) === false) {
                this.props.checkPreviousAction({
                  data: {},
                  url: `/workflows/application/${params.applicationId}/workflow/${this.props.match.params.workflowtype}/checkin`,
                  success: (response1) => {
                    if (get(response1, 'state.data.isReady')) {
                      const initialBankData = {
                        accountHolderName: get(response1, 'state.data.bankAccount.accountHolderName') || '',
                        bankName: get(response1, 'state.data.bankAccount.bankName') || '',
                        routingNumber: get(response1, 'state.data.bankAccount.routingNumber') || '',
                        accountNumber: get(response1, 'state.data.bankAccount.accountNumber') || '',
                        accountType: get(response1, 'state.data.bankAccount.accountType') || 'checking',
                        IsPlaidComplete: false,
                      };
                      this.setState({
                        isBankAcountLoading: false,
                      });
                      setValues(initialBankData);
                      clearTimeout(this.timerId);
                    }
                  },
                  // eslint-disable-next-line
                  fail: (error) => {
                    this.props.history.replace(`/applications/${this.props.match.params.workflowtype}/application?applicationId=${params.applicationId}`);
                  },
                });
              } else if (get(response, ['state', 'data', 'isReady']) === true) {
                const initialBankData = {
                  accountHolderName: get(response, 'state.data.bankAccount.accountHolderName') || '',
                  bankName: get(response, 'state.data.bankAccount.bankName') || '',
                  routingNumber: get(response, 'state.data.bankAccount.routingNumber') || '',
                  accountNumber: get(response, 'state.data.bankAccount.accountNumber') || '',
                  accountType: get(response, 'state.data.bankAccount.accountType') || 'checking',
                  IsPlaidComplete: false,
                };
                this.setState({
                  isBankAcountLoading: false,
                });
                setValues(initialBankData);
                clearTimeout(this.timerId);
              }
            }, 5000);
          }
        },
        // eslint-disable-next-line
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

  handlePlaidExit = () => {
    this.setState({ isPlaidVisible: false });
  }

  togglePlaid = () => {
    this.setState({ isPlaidVisible: true });
  }

  render() {
    const { validator: { values, errors, isValid } } = this.props;
    const { isLoading, isPopupVisible, isPreloaded, isPlaidVisible, isBankAcountLoading } = this.state;

    if (this.form && !isValid) {
      const errs = Object.keys(errors);
      this.form[errs[0]].focus();
      window.scrollTo(0, 450);
    }

    return (
      <div className="page-autopay">
        <form
          onSubmit={this.handleSubmitForm.bind(null, values)}
          ref={this.setFormRef}
          className="container"
        >
          <Container fluid>
            <Row>
              <Row>
                <Col sm={12} lg={{ size: 8, offset: 2 }} className="mb-4">
                  <h2 className="mb-1" style={{ fontSize: '3rem' }}>Auto-Pay Election</h2>
                  <p className="p-large" style={{ lineHeight: 1.6, color: '#797a93' }}>
                    Enroll in optional ACH Auto-Pay for free and never miss a payment again.<br />
                    <em style={{ color: '#002147', fontStyle: 'normal' }}>
                      Plus enroll in optional ACH Auto-Pay and you could earn a <strong>$25 Statement Credit</strong>.*
                      <ButtonLink onClick={this.togglePopup} style={{ color: '#797a93', textDecoration: 'underline', fontSize: 16 }}>
                        View Details
                      </ButtonLink>
                    </em>
                  </p>
                  <h5 className="d-flex mb-0">
                    <Badge color="warning">NEW</Badge>&nbsp;Need help setting up Auto-Pay?&nbsp;
                    <ButtonLink
                      onClick={this.togglePlaid}
                      className="viewDetailCheckbox"
                    >
                      Click here to continue
                    </ButtonLink>
                  </h5>
                </Col>
                <Col sm={12} lg={{ size: 8, offset: 2 }}>
                  <FormGroup className="form-group">
                    <FormGroupLabel value="Bank ACH Information" />
                    {
                      !isBankAcountLoading ?
                        <Row>
                          <Col sm={12} md={6}>
                            <Input
                              label="Bank Name"
                              isRequired
                              value={values.bankName}
                              onChange={this.handleInputChange}
                              name="bankName"
                              hasError={!!errors.bankName}
                              errorMessage={errors.bankName}
                            />
                          </Col>
                          <Col sm={12} md={6}>
                            <Input
                              name="accountHolderName"
                              label="Name on Account"
                              isRequired
                              value={values.accountHolderName}
                              onChange={this.handleInputChange}
                              hasError={!!errors.accountHolderName}
                              errorMessage={errors.accountHolderName}
                              isDisabled={isPreloaded}
                            />
                          </Col>
                          <Col sm={12} md={6}>
                            <Input
                              name="routingNumber"
                              label="ABA Routing Number"
                              onChange={this.handleInputChange}
                              isRequired
                              value={values.routingNumber}
                              isMasked={[/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                              hasError={!!errors.routingNumber}
                              errorMessage={errors.routingNumber}
                            />
                          </Col>
                          <Col sm={12} md={6}>
                            <Input
                              name="accountNumber"
                              label="Account Number"
                              onChange={this.handleInputChange}
                              isRequired
                              value={values.accountNumber}
                              isMasked={numberMask}
                              hasError={!!errors.accountNumber}
                              errorMessage={errors.accountNumber}
                            />
                          </Col>
                          <Col sm={12} md={6}>
                            <FormGroup className="dropdown-toggle mb-0 pb-0">
                              <Select
                                data={[
                                  { value: 'Checking', title: 'Checking' },
                                  { value: 'Savings', title: 'Savings' },
                                ]}
                                name="accountType"
                                label="Account Type"
                                placeholder="Select..."
                                onChange={this.handleInputChange}
                                isRequired
                                hasError={!!errors.accountType}
                                errorMessage={errors.accountType}
                                value={values.accountType}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        :
                        <Row>
                          <Col sm={12}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 500 }}>
                              <ReactLoading type="puff" fill="#3989E3" width={100} height={100} />
                            </div>
                          </Col>
                        </Row>
                    }
                  </FormGroup>
                  <FormGroup className="form-group">
                    <FormGroupLabel value="Enroll in Auto-Pay" />
                    <Row>
                      <Col sm={12} className="padded-bottom padded-bottom-small">
                        <Row>
                          <Col sm={12} md={6} className="radio-container">
                            <div className={cn('select-highlight autopay-election', (values.isSelfSubmitted === 1 || !values.isSelfSubmitted) && 'selected')} />
                            <Checkbox
                              label={[
                                <strong>YES</strong>,
                                <Fragment>  &nbsp;–&nbsp;  </Fragment>,
                                'I want to enroll in ACH Auto-Pay and become eligible to receive a $25 statement credit!',
                                <Fragment> &nbsp;</Fragment>,
                                <ButtonLink onClick={this.togglePopup} className="viewDetailCheckbox">View Details</ButtonLink>,
                              ]}
                              className="checkboxLabel"
                              name="isSelfSubmitted"
                              onChange={this.handleCheckboxChange.bind(null, 'isSelfSubmitted', 1)}
                              isChecked={values.isSelfSubmitted === 1}
                              value="on"
                              id="isSelfSubmitted"
                              type="radio"
                            />
                            <small style={{ marginTop: 15, marginLeft: 22, color: '#797a93' }}>Paying via ACH Auto-Pay is FREE and assures you pay on time each month.</small>
                          </Col>
                          <Col sm={12} md={6} className={cn('padded-bottom-small', 'radio-container')}>
                            <div className={cn('select-highlight autopay-election', values.isSelfSubmitted === 2 && 'selected')} />
                            <Checkbox
                              label={[
                                <strong>NO</strong>,
                                <Fragment> &nbsp;-&nbsp; </Fragment>,
                                'I do not want to Enroll in ACH Auto-Pay at this time.',
                              ]}
                              className="checkboxLabel"
                              name="isSelfSubmitted"
                              onChange={this.handleCheckboxChange.bind(null, 'isSelfSubmitted', 2)}
                              isChecked={values.isSelfSubmitted === 2}
                              id="isSelfSubmittedNo"
                              value="off"
                              type="radio"
                            />
                          </Col>
                          <Col sm={12} md={6} className={cn('padded-bottom-small', 'radio-container')}>
                            <span className="error">{errors.isSelfSubmitted}</span>
                          </Col>
                        </Row>
                      </Col>
                      <Col sm={12} className="mt-1">
                        <p style={{ color: '#797a93' }}>
                          <em style={{ color: '#002147', fontStyle: 'normal' }}>Please Note:</em> Enrolling in ACH Auto-Pay is optional. The Bank&apos;s credit decision is not dependent on whether you enroll in ACH Auto-Pay. You can change your method of payment at any time in the future.
                        </p>
                      </Col>
                      <Col sm={12} lg={12} className="mb-1">
                        <Button
                          className={cn('large w-100 mt-2 bg-success', isLoading ? '' : 'arrow')}
                          onClick={this.handleSubmitForm}
                          isLoading={isLoading}
                          color="primary"
                        >
                          Save & Continue
                        </Button>
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>
              </Row>
            </Row>
          </Container>
          {
            isPlaidVisible &&
              <Plaid
                onPlaidSuccess={this.handlePlaidSuccess}
                onPlaidExit={this.handlePlaidExit}
              />
          }
          {/* <!-- Disclaimer Modal --> */}
          <Modal
            isOpen={isPopupVisible}
            toggle={this.togglePopup}
            backdrop="static"
            centered
            size="md"
          >
            <ModalHeader toggle={this.togglePopup}>
              Promotion Details
            </ModalHeader>
            <ModalBody>
              <p>*To qualify for the $25 Statement Credit (“Statement Credit”) Promotion (“Promotion”), you must enroll in optional ACH Auto-Pay (“Auto-Pay”) at the same time that you execute your loan agreement with Cross River Bank and successfully complete your first three (3) scheduled monthly payments using Auto-Pay. Each monthly payment must post to your loan account prior to the expiration of any applicable grace period as defined in your loan agreement. You understand that you are not required to enroll in Auto-Pay unless you want to take advantage of this promotional offer, and your willingness to enroll in Auto-Pay will not affect Cross River Bank’s credit decision regarding your loan application. Limit one (1) Statement Credit per loan. Promotion cannot be transferred or assigned. After your first three (3) scheduled monthly Auto-Pay payments successfully post to your loan account, the Statement Credit will reflect on your next scheduled loan statement. The Statement Credit will be applied to your loan account pursuant to the ‘Application of Payments’ section in your Loan Agreement. Enrollment for the Statement Credit/Promotion must be made before December 31<sup>st</sup>, 2020. This Promotion is subject to change or discontinuation without notice.
              </p>
            </ModalBody>
          </Modal>
          {/* <!-- End Disclaimer Modal --> */}
        </form>
      </div>
    );
  }
}

AutoPayElection.propTypes = {
  history: PropTypes.object.isRequired,
  nextAction: PropTypes.func.isRequired,
  validator: PropTypes.object.isRequired,
  workflow: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  checkPreviousAction: PropTypes.func.isRequired,
};

AutoPayElection.defaultProps = {
};

export default compose(
  Validator(schema),
  connect(
    state => ({
      auth: state.auth,
      workflow: state.workflow,
    }),
    {
      nextAction,
      checkPreviousAction,
    }
  )
)(AutoPayElection);
