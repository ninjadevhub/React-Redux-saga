import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import { conformToMask } from 'react-text-mask';

import { Button } from 'components/Button';
import Input from 'components/Form/Input';
import Select from 'components/Form/Select';
import Validator from 'components/Validator/Validator';
import { parseUrlParams } from 'utils/parseUrlParams';
import { states } from 'utils/states';
import {
  nextAction,
} from 'actions/workflow';
import User from 'assets/images/pending.svg';
import schema from './schema';
import './style.scss';
import get from 'lodash/get';

const phoneNumberMask = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

class IdCheckPersonalInfo extends Component {
  state = {
    // eslint-disable-next-line
    response: {},
    isLoading: false,
    isValid: true,
  };

  componentWillMount() {
    const params = parseUrlParams(window.location.search);
    const { validator: { setValues }, workflow } = this.props;
    if (!params.applicationId) {
      this.props.history.push(`/applications/${get(workflow, 'workflowtype')}/application`);
    } else if (get(workflow, 'state.applicantFirstName') === undefined) {
      this.props.history.push(`/applications/${this.props.match.params.workflowtype}/checkin?applicationId=${params.applicationId || ''}`);
    } else {
      const initialFormData = {
        applicantFirstName: get(workflow, 'state.applicantFirstName'),
        applicantFullName: get(workflow, 'state.applicantFullName'),
        streetAddress1: get(workflow, 'state.streetAddress1'),
        city: get(workflow, 'state.city'),
        state: get(workflow, 'state.state'),
        zipCode: get(workflow, 'state.zipCode'),
        phoneNumber: conformToMask(get(workflow, 'state.phoneNumber'), phoneNumberMask).conformedValue,
      };
      setValues(initialFormData);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  handleMerchantReturnClick = (e) => {
    e.preventDefault();
    const params = parseUrlParams(window.location.search);
    if (params.applicationId) {
      this.props.history.push('/dashboard');
    }
  }

  handleInputChange = (event) => {
    const { validator: { onChangeHandler } } = this.props;
    onChangeHandler(event.target.name, event.target.value);
  }

  handleStateSelectChange = (value) => {
    const { validator: { onChangeHandler } } = this.props;
    const activeState = states.filter(st => st.label === value) || [];
    onChangeHandler('state', activeState.length > 0 ? activeState.value : '');
  }

  handleSubmitForm = (e) => {
    e.preventDefault();

    const params = parseUrlParams(window.location.search);
    if (params.applicationId) {
      const { validator: { values, validate } } = this.props;
      if (validate(schema).isValid) {
        this.setState({
          isLoading: true,
          isValid: true,
        });
        this.props.nextAction({
          data: {
            StreetAddress1: values.streetAddress1,
            City: values.city,
            State: values.state,
            ZipCode: values.zipCode,
            Ssn4: values.Ssn4,
            PhoneNumber: values.phoneNumber,
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
      } else {
        validate(schema);
        this.setState({
          isValid: false,
        });
      }
    }
  }

  render() {
    const { validator: { values, errors }, workflow } = this.props;
    const { isLoading, isValid } = this.state;
    const isSsn4Mismatch = get(workflow, 'state.isSsn4Mismatch');
    const errorMessage = get(workflow, 'state.errorMessage');

    return (
      <form onSubmit={this.handleSubmitForm.bind(null, values)} ref={this.setFormRef}>
        <Container fluid>
          <Row>
            <Col sm={{ size: 8, offset: 2 }} className="d-flex flex-column justify-content-center">
              <h2>Identity Verification</h2>
              <div className="d-flex align-items-center">
                <img src={User} alt="User Icon" />
                <Col className="pl-30">
                  <Row>LendingUSA</Row>
                </Col>
              </div>
            </Col>
          </Row>
          <Row>
            <Col sm={{ size: 8, offset: 2 }} className="d-flex flex-column justify-content-center pt-20">
              {!isLoading &&
                  isSsn4Mismatch && (
                  <div className="pt-10">
                    <p className="form-note text-left">{errorMessage}</p>
                  </div>
                )}
              <h4>ID Check - Personal Information</h4>
              <p>Please confirm your home address and phone number. This information, along with your name, will be used to generate a list of questions to verify your identity.</p>
            </Col>
          </Row>
          <Row>
            <Col sm={{ size: 8, offset: 2 }} className="d-flex flex-column justify-content-center pt-10">
              <h4>Required Information (Home Address)</h4>
              <Row className="pt-10">
                <Col sm={12} md={6}>
                  <Row>
                    <Col sm={12}>
                      <Input
                        type="text"
                        name="name"
                        onChange={() => {}}
                        label="Applicant Name"
                        value={values.applicantFullName}
                        isBadgeVisible={false}
                        isDisabled
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={12}>
                      <Input
                        type="text"
                        name="streetAddress1"
                        label="Street1"
                        value={values.streetAddress1}
                        onChange={this.handleInputChange}
                        isRequired
                        hasError={!!errors.streetAddress1}
                        errorMessage={errors.streetAddress1}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={12}>
                      <Input
                        type="text"
                        name="city"
                        value={values.city}
                        label="City"
                        onChange={this.handleInputChange}
                        isRequired
                        hasError={!!errors.city}
                        errorMessage={errors.city}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={12}>
                      <Select
                        name="state"
                        value={values.state}
                        onChange={this.handleInputChange}
                        data={states}
                        label="State"
                        isRequired
                        hasError={!!errors.state}
                        errorMessage={errors.state}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={12} className="d-flex align-items-center">
                      <Input
                        label="Zip"
                        isMasked={[/\d/, /\d/, /\d/, /\d/, /\d/]}
                        placeHolder="_____"
                        onChange={this.handleInputChange}
                        name="zipCode"
                        value={values.zipCode}
                        isRequired
                        hasError={!!errors.zipCode}
                        errorMessage={errors.zipCode}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col sm={12} md={6}>
                  <Row>
                    <Col sm={12}>
                      <Input
                        type="tel"
                        name="Ssn4"
                        value={values.Ssn4}
                        onChange={this.handleInputChange}
                        label="Last 4 digits of SSN"
                        isMasked={[/\d/, /\d/, /\d/, /\d/]}
                        isRequired
                        hasError={!!errors.Ssn4}
                        errorMessage={errors.Ssn4}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={12}>
                      <Input
                        type="text"
                        name="phoneNumber"
                        isMasked={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                        value={conformToMask(values.phoneNumber, phoneNumberMask).conformedValue}
                        onChange={this.handleInputChange}
                        label="Phone #"
                        isRequired
                        hasError={!!errors.phoneNumber}
                        errorMessage={errors.phoneNumber}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              {!isValid && (
                <div>
                  <p className="form-note">You must enter required and valid information before you can continue.</p>
                </div>
              )}
              <Row>
                <Col className="d-flex justify-content-center">
                  <Button
                    color="primary"
                    className="w-80"
                    onClick={this.handleSubmitForm}
                    isLoading={isLoading}
                    disabled={isLoading}
                  >
                    Submit
                  </Button>
                  <Button
                    className="large arrow buttonStyle ml-30"
                    onClick={this.handleMerchantReturnClick}
                    color="primary"
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </form>
    );
  }
}

IdCheckPersonalInfo.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  nextAction: PropTypes.func.isRequired,
  validator: PropTypes.object.isRequired,
  workflow: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

IdCheckPersonalInfo.defaultProps = {
};

const mapStateToProps = state => ({
  workflow: state.workflow,
});

export default compose(
  Validator(schema),
  connect(
    mapStateToProps,
    {
      nextAction,
    }
  )
)(IdCheckPersonalInfo);
