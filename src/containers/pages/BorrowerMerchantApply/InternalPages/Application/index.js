import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import cn from 'classnames';
import emailMask from 'text-mask-addons/dist/emailMask';
import get from 'lodash/get';
import pickBy from 'lodash/pickBy';

import Validator from 'components/Validator/Validator';
import FormGroupLabel from 'components/FormGroupLabel';
import LoanAmountRequested from 'components/LoanAmountRequested';
import Input from 'components/Form/Input';
import Select from 'components/Form/Select';
import Checkbox from 'components/Form/Checkbox';
import { Button, VerifyButton } from 'components/Button';
import Sidebar from 'components/Sidebar';
import Popup from 'components/Popup';
import PopoverCheckbox from 'components/Form/PopoverCheckbox';
import {
  Container, Row, Col, FormGroup,
} from 'reactstrap';
import { appConfig } from 'config/appConfig';

import { checkinAction } from 'actions/workflow';

import { verifyAddress } from 'utils/verifyAddress';
import { toTitleCase } from 'utils/toTitleCase';
import { unSupportedStates } from 'utils/unSupportedStates';
import { parseUrlParams } from 'utils/parseUrlParams';
import { currencyMask, unmask, numberUnmask, floatUnmask } from 'utils/masks';
import { formatCurrency } from 'utils/formatCurrency';
import { getCurrentDate } from 'utils/func';
import { states } from 'utils/states';
import schema from './schema';
import { ELECTRONIC_CONSENT, TERMS_AND_CONDITIONS, CALLS_AND_MESSAGES } from './constants';

