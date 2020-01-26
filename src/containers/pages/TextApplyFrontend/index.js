import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import cn from 'classnames';
import dateFns from 'date-fns';
import Datetime from 'react-datetime';
import emailMask from 'text-mask-addons/dist/emailMask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import {
  Col,
  Container,
  Row,
} from 'reactstrap';

import Validator from 'components/Validator/Validator';
import PageContent from 'components/Template/PageContent';
import Title from 'components/Title';
import FormGroup from 'components/Form/FormGroup';
import FormGroupLabel from 'components/FormGroupLabel';
import Input from 'components/Form/Input';
import Select from 'components/Form/Select';
import Checkbox from 'components/Form/Checkbox';
import { Button } from 'components/Button';
import { formatCurrency } from 'utils/formatCurrency';
import { floatUnmask, numberUnmask } from 'utils/masks';
import { toTitleCase } from 'utils/toTitleCase';

import {
  applyApplication,
} from 'actions/borrowerApply';

import schema from './schema';

const currencyMask = createNumberMask({
  prefix: '$ ',
  allowDecimal: true,
  integerLimit: 5,
});

const unmask = val => val.replace(/[$, ]+/g, '');

class BorrowerApply extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSubmitted: false,
      // eslint-disable-next-line
      response: {},
      isLoading: false,
      error: '',
    };
  }

  componentWillMount() {
    const { validator: { setValues } } = this.props;
    const initialFormData = {
      signatureDate: this.getCurrentDate(),
    };

    setValues(initialFormData);
  }

  getCurrentDate = () => dateFns.format(new Date(), 'MM/DD/YYYY');

  handleSubmitFrom = (data, e) => {
    e.preventDefault();
    const { validator: { validate, values } } = this.props;

    if (validate(schema).isValid) {
      this.setState({
        isLoading: true,
        error: '',
      });

      const formData = {
        ...values,
        serviceDate: dateFns.format(values.serviceDate, 'YYYY/MM/DD'),
        requestedAmount: unmask(values.requestedAmount),
        phoneNumber: numberUnmask(values.phoneNumber),
        merchantId: localStorage.getItem('merchantId'),
        ConsentElectronicCommunication: true,
        ConsentToTerms: true,
      };

      this.props.applyApplication({
        url: '/workflows/application/workflow/text2apply/start',
        data: formData,
        success: (response) => {
          this.setState({
            isSubmitted: true,
            response, // eslint-disable-line
            isLoading: false,
          });
          window.scrollTo(0, 0);
        },
        fail: (error) => {
          this.setState({
            error: error.data.errorMessages ? error.data.errorMessages.join(', ') : '',
            isLoading: false,
          });
          console.log(error);
        },
      });
    } else {
      this.setState({
        error: 'Please fix the errors.',
      });
    }
  };

  handleInputChange = (event) => {
    const { validator: { onChangeHandler } } = this.props;
    switch (event.target.name) {
      case 'firstName':
      case 'lastName':
        onChangeHandler(event.target.name, (event.target.value).replace(/[^a-zA-Z '-]/g, ''));
        break;
      default:
        onChangeHandler(event.target.name, event.target.value);
    }
  };

  handleDateChange = (date) => {
    const { validator: { onChangeHandler } } = this.props;
    if (typeof date.toISOString === 'function') {
      onChangeHandler('serviceDate', dateFns.format(date.toISOString(), 'MM/DD/YYYY'));
    }
  }

  handleCheckboxChange = (name, value) => {
    const { validator: { onChangeHandler } } = this.props;
    onChangeHandler(name, value);
  };

  handleBlur = (event) => {
    event.preventDefault();
    const { validator: { onChangeHandler } } = this.props;

    switch (event.target.name) {
      case 'requestedAmount':
        onChangeHandler(event.target.name, event.target.value ? formatCurrency(floatUnmask(event.target.value), 2) : '');
        break;
      case 'firstName':
      case 'lastName':
        onChangeHandler(event.target.name, toTitleCase(event.target.value));
        break;
      default:
        break;
    }
  }

  render() {
    const { className, validator: { values, errors } } = this.props;
    const {
      isSubmitted,
      isLoading,
      error,
    } = this.state;
    return (
      <div className="textApplyFrontend-page">
        <Container fluid>
          <Row>
            {
            isSubmitted ?
              <PageContent>
                <Title>Thank you! You have successfully sent the Text to Apply link to your customer.</Title>
              </PageContent>
            :
              <Fragment>
                <Col sm={{ size: 10, offset: 1 }} className="form-headline">
                  <h1 className="mb-3 mb-md-3 text-center text-md-left">Text to Apply Application</h1>
                </Col>

                <Col sm={{ size: 10, offset: 1 }}>
                  <FormGroup className="form-group">
                    <FormGroupLabel value="Product/Service Information" />
                    <Row>
                      <Col sm={12} lg={4} md={6}>
                        <Input
                          label="Loan Amount Requested"
                          name="requestedAmount"
                          value={`${values.requestedAmount}`}
                          isMasked={currencyMask}
                          onChange={this.handleInputChange}
                          hasError={!!errors.requestedAmount}
                          errorMessage={errors.requestedAmount}
                          isRequired
                          notification="Please enter the loan amount requested by the applicant"
                          onBlur={this.handleBlur}
                        />
                      </Col>
                      <Col sm={12} md={4}>
                        <div className={cn('has-value', 'hasValue', errors.serviceDate ? 'required' : '')}>
                          <span className="layerOrder">
                            Date of Service
                            <em>Required</em>
                          </span>
                          <Datetime
                            ref={(el) => { this.dateTime = el; }}
                            name="serviceDate"
                            label="Date of Service"
                            className={cn(className, 'input')}
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
                                {...props}
                              />
                            )}
                          />
                        </div>
                      </Col>
                    </Row>
                  </FormGroup>

                  <FormGroup className="form-group">
                    <FormGroupLabel value="Applicant Personal Information" />
                    <Row>
                      <Col sm={12} md={6} lg={4}>
                        <Input
                          label="First Name"
                          name="firstName"
                          value={values.firstName}
                          onChange={this.handleInputChange}
                          isRequired
                          hasError={!!errors.firstName}
                          errorMessage={errors.firstName}
                          onBlur={this.handleBlur}
                        />
                      </Col>
                      <Col sm={12} md={6} lg={4}>
                        <Input
                          label="Last Name"
                          name="lastName"
                          value={values.lastName}
                          onChange={this.handleInputChange}
                          isRequired
                          hasError={!!errors.lastName}
                          errorMessage={errors.lastName}
                          onBlur={this.handleBlur}
                        />
                      </Col>
                      <Col sm={12} md={6} lg={4}>
                        <FormGroup className="dropdown-toggle mb-0 pb-0">
                          <Select
                            name="stateOfResidence"
                            data={[
                              { value: 'AL', title: 'Alabama' },
                              { value: 'AK', title: 'Alaska' },
                              { value: 'AZ', title: 'Arizona' },
                              { value: 'AR', title: 'Arkansas' },
                              { value: 'CA', title: 'California' },
                              { value: 'CO', title: 'Colorado' },
                              { value: 'CT', title: 'Connecticut' },
                              { value: 'DE', title: 'Delaware' },
                              { value: 'DC', title: 'District of Columbia' },
                              { value: 'FL', title: 'Florida' },
                              { value: 'GA', title: 'Georgia' },
                              { value: 'HI', title: 'Hawaii' },
                              { value: 'ID', title: 'Idaho' },
                              { value: 'IL', title: 'Illinois' },
                              { value: 'IN', title: 'Indiana' },
                              { value: 'IA', title: 'Iowa' },
                              { value: 'KS', title: 'Kansas' },
                              { value: 'KY', title: 'Kentucky' },
                              { value: 'LA', title: 'Louisiana' },
                              { value: 'ME', title: 'Maine' },
                              { value: 'MD', title: 'Maryland' },
                              { value: 'MA', title: 'Massachusetts' },
                              { value: 'MI', title: 'Michigan' },
                              { value: 'MN', title: 'Minnesota' },
                              { value: 'MS', title: 'Mississippi' },
                              { value: 'MO', title: 'Missouri' },
                              { value: 'MT', title: 'Montana' },
                              { value: 'NE', title: 'Nebraska' },
                              { value: 'NV', title: 'Nevada' },
                              { value: 'NH', title: 'New Hampshire' },
                              { value: 'NJ', title: 'New Jersey' },
                              { value: 'NM', title: 'New Mexico' },
                              { value: 'NY', title: 'New York' },
                              { value: 'NC', title: 'North Carolina' },
                              { value: 'ND', title: 'North Dakota' },
                              { value: 'OH', title: 'Ohio' },
                              { value: 'OK', title: 'Oklahoma' },
                              { value: 'OR', title: 'Oregon' },
                              { value: 'PA', title: 'Pennsylvania' },
                              { value: 'RI', title: 'Rhode Island' },
                              { value: 'SC', title: 'South Carolina' },
                              { value: 'SD', title: 'South Dakota' },
                              { value: 'TN', title: 'Tennessee' },
                              { value: 'TX', title: 'Texas' },
                              { value: 'UT', title: 'Utah' },
                              { value: 'VT', title: 'Vermont' },
                              { value: 'VA', title: 'Virginia' },
                              { value: 'WA', title: 'Washington' },
                              { value: 'WV', title: 'West Virginia' },
                              { value: 'WI', title: 'Wisconsin' },
                              { value: 'WY', title: 'Wyoming' },
                            ]}
                            value={values.stateOfResidence}
                            onChange={this.handleInputChange}
                            label="State of Residence"
                            isRequired
                            hasError={!!errors.stateOfResidence}
                            errorMessage={errors.stateOfResidence}
                          />
                        </FormGroup>
                      </Col>
                      <Col sm={12} md={6} lg={4}>
                        <Input
                          label="Email Address"
                          name="email"
                          isMasked={emailMask}
                          placeHolder="Email address"
                          value={values.email}
                          onChange={this.handleInputChange}
                          isRequired
                          hasError={!!errors.email}
                          errorMessage={errors.email}
                        />
                      </Col>
                      <Col sm={12} md={6} lg={4}>
                        <Input
                          label="Mobile Phone Number"
                          name="phoneNumber"
                          placeHolder="(___) ___-____"
                          isMasked={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                          value={values.phoneNumber}
                          onChange={this.handleInputChange}
                          isRequired
                          hasError={!!errors.phoneNumber}
                          errorMessage={errors.phoneNumber}
                        />
                      </Col>
                    </Row>
                  </FormGroup>
                  <FormGroup className="form-group">
                    <h4>Applicant Authorization &amp; Signature</h4>
                    <Row>
                      <Col sm={12} className="checkbox-row padded-bottom">
                        <Checkbox
                          label={['I agree and consent to the following terms:']}
                          name="hasApplicationConsented"
                          onChange={this.handleCheckboxChange.bind(null, 'hasApplicationConsented')}
                          isChecked={values.hasApplicationConsented}
                          id="hasApplicationConsented"
                          errorMessage={errors.hasApplicationConsented}
                        />
                      </Col>
                      {/* <div className="cell small-12 checkbox-row padded-bottom">
                        <input id="Confirm" type="checkbox" />
                        <label htmlFor="Confirm">I agree and consent to the following terms:</label>
                      </div> */}
                      <Col sm={12}>
                        <div className={cn('textarea', 'no-resize p-small')}>
                          By selecting the consent box above and clicking ‘Send Now’ you warrant and represent to LendingUSA that you are the named Applicant listed on this form and you authorize LendingUSA, its Lender(s), affiliated third parties and service providers to send up to 7 texts/week with follow up messages regarding this application, promotional loan product/services, and other marketing or information about LendingUSA, and/or its Lender(s) to the telephone number provided above using an autodialer, even if that number is on a federal or state do-not-call list. Consent is not a condition of applying for a loan. Your selecting of the consent box above and clicking ‘Send Now’ is your electronic signature agreeing to receive text messages. Call 800-994-6177 for a free paper copy of these terms. Reply HELP for help; Reply STOP to withdraw consent. Msg. and data rates may apply. <br />
                          <a href="https://www.lendingusa.com/terms-of-use/" target="_blank" rel="noopener noreferrer">Terms of Use</a> &nbsp;|&nbsp; <a href="https://www.lendingusa.com/privacy-policy/" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                        </div>
                      </Col>
                      <Col sm={12} md={6} lg={6}>
                        <Input
                          label="Applicant Signature"
                          name="signatureName"
                          value={values.signatureName}
                          onChange={this.handleInputChange}
                          isRequired
                          hasError={!!errors.signatureName}
                          errorMessage={errors.signatureName}
                        />
                      </Col>
                      <Col sm={12} md={6} lg={2}>
                        <Input
                          name="signatureDate"
                          value={values.signatureDate}
                          label="Date"
                          className="current-date"
                          isBadgeVisible={false}
                          readOnly
                        />
                      </Col>
                    </Row>
                    <Row>
                      {
                        error &&
                        <Col sm={12} className="checkbox-row">
                          <label className="error text-center">{error}</label>
                        </Col>
                      }
                      <Col className="form-action-row">
                        <Row>
                          <Col sm={12} lg={{ size: 4, offset: 4 }}>
                            <Button
                              className={cn('large w-100')}
                              onClick={this.handleSubmitFrom.bind(null, values)}
                              isLoading={isLoading}
                              color="primary"
                            >
                              Send Now
                            </Button>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>
              </Fragment>
            }
          </Row>
        </Container>
      </div>
    );
  }
}

BorrowerApply.propTypes = {
  className: PropTypes.string,
  validator: PropTypes.object.isRequired,
  applyApplication: PropTypes.func.isRequired,
};

BorrowerApply.defaultProps = {
  className: '',
};

export default compose(
  withRouter,
  Validator(schema),
  connect(
    null,
    {
      applyApplication,
    }
  )
)(BorrowerApply);