const params = parseUrlParams(window.location.search);
class Application extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // eslint-disable-next-line
      response: {},
      isLoading: false,
      isSubmitted: false,

      isAddressLoading: false,
      isAddressPopupVisible: false,
      isVerified: false,
      isFirstLoad: true,
      popupType: null,
      isVerifyButtonClicked: false,
      grossMonthlyIncomeDescription: null,
      isHeaderHidden: !localStorage.getItem('idToken') && (params.iframe === '1'),
      isRequestedAmountValid: !(Number(params.loanamount) > 35000 || Number(params.loanamount) < 1000),
      // show errors
      hasError: false,
      errorMessages: null,
      isPOBoxError: false,
    };
  }

  componentWillMount() {
    const { validator: { setValues } } = this.props;
    const initialFormData = {
      requestedAmount: params.amount ? params.amount : '1000.00',
      signatureBy: {
        date: getCurrentDate(),
      },
      isPersonReceivingService: true,
      merchant: {
        merchantId: localStorage.getItem('merchantId'),
        name: 'Dr.John Smith',
        phone: '111-111-1111',
      },
      channel: {
        code: 'dtm',
        name: 'DTM',
        type: 'dtm',
      },
      applicant: {
        firstName: params.fname,
        lastName: params.lname,
        email: params.email,
        addresses: {
          address: decodeURI(params.addr || ''),
          city: params.city,
          state: params.state,
          zipcode: params.zip,
        },
        phoneNumbers: {
          Number: params.phone,
        },
      },
      ConsentToReceiveMessages: false,
    };
    setValues(initialFormData);
  }

  setFormRef = (el) => { this.form = el; }

  processCheckInAction = (formData) => {
    this.setState({
      hasError: false,
      errorMessages: null,
      isLoading: true,
    });
    this.props.checkinAction({
      data: formData,
      url: `/workflows/application/workflow/${this.props.match.params.workflowtype}/start`,
      success: (res) => {
        this.setState({
          // eslint-disable-next-line
          response: res,
          isLoading: false,
          hasError: false,
          errorMessages: null,
        });
        if (get(res, 'state.data.IsDuplicate')) {
          this.props.history.push({
            search: '',
            pathname: `/applications/${this.props.match.params.workflowtype}/duplicate-declined`,
            state: {
              data: get(res, 'data'),
            },
          });
        } else {
          console.log(res.state.url);
          this.props.history.push(res.state.url);
        }
      },
      fail: (error) => { // eslint-disable-line
        if (error && error.status === 400) {
          this.setState({
            isLoading: false,
            hasError: true,
            isSubmitted: false,
            errorMessages: error.data.errorMessages,
          });
        } else {
          this.props.history.push({
            pathname: `/applications/${this.props.match.params.workflowtype}/general-error-page`,
            search: '',
            state: {
              data: error.data,
            },
          });
        }
      },
    });
  }

  handleSubmitForm = (data, e) => {
    e.preventDefault();
    const { validator: { validate, errors }, ipAddress } = this.props;
    this.setState({ isSubmitted: true });
    const isAddressValid = appConfig.smartyStreetEnforce ? this.state.isVerified : true;
    if (validate(schema).isValid && isAddressValid) {
      this.setState({
        isLoading: true,
      });
      let iframe = '';
      switch (params.iframe) {
        case 'true':
        case '1':
          iframe = 1;
          break;
        case 'false':
        case '0':
          iframe = 0;
          break;
        default:
          iframe = 0;
          break;
      }
      const Parameters = pickBy({
        pid: params.pid || '',
        iframe: iframe || '',
        utm_source: params.utm_source ? decodeURI(params.utm_source) : params.utm_source,
        utm_medium: params.utm_medium ? decodeURI(params.utm_medium) : params.utm_medium,
        utm_campaign: params.utm_campaign ? decodeURI(params.utm_campaign) : params.utm_campaign,
        aid: params.aid,
        referenceId: params.referenceId,
      }, item => item !== undefined);
      const formData = {
        ...data,
        requestedAmount: floatUnmask(data.requestedAmount),
        merchant: {
          ...data.merchant,
          merchantId: localStorage.getItem('merchantId') ? localStorage.getItem('merchantId') : params.pid,
        },
        applicant: {
          ...data.applicant,
          firstName: (data.applicant.firstName).trim(),
          lastName: (data.applicant.lastName).trim(),
          addresses: [{
            ...data.applicant.addresses,
            country: 'USA',
          }],
          phoneNumbers: [
            {
              Type: 'Mobile',
              Number: numberUnmask(data.applicant.phoneNumbers.Number),
            },
          ],
          ssn: numberUnmask(data.applicant.ssn),
        },
        financials: {
          stated: {
            ...data.financials.stated,
            source: 'application',
            grossMonthlyIncome: floatUnmask(data.financials.stated.grossMonthlyIncome),
            monthlyRentOrMortage: floatUnmask(data.financials.stated.monthlyRentOrMortage),
            employerPhone: data.financials.stated.employerPhone ? numberUnmask(data.financials.stated.employerPhone) : '',
          },
        },
        referral: {
          affiliateId: params.aid,
          sourceIP: ipAddress,
          url: window.location.href,
        },
        Parameters,
        signatureBy: {
          ...data.signatureBy,
          name: (data.signatureBy.name).trim(),
        },
      };
      // restrict PO BOX address
      verifyAddress(data.applicant.addresses).then((response) => {
        if (response) {
          if (get(response, 'metadata.recordType') === 'P') {
            this.setState({
              isLoading: false,
              hasError: true,
              isSubmitted: true,
              isPOBoxError: true,
            });
          } else {
            this.processCheckInAction(formData);
          }
        } else {
          this.processCheckInAction(formData);
        }
      }).catch((error) => { // eslint-disable-line
        this.processCheckInAction(formData);
      });
    } else {
      console.log('api error', errors, !this.state.isVerified && 'address is not verified');
    }
  };

  handleInputChange = (event) => {
    const { validator: { onChangeHandler } } = this.props;
    switch (event.target.name) {
      case 'applicant.addresses.state':
        this.initializeAddressState();
        onChangeHandler(event.target.name, event.target.value);
        break;
      case 'applicant.firstName':
      case 'applicant.lastName':
        onChangeHandler(event.target.name, (event.target.value).replace(/[^a-zA-Z '-]/g, ''));
        break;
      case 'financials.stated.employerName':
        onChangeHandler(event.target.name, (event.target.value).replace(/[^a-zA-Z0-9- ']/g, ''));
        break;
      case 'applicant.addresses.zipcode':
        this.initializeAddressState();
        onChangeHandler(event.target.name, event.target.value);
        break;
      case 'applicant.addresses.address':
      case 'applicant.addresses.city':
        this.initializeAddressState();
        onChangeHandler(event.target.name, (event.target.value).replace(/[^a-zA-Z0-9- ']/g, ''));
        break;
      case 'financials.stated.grossMonthlyIncome':
        onChangeHandler(event.target.name, event.target.value);
        this.setState({
          grossMonthlyIncomeDescription: null,
        });
        break;
      default:
        onChangeHandler(event.target.name, event.target.value);
    }
  };

  initializeAddressState = () => {
    this.setState({
      isVerified: false,
      isSubmitted: false,
      isVerifyButtonClicked: false,
      isPOBoxError: false,
    });
  }

  handleCheckboxChange = (name, value) => {
    const { validator: { onChangeHandler } } = this.props;
    onChangeHandler(name, value);
  };

  handleSliderChange = (value) => {
    const { validator: { onChangeHandler } } = this.props;
    onChangeHandler('requestedAmount', value);
    this.setState({
      isRequestedAmountValid: true,
    });
  };

  handleSetValues = (e) => {
    e.preventDefault();
    const { validator: { setValues } } = this.props;
    const formValues = {
      requestedAmount: '4320.00',
      merchantId: localStorage.getItem('merchantId'),
      channel: {
        code: 'dtm',
        name: 'DTM',
        type: 'dtm',
      },
      applicant: {
        firstName: 'EUNICE',
        lastName: 'BOLT',
        addresses: {
          address: '400 ELIZABETH ST',
          city: 'CHARLEROI',
          state: 'PA',
          zipcode: '15022',
        },
        dateOfBirth: '02/20/1948',
        ssn: '666386118',
        email: 'john.doe9010@lendingusa.com',
        phoneNumbers: {
          Number: '(919) 780-8674',
        },
      },
      financials: {
        stated: {
          grossMonthlyIncome: '$ 5,000.00',
          rentOrOwn: 2,
          monthlyRentOrMortage: '$ 1,500.00',
          employmentStatus: 'employed',
          employerName: 'John',
          employerPhone: '(233) 446-5342',
          employmentYears: 1,
        },
      },
      isPersonReceivingService: true,
      signatureBy: {
        name: 'EUNICE BOLT',
        date: getCurrentDate(),
      },
      ConsentToReceiveMessages: true,
      ConsentElectronicCommunication: true,
      ConsentToTermsAndConditions: true,
      Parameters: {
        pid: params.pid || '',
        iframe: params.iframe || '',
      },
    };
    setValues(formValues);
    this.setState({
      isPOBoxError: false,
    });
  }

  handleBlur = (event) => {
    event.preventDefault();

    const { validator: { onChangeHandler, values } } = this.props;
    switch (event.target.name) {
      case 'requestedAmount':
        onChangeHandler(event.target.name, formatCurrency(floatUnmask(event.target.value || '0'), 2));
        break;
      case 'applicant.addresses.state':
        if (unSupportedStates.indexOf(event.target.value) !== -1) {
          this.setState({
            isAddressPopupVisible: true,
            isAddressLoading: false,
            popupType: 4,
          });
        } else if (this.state.isFirstLoad && get(values, 'applicant.addresses.city') && get(values, 'applicant.addresses.address')) {
          this.verifySmartyStreet({
            zipcode: get(values, 'applicant.addresses.zipcode'),
            address: get(values, 'applicant.addresses.address'),
            city: get(values, 'applicant.addresses.city'),
            state: event.target.value,
          });
        }
        break;
      case 'applicant.addresses.zipcode':
        if (this.state.isFirstLoad && get(values, 'applicant.addresses.city') && get(values, 'applicant.addresses.state') && get(values, 'applicant.addresses.address')) {
          this.verifySmartyStreet({
            zipcode: event.target.value,
            address: get(values, 'applicant.addresses.address'),
            city: get(values, 'applicant.addresses.city'),
            state: get(values, 'applicant.addresses.state'),
          });
        }
        onChangeHandler(event.target.name, toTitleCase(event.target.value));
        break;
      case 'applicant.addresses.address':
        if (this.state.isFirstLoad && get(values, 'applicant.addresses.city') && get(values, 'applicant.addresses.state')) {
          this.verifySmartyStreet({
            zipcode: get(values, 'applicant.addresses.zipcode'),
            address: toTitleCase(event.target.value),
            city: get(values, 'applicant.addresses.city'),
            state: get(values, 'applicant.addresses.state'),
          });
        }
        onChangeHandler(event.target.name, toTitleCase(event.target.value));
        break;
      case 'applicant.addresses.city':
        if (this.state.isFirstLoad && get(values, 'applicant.addresses.address') && get(values, 'applicant.addresses.state')) {
          this.verifySmartyStreet({
            zipcode: get(values, 'applicant.addresses.zipcode'),
            address: get(values, 'applicant.addresses.address'),
            city: toTitleCase(event.target.value),
            state: get(values, 'applicant.addresses.state'),
          });
        }
        onChangeHandler(event.target.name, toTitleCase(event.target.value));
        break;
      case 'applicant.email':
        onChangeHandler(event.target.name, event.target.value.toLowerCase());
        break;
      case 'financials.stated.grossMonthlyIncome':
        if (Number(unmask(event.target.value)) > 41600 || Number(unmask(event.target.value)) < 1) {
          this.setState({
            grossMonthlyIncomeDescription: 'The amount you entered must be your gross MONTHLY income.',
          });
        }
        onChangeHandler(event.target.name, event.target.value ? formatCurrency(floatUnmask(event.target.value), 2) : '');
        break;
      case 'financials.stated.monthlyRentOrMortage':
        onChangeHandler(event.target.name, event.target.value ? formatCurrency(floatUnmask(event.target.value), 2) : '');
        break;
      default:
        onChangeHandler(event.target.name, toTitleCase(event.target.value));
    }
  }

  handleAbort = () => {
    this.setState({
      isAddressPopupVisible: false,
    });
  }

  handleVerifyAddressClick = (e) => {
    e.preventDefault();

    const { validator: { values } } = this.props;

    if (!get(values, 'applicant.addresses.address')) {
      this.setState({
        isAddressPopupVisible: true,
        popupType: 1,
        isVerifyButtonClicked: true,
      });
    } else {
      this.verifySmartyStreet({
        address: get(values, 'applicant.addresses.address'),
        city: get(values, 'applicant.addresses.city'),
        state: get(values, 'applicant.addresses.state'),
        zipcode: get(values, 'applicant.addresses.zipcode'),
      });
    }
  }

  handleUndo = (e) => {
    e.preventDefault();

    const { validator: { values, setValues } } = this.props;
    const addressData = {
      ...values,
      address: get(this.state, 'prevAddresses.address'),
      city: get(this.state, 'prevAddresses.city'),
      state: get(this.state, 'prevAddresses.state'),
      zipcode: get(this.state, 'prevAddresses.zipcode'),
    };

    this.setState({
      isVerified: false,
    });
    setValues(addressData);
  }

  verifySmartyStreet = ({ address, city, state, zipcode }) => {
    const { validator: { values, setValues } } = this.props;

    this.setState({
      isAddressLoading: true,
      isVerifyButtonClicked: true,
    });

    verifyAddress({ zipcode, address, city, state }).then((response) => {
      if (response) {
        if (get(response, 'metadata.recordType') === 'P') {
          this.setState({
            isAddressPopupVisible: true,
            isAddressLoading: false,
            isVerified: false,
            popupType: 3,
            isFirstLoad: false,
          });
        } else {
          const addressData = {
            ...values,
            applicant: {
              ...values.applicant,
              addresses: {
                ...values.applicant.addresses,
                address: response.deliveryLine1,
                city: get(response, 'components.cityName'),
                state: get(response, 'components.state'),
                zipcode: `${response.deliveryPointBarcode}`.slice(0, 5),
              },
            },
          };
          const hasOptional = `${get(response, 'analysis.footnotes', '')}`.indexOf('H#') !== -1;
          this.setState({
            isVerified: true,
            isAddressLoading: false,
            isFirstLoad: false,
            // eslint-disable-next-line
            prevAddresses: { address, city, state, zipcode },
            popupType: hasOptional ? 5 : null,
            isAddressPopupVisible: hasOptional,
          });
          setValues(addressData);
        }
      } else {
        this.setState({
          isAddressPopupVisible: true,
          isAddressLoading: false,
          isFirstLoad: false,
          isVerified: false,
          popupType: 2,
        });
      }
    }).catch((error) => { // eslint-disable-line
      this.setState({
        isAddressLoading: false,
        popupType: 1,
        isFirstLoad: false,
        isVerified: false,
      });
    });
  }

  render() {
    const { className, validator: { values, errors, isValid } } = this.props;
    const {
      isLoading,
      isAddressLoading,
      isAddressPopupVisible,
      isVerified,
      popupType,
      isSubmitted,
      isVerifyButtonClicked,
      grossMonthlyIncomeDescription,
      isHeaderHidden,
      isRequestedAmountValid,
      hasError,
      errorMessages,
      isPOBoxError,
    } = this.state;

    let isFormValid = isValid;
    if (!get(errors, 'applicant.addresses.address') && isSubmitted && !isVerified && appConfig.smartyStreetEnforce) {
      errors['applicant.addresses.address'] = isVerifyButtonClicked ? 'Address is not valid, please enter valid address' : 'Please click verify Address';
      isFormValid = false;
    }

    if (isPOBoxError) {
      errors['applicant.addresses.address'] = 'P.O. BOX address is not allowed';
      isFormValid = false;
    }

    if (this.form && !isFormValid && isSubmitted) {
      const errs = Object.keys(errors);
      this.form[errs[0]].focus();
      this.setState({ isSubmitted: false });
    }

    const employmentStatus = get(values, 'financials.stated.employmentStatus');
    const isEmploymentInfoRequired = !(employmentStatus === 'retired' || employmentStatus === 'unemployed' || employmentStatus === 'student');

    return (
      <form className={cn('container', className)} onSubmit={this.handleSubmitForm.bind(null, values)} ref={this.setFormRef}>
        {
          appConfig.env !== 'production' &&
            <Button
              onClick={this.handleSetValues}
              color="primary mb-1"
              style={{
                position: 'absolute',
                left: 50,
              }}
            >
              Set values
            </Button>
        }
        <Container fluid className={(appConfig.env !== 'production') && 'pt-5'}>
          <Row>
            <Col className="small-12 medium-12">
              <h2>Check Your Rate</h2>
              <p className="p-large">Checking your rate takes seconds and won&apos;t impact your credit score<span style={{ fontFamily: 'none' }}>&#10013;</span></p>
            </Col>
          </Row>
          <Row>
            <Col lg={8}>
              <FormGroup className="form-group">
                <LoanAmountRequested
                  amount={values.requestedAmount}
                  onChange={this.handleSliderChange}
                  onBlur={this.handleBlur}
                  hasError={!!errors.requestedAmount}
                  errorMessage={errors.requestedAmount}
                  style={{ marginTop: '40px', marginBottom: 0 }}
                />
                {
                  !isRequestedAmountValid &&
                    <div className="error">Loan Amount should be between $1,000.00 and $35,000.00</div>
                }
              </FormGroup>

              <FormGroup className="form-group">
                <FormGroupLabel value="Personal Information" />
                <Row>
                  <Col sm={12} md={6}>
                    <p>Please provide the legal name and personal identity information for the primary borrower.</p>
                  </Col>
                  <Col sm={12} md={6}>
                    <p>Enter the address of the primary borrower above. Must be a valid street address, no P.O. Boxes.</p>
                  </Col>
                  <Col sm={12} md={6}>
                    <Input
                      label="First Name"
                      name="applicant.firstName"
                      value={values.applicant && values.applicant.firstName}
                      onChange={this.handleInputChange}
                      isRequired
                      hasError={!!errors['applicant.firstName']}
                      errorMessage={errors['applicant.firstName']}
                      onBlur={this.handleBlur}
                    />
                  </Col>
                  <Col sm={12} md={6}>
                    <Input
                      label="Last Name"
                      name="applicant.lastName"
                      value={values.applicant && values.applicant.lastName}
                      onChange={this.handleInputChange}
                      isRequired
                      hasError={!!errors['applicant.lastName']}
                      errorMessage={errors['applicant.lastName']}
                      onBlur={this.handleBlur}
                    />
                  </Col>
                  <Col sm={12} md={12} className="positionRelative">
                    <Input
                      label="Street Address"
                      name="applicant.addresses.address"
                      value={values.applicant && values.applicant.addresses && values.applicant.addresses.address}
                      onChange={this.handleInputChange}
                      isRequired
                      hasError={!!errors['applicant.addresses.address']}
                      errorMessage={errors['applicant.addresses.address']}
                      onBlur={this.handleBlur}
                      className="streetAddress"
                    />
                    <VerifyButton
                      onClick={isVerified ? this.handleUndo : this.handleVerifyAddressClick}
                      isVerified={isVerified}
                      isLoading={isAddressLoading}
                    />
                    { isAddressPopupVisible &&
                      <Popup
                        handleOverride={this.handleOverride}
                        handleAbort={this.handleAbort}
                        type={popupType}
                        data={{
                          address: get(values, 'applicant.addresses.address'),
                          city: get(values, 'applicant.addresses.city'),
                          state: get(values, 'applicant.addresses.state'),
                          zipcode: get(values, 'applicant.addresses.zipcode'),
                        }}
                      />
                    }
                  </Col>
                  <Col sm={12} md={6}>
                    <Input
                      label="City"
                      name="applicant.addresses.city"
                      value={values.applicant && values.applicant.addresses && values.applicant.addresses.city}
                      onChange={this.handleInputChange}
                      isRequired
                      hasError={!!errors['applicant.addresses.city']}
                      errorMessage={errors['applicant.addresses.city']}
                      onBlur={this.handleBlur}
                    />
                  </Col>
                  <Col sm={12} md={6}>
                    <Row>
                      <Col sm={7}>
                        <FormGroup className="dropdown-toggle mb-0 pb-0">
                          <Select
                            name="applicant.addresses.state"
                            data={states}
                            value={values.applicant && values.applicant.addresses && values.applicant.addresses.state}
                            onChange={this.handleInputChange}
                            onBlur={this.handleBlur}
                            label="State"
                            isRequired
                            hasError={!!errors['applicant.addresses.state']}
                            errorMessage={errors['applicant.addresses.state']}
                          />
                        </FormGroup>
                      </Col>
                      <Col sm={5}>
                        <Input
                          label="Zip"
                          isMasked={[/\d/, /\d/, /\d/, /\d/, /\d/]}
                          name="applicant.addresses.zipcode"
                          value={values.applicant && values.applicant.addresses && values.applicant.addresses.zipcode}
                          onChange={this.handleInputChange}
                          isRequired
                          hasError={!!errors['applicant.addresses.zipcode']}
                          errorMessage={errors['applicant.addresses.zipcode']}
                        />
                      </Col>
                    </Row>
                    <Row id="ResidentAlert" className="hide">
                      <Col sm={12}>
                        <div className="alert callout">
                          <p>We currently do not accept loan applications for residents of the state of <span className="state">state</span>.</p>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col sm={12} md={6}>
                    <Input
                      label="Date of Birth"
                      name="applicant.dateOfBirth"
                      // eslint-disable-next-line
                      isMasked={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                      placeHolder="__/__/____"
                      value={values.applicant && values.applicant.dateOfBirth}
                      onChange={this.handleInputChange}
                      isRequired
                      hasError={!!errors['applicant.dateOfBirth']}
                      errorMessage={errors['applicant.dateOfBirth']}
                    />
                  </Col>
                  <Col sm={12} md={6}>
                    <Input
                      label="Social Security #"
                      name="applicant.ssn"
                      // eslint-disable-next-line
                      isMasked={[/\d/,/\d/,/\d/, '-', /\d/,/\d/, '-',/\d/,/\d/,/\d/,/\d/]}
                      placeHolder="___-__-____"
                      value={values.applicant && values.applicant.ssn}
                      onChange={this.handleInputChange}
                      isRequired
                      hasError={!!errors['applicant.ssn']}
                      errorMessage={errors['applicant.ssn']}
                    />
                  </Col>
                </Row>
              </FormGroup>

              <FormGroup className="form-group">
                <FormGroupLabel value="Contact Information" />
                <p>Please provide your email and mobile phone information to receive a loan status update.</p>
                <Row>
                  <Col sm={12} md={6}>
                    <Input
                      label="Email Address"
                      name="applicant.email"
                      isMasked={emailMask}
                      placeHolder="Email address"
                      value={values.applicant && values.applicant.email}
                      onChange={this.handleInputChange}
                      isRequired
                      hasError={!!errors['applicant.email']}
                      errorMessage={errors['applicant.email']}
                      onBlur={this.handleBlur}
                    />
                  </Col>
                  <Col sm={12} md={6}>
                    <Input
                      label="Mobile Phone"
                      name="applicant.phoneNumbers.Number"
                      placeHolder="(___) ___-____"
                      isMasked={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                      value={values.applicant && values.applicant.phoneNumbers && values.applicant.phoneNumbers.Number}
                      onChange={this.handleInputChange}
                      isRequired
                      hasError={!!errors['applicant.phoneNumbers.Number']}
                      errorMessage={errors['applicant.phoneNumbers.Number']}
                    />
                  </Col>
                </Row>
              </FormGroup>

              <FormGroup className="form-group">
                <FormGroupLabel value="Financials &amp; Employment" />
                <p>Your total verifiable gross income might include your salary, retirement income or other sources of income. You don&#39;t have to include alimony, child support, or separate maintenance income unless you want it considered as a basis for repayment</p>
                <Row>
                  <Col sm={12} md={6}>
                    <Input
                      label="Gross Monthly Income"
                      name="financials.stated.grossMonthlyIncome"
                      value={get(values, 'financials.stated.grossMonthlyIncome') !== undefined ? `${values.financials.stated.grossMonthlyIncome}` : ''}
                      onChange={this.handleInputChange}
                      isRequired
                      hasError={!!errors['financials.stated.grossMonthlyIncome'] || !!grossMonthlyIncomeDescription}
                      isMasked={currencyMask}
                      errorMessage={errors['financials.stated.grossMonthlyIncome'] || grossMonthlyIncomeDescription}
                      onBlur={this.handleBlur}
                    />
                  </Col>
                  <Col sm={12} md={6}>
                    <FormGroup className="dropdown-toggle mb-0 pb-0">
                      <Select
                        name="financials.stated.rentOrOwn"
                        data={[
                          { value: 1, title: 'Own' },
                          { value: 2, title: 'Rent' },
                          { value: 3, title: 'Live with parents' },
                          { value: 4, title: 'Others' },
                        ]}
                        value={`${values.financials && values.financials.stated && values.financials.stated.rentOrOwn}`}
                        onChange={this.handleInputChange}
                        label="Rent/Own"
                        isRequired
                        hasError={!!errors['financials.stated.rentOrOwn']}
                        errorMessage={errors['financials.stated.rentOrOwn']}
                      />
                    </FormGroup>
                  </Col>
                  <Col sm={12} md={6}>
                    <Input
                      label="Monthly Rent/Mortgage"
                      name="financials.stated.monthlyRentOrMortage"
                      value={get(values, 'financials.stated.monthlyRentOrMortage') !== undefined ? `${values.financials.stated.monthlyRentOrMortage}` : ''}
                      onChange={this.handleInputChange}
                      isRequired
                      hasError={!!errors['financials.stated.monthlyRentOrMortage']}
                      isMasked={currencyMask}
                      errorMessage={errors['financials.stated.monthlyRentOrMortage']}
                      onBlur={this.handleBlur}
                    />
                  </Col>
                  <Col sm={12} md={6}>
                    <FormGroup className="dropdown-toggle mb-0 pb-0">
                      <Select
                        name="financials.stated.employmentStatus"
                        data={[
                          { value: 'employed', title: 'Employed' },
                          { value: 'self-employed', title: 'Self-Employed' },
                          { value: 'unemployed', title: 'Unemployed' },
                          { value: 'student', title: 'Student' },
                          { value: 'retired', title: 'Retired' },
                          { value: 'military', title: 'Military' },
                        ]}
                        value={values.financials && values.financials.stated && values.financials.stated.employmentStatus}
                        onChange={this.handleInputChange}
                        label="Employment Status"
                        isRequired
                        hasError={!!errors['financials.stated.employmentStatus']}
                        errorMessage={errors['financials.stated.employmentStatus']}
                      />
                    </FormGroup>
                  </Col>
                  <Col sm={12} md={6}>
                    <Input
                      label="Employer Name"
                      name="financials.stated.employerName"
                      value={values.financials && values.financials.stated && values.financials.stated.employerName}
                      onChange={this.handleInputChange}
                      isRequired={isEmploymentInfoRequired}
                      hasError={!!errors['financials.stated.employerName']}
                      errorMessage={errors['financials.stated.employerName']}
                    />
                  </Col>
                  <Col sm={12} md={6}>
                    <Input
                      name="financials.stated.employerPhone"
                      isMasked={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                      label="Employer Phone"
                      placeHolder="(___) ___-____"
                      value={values.financials && values.financials.stated && values.financials.stated.employerPhone}
                      onChange={this.handleInputChange}
                      isRequired={isEmploymentInfoRequired}
                      hasError={!!errors['financials.stated.employerPhone']}
                      errorMessage={errors['financials.stated.employerPhone']}
                    />
                  </Col>
                  <Col sm={12} md={6}>
                    <FormGroup className="dropdown-toggle mb-0 pb-0">
                      <Select
                        name="financials.stated.employmentYears"
                        data={[
                          { value: 1, title: 'Less than 6 months' },
                          { value: 2, title: '6 months – 1 year' },
                          { value: 3, title: '1–2 Years' },
                          { value: 4, title: '2–3 Years' },
                          { value: 5, title: '3+ Years' },
                        ]}
                        value={`${values.financials && values.financials.stated && values.financials.stated.employmentYears}`}
                        onChange={this.handleInputChange}
                        label="Years with Current Employer"
                        isRequired={isEmploymentInfoRequired}
                        hasError={!!errors['financials.stated.employmentYears']}
                        errorMessage={errors['financials.stated.employmentYears']}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </FormGroup>

              <FormGroup className="form-group">
                <FormGroupLabel value="Your Signature" />
                <Row>
                  <Col sm={12} lg={8} className="padded-bottom">
                    <h6>Is the applicant above the person receiving the product/services?</h6>
                  </Col>
                  <Col sm={12} md={4} className="padded-bottom padded-bottom-small" style={{ display: 'flex' }}>
                    <Checkbox
                      label={['Yes']}
                      name="isPersonReceivingService"
                      onChange={this.handleCheckboxChange.bind(null, 'isPersonReceivingService', true)}
                      isChecked={values.isPersonReceivingService}
                      value="on"
                      id="isPersonReceivingService"
                      type="radio"
                    />
                    <Checkbox
                      label={['No']}
                      name="isPersonReceivingServiceNo"
                      onChange={this.handleCheckboxChange.bind(null, 'isPersonReceivingService', false)}
                      isChecked={!values.isPersonReceivingService}
                      id="isPersonReceivingServiceNo"
                      value="off"
                      type="radio"
                    />
                  </Col>
                  <Col sm={12} className="checkbox-row padded-bottom">
                    <h6>By checking the box below I agree to the following:</h6>
                  </Col>
                  <Col sm={12}>
                    <PopoverCheckbox
                      label={[ELECTRONIC_CONSENT]}
                      name="ConsentElectronicCommunication"
                      onChange={this.handleCheckboxChange.bind(null, 'ConsentElectronicCommunication')}
                      isChecked={values.ConsentElectronicCommunication}
                      id="ConsentElectronicCommunication"
                      errorMessage={errors.ConsentElectronicCommunication}
                    >
                      <b>CONSENT FOR ELECTRONIC SIGNATURES, RECORDS, AND DISCLOSURES (&#34;E-Consent&#34;)</b>
                      <br />
                      Please read this information carefully and print a copy and/or retain this information electronically for future reference.
                      <br />
                      <br />
                      <u><b>Introduction.</b></u> You are using this &apos;Portal&apos; or &apos;Website&apos; to submit a request for consumer financial services from Cross River Bank (the &#34;Bank&#34;), LendingUSA as operator of the Portal, and their assignees (hereinafter &#34;we,&#34; &#34;us,&#34; &#34;our,&#34; or &#34;Bank&#34;), among other services. To provide these services, we need your consent to using and accepting electronic signatures, records, and disclosures (&#34;E-Consent&#34;). This E-Consent notifies you of your rights when receiving disclosures, notices, and information from the Bank or LendingUSA as the operator of the Portal. By clicking &#34;I AGREE&#34; or other links assenting to our terms, you agree that you received this E-Consent and that you consent to using electronic signatures, records, and disclosures. Additionally, by clicking &#34;I AGREE&#34; or other links assenting to our terms, you consent to conduct transactions by using electronic disclosures, electronic records, and contract documents (&#34;Disclosures&#34;).
                      <br />
                      <br />
                      <u>Option for Paper or Non-Electronic Records.</u> You may request any Disclosures in paper copy by logging in and printing a paper copy. You may also mail your written request to LendingUSA, at the following address: 15303 Ventura Blvd. Suite 850, Sherman Oaks, CA 91403. We will provide paper copies at no charge. The Bank or its assignee will retain all Disclosures as applicable law requires.
                      <br />
                      <br />
                      <u><b>Scope of Consent.</b></u> This E-Consent applies to all interactions online concerning you and Bank and/or Lending USA and includes those interactions engaged in on any computer, electronic device, mobile device, including phones, smart-phones, fax machines, and tablets. Under this E-Consent, Bank and/or LendingUSA will process your information and interact during all online interactions with you electronically. The Disclosures you will receive electronically include federal disclosures, such as the Truth-in-Lending disclosures, Privacy Notices, and notices of our credit decisions, as well as state-specific notices. We will also send you notices electronically related to our interactions and transactions. This E-Consent informs you of your rights when receiving these Documents electronically.
                      <br /><br />
                      <u><b>Consenting to Do Business Electronically.</b></u> Before you decide to do business electronically with Bank and/or LendingUSA, you should consider whether you have the required hardware and software capabilities described below.
                      <br /><br />
                      <u><b>Hardware and Software Requirements.</b></u> To access and retain the Disclosures electronically, you will need to use a computer or device capable of accessing the Internet and an Internet Browser software program that supports at least 256 bit encryption, such as Microsoft® Internet Explorer 11+, Safari 7+ and the evergreen Chrome, Firefox or Edge. To read some documents, you may need a PDF file reader like Adobe® Acrobat Reader Xpdf ® or Foxit®. If these requirements change while you are maintaining an active relationship with Bank, and the change creates a material risk that you may not be able to receive Disclosures electronically, Bank will notify you of these changes. You will need a printer or a long-term storage device, such as your computer&apos;s disk drive, to retain a copy of the Disclosures for future reference. You may send us your written questions regarding the hardware and software requirements to:
                      <br /><br />
                      <b>Email</b><br />
                      CustomerCare@LendingUSA.com
                      <br /><br />
                      <b>Call</b><br />
                      Our regular business hours are 9:00am to 5:00pm PST<br />
                      800-994-6177
                      <br /><br />
                      <b>Address for Regular Mail</b><br />
                      15303 Ventura Blvd. Suite 850<br />
                      Sherman Oaks, CA 91403
                      <br /><br />
                      <u><b>Withdrawing Consent.</b></u> You are free to withdraw this E-Consent at any time and at no charge. However, if you withdraw this E-Consent before receiving consumer financial services, this will prevent you from obtaining consumer financial services from us. If at any time you wish to withdraw this E-Consent, you can send us your written request by e-mail to CustomerCare@LendingUSA.com with the details of such request. If you decide to withdraw this E-Consent, the withdrawal will not affect the legal effectiveness, validity, and enforceability of prior electronic Disclosures.
                      <br /><br />
                      <u><b>Change to Your Contact Information.</b></u> You agree to keep us informed of any change in your electronic address or mailing address. You may update such information by calling us or emailing us to provide the updated information. You may also send us your written update by mail to our address above.
                      <br /><br />
                      <u><b>YOUR ABILITY TO ACCESS DISCLOSURES.</b></u> BY CLICKING &#34;I AGREE&#34; OR OTHER LINKS, YOU ASSENT TO OUR TERMS. YOU ACKNOWLEDGE AND REPRESENT THAT YOU CAN ACCESS THE DISCLOSURES IN THE DESIGNATED FORMATS DESCRIBED ABOVE. Once you give your consent, you can log into the website to access these documents.
                      <br /><br />
                      <u><b>CONSENT.</b></u> BY CLICKING &#34;I AGREE&#34; OR OTHER LINKS, YOU ASSENT TO OUR TERMS. YOU ACKNOWLEDGE YOU HAVE READ THIS INFORMATION ABOUT ELECTRONIC SIGNATURES, RECORDS, DISCLOSURES, AND DOING BUSINESS ELECTRONICALLY. YOU CONSENT TO USING ELECTRONIC SIGNATURES, HAVING ALL DISCLOSURES PROVIDED OR MADE AVAILABLE TO YOU IN ELECTRONIC FORM AND TO DOING BUSINESS WITH US ELECTRONICALLY. YOU ACKNOWLEDGE THAT YOU MAY REQUEST A PAPER COPY OF THE ELECTRONIC RECORDS AND DISCLOSURES, WHICH WE WILL PROVIDE TO YOU AT NO CHARGE. IF YOU REFRAIN FROM PROCEEDING THEN YOU NEITHER WISH TO USE ELECTRONIC SIGNATURES NOR CONDUCT THIS TRANSACTION ELECTRONICALLY. YOU ALSO ACKNOWLEDGE THAT YOUR CONSENT TO ELECTRONIC DISCLOSURES IS REQUIRED TO RECEIVE CONSUMER FINANCIAL SERVICES FROM US OVER THE INTERNET.
                      <br /><br />
                      Print and retain a hard copy or electronic copy.
                      <br /><br />
                      <b>ELECTRONIC CONSENT AND ACKNOWLEDGMENT.</b> BY CLICKING THE &#34;I AGREE&#34; BUTTON, YOU CERTIFY THAT:<br />
                      <ul>
                        <li>Your computer hardware and software meet the requirements needed to access and retain the Documents electronically.</li>
                        <li>You consent to receive the Disclosures electronically.</li>
                        <li>You consent to sign your Loan Agreement and related documents electronically.</li>
                        <li>You understand and agree that you will be bound to the same terms and conditions if you sign the Documents electronically as if you signed paper Documents.</li>
                      </ul>
                    </PopoverCheckbox>
                    <PopoverCheckbox
                      label={[TERMS_AND_CONDITIONS]}
                      name="ConsentToTermsAndConditions"
                      onChange={this.handleCheckboxChange.bind(null, 'ConsentToTermsAndConditions')}
                      isChecked={values.ConsentToTermsAndConditions}
                      id="ConsentToTermsAndConditions"
                      errorMessage={errors.ConsentToTermsAndConditions}
                    >
                      By checking this box you authorize LendingUSA, LLC, (“LendingUSA”), Cross River Bank (“Lender”) and their affiliated third parties (“Third Parties”) to forward your loan application (“Application”), including your non-public personal information, to third parties to verify the information contained in your Application, including, but not limited to the following: (1) contacting your employer(s) to verify employment and income; (2) contacting your Merchant Provider (if applicable) to verify any of the following information: (i) the type of procedure(s), service(s) and/or product(s) to be provided; (ii) the date of service; (iii) cost of the goods and/or services to be provided. You acknowledge that you have reviewed and agree to our Privacy Policy which can be found at <a href="http://www.lendingusa.com/privacy-policy" target="_blank" rel="noopener noreferrer">http://www.lendingusa.com/privacy-policy</a> and you have reviewed and agree to our Terms of Use which can be found at <a href="http://www.lendingusa.com/terms-of-use" target="_blank" rel="noopener noreferrer">http://www.lendingusa.com/terms-of-use</a>
                      <br /><br />
                      You understand that APR&apos;s will vary depending upon credit ratings and/or the payment terms that are approved. Credit approvals are valid for a limited time only. You understand that checking your rate and reviewing loan offers on LendingUSA&apos;s Text-to-Apply mobile, merchant platform, or any other LendingUSA online platform will result in a soft credit inquiry which will not affect your credit score. However, if you receive a preapproval (“Offer“) from LendingUSA, and you select an Offer provided to you and proceed with acquiring a loan from the Lender, then LendingUSA and/or Lender will request a full credit report from one or more of the credit reporting agencies. This request will appear as a hard inquiry on your credit report and may affect your credit score. You further acknowledge and understand that additional soft credit inquiry reports may be requested and obtained from one or more of the credit reporting agencies during the application process or throughout the term of your loan. These soft pull inquiries will be requested: (1) to confirm that you continue to meet the Lender&apos;s credit criteria; (2) to prevent potential fraudulent activities; (3) for internal modeling and analysis purposes; (4) in servicing or monitoring any product you may have attained through LendingUSA and/or its Lender; (5) in collecting, enforcing or selling any loan that you may receive from Lender; (6) in providing your credit data to you; (7) in offering you financial products and services; and/or (8) for any other lawful purpose.
                      <br /><br />
                      You authorize your wireless carrier to disclose information about your account, such as subscriber status, payment method and device details, if available, to support identity verification, fraud avoidance and other uses in support of credit transactions. Information may also be shared with other service providers to further support identity verification and fraud prevention.
                      <br /><br />
                      By providing a telephone number for a landline, cellular phone or other wireless device, you are expressly consenting to receiving communications at that number, including, but not limited to, non-autodialed text messages, voice messages, and telephone calls made by any representative from LendingUSA, Lender, third party servicer or other affiliated third parties even if that number is on a federal or state do-not-call list. This express consent applies to each such telephone number that you provide to LendingUSA, Lender, third party servicer or other Third Parties, either now or in the future regardless of their purpose. These telephone calls and messages may incur message, data and access fees from your telephone provider.
                      <br /><br />
                      Electronic Signature Agreement. By clicking the “Check My Rate” button you are consenting to this agreement and signing your Application electronically. You agree your electronic signature is the legal equivalent of your manual signature on this Application. By clicking “Check My Rate” you consent to be legally bound by LendingUSA&apos;s terms and conditions. You further agree that your use of a key pad, mouse, touch pad or other device to select an item, button, icon or similar act/action online, through the Text-to-Apply Portal, or through the Merchant Portal constitutes your signature (hereafter referred to as &apos;E-Signature&apos;). You also agree that no third-party verification is necessary to validate your E-Signature, and that the lack of such third-party verification will not in any way affect the enforceability of your E-Signature, or of any resulting agreement between you and LendingUSA.
                      <br /><br />
                      By clicking on “Check My Rate” and submitting this application you certify that: 1) You are the Applicant; 2) You are over the age of 18 years; 3) You are a US Citizen or US Permanent Resident and; 4) All information that has been provided by you on this Application is true and accurate.
                    </PopoverCheckbox>
                    <PopoverCheckbox
                      label={[CALLS_AND_MESSAGES]}
                      name="ConsentToReceiveMessages"
                      onChange={this.handleCheckboxChange.bind(null, 'ConsentToReceiveMessages')}
                      isChecked={values.ConsentToReceiveMessages}
                      id="ConsentToReceiveMessages"
                      errorMessage={errors.ConsentToReceiveMessages}
                    >
                      By providing a telephone number for a landline, cellular phone or other wireless device, you are expressly consenting to receiving communications at that number, including, but not limited to, prerecorded voice messages and telephone calls made by an auto-dialer or by any representative from LendingUSA, Lender, third party servicer or other affiliated third parties. This express consent applies to each such telephone number that you provide to LendingUSA, Lender, third party servicer or other Third Parties, either now or in the future. These telephone calls and messages may incur message, data and access fees from your telephone provider. Consent is not a condition of applying for a loan. You understand that you may opt out of this authorization by providing written notice to LendingUSA at the following address: 15303 Ventura Blvd., Ste 850, Sherman Oaks, CA 91403.
                      <br /><br />
                      Furthermore, by agreeing to this consent box and clicking &apos;Check My Rate&apos; you warrant and represent to LendingUSA that you are the named Applicant listed on this application and you authorize LendingUSA, its Lender(s), affiliated third parties and service providers to send texts with follow up messages regarding this application, promotional loan product/services, and other marketing or information about LendingUSA, and/or its Lender(s) to the telephone number provided in this application using an auto-dialer, even if that number is on a federal or state do-not-call list. Consent is not a condition of applying for a loan. Your agreeing to this consent box and clicking &apos;Check My Rate&apos; is your electronic signature agreeing to receive text messages. Call 800-994-6177 for a free paper copy of these terms. Reply HELP for help; Reply STOP to withdraw consent. Msg. and data rates may apply.
                    </PopoverCheckbox>
                  </Col>
                  <Col sm={12} md={9} className="mt-1 padded-bottom">
                    <Input
                      label="Applicant E-Signature (Type full name)"
                      name="signatureBy.name"
                      value={values.signatureBy && values.signatureBy.name}
                      onChange={this.handleInputChange}
                      isRequired
                      hasError={!!errors['signatureBy.name']}
                      onBlur={this.handleBlur}
                      errorMessage={errors['signatureBy.name']}
                    />
                  </Col>
                  <Col sm={12} md={3} className="mt-1 padded-top padded-bottom">
                    <Input
                      name="signatureBy.date"
                      value={values.signatureBy && values.signatureBy.date}
                      label="Date"
                      className="current-date"
                      isDisabled
                    />
                  </Col>
                </Row>

                <h5>Important information about procedures for opening a new account</h5>
                <textarea className="no-resize" rows="3" readOnly defaultValue="To help the government fight the funding of terrorism and money laundering activities, federal law requires all financial institutions to obtain, verify, and record information that identifies each person who opens an account or applies for a loan from Cross River Bank (&ldquo;we&rdquo;). What this means for you: When you open an account or apply for a loan, we will ask for your name, address, date of birth and other information that will allow us to identify you. We may also ask to see your driver’s license or other identifying documents. If you fail to provide the required information, we may be unable to open an account or grant you a loan." />
                <Button
                  className={cn('large w-100', isLoading ? '' : 'arrow')}
                  style={{ marginTop: 20 }}
                  onClick={this.handleSubmitForm.bind(null, values)}
                  isDisabled={!(values.ConsentElectronicCommunication && values.ConsentToTermsAndConditions)}
                  isLoading={isLoading}
                  color="primary"
                >
                  Check My Rate
                </Button>
                {hasError &&
                  <div className="errorsContainer">
                    {
                      errorMessages && errorMessages.map((err, index) => (<p key={index}>{err}</p>))
                    }
                  </div>
                }
              </FormGroup>
            </Col>
            <Sidebar bottomBoundary={!isHeaderHidden ? 2300 : 2230} />
          </Row>
        </Container>
      </form>
    );
  }
}

Application.propTypes = {
  className: PropTypes.string,
  validator: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  checkinAction: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  ipAddress: PropTypes.string.isRequired,
};

Application.defaultProps = {
  className: '',
};

export default compose(
  Validator(schema),
  connect(
    state => ({
      auth: state.auth,
    }),
    {
      checkinAction,
    }
  )
)(Application);
