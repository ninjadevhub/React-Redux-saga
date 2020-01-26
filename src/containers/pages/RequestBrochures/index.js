import React, { Component } from 'react';
// import cn from 'classnames';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import get from 'lodash/get';
import NotificationSystem from 'react-notification-system';
import { unSupportedStates } from 'utils/unSupportedStates';
import { verifyAddress } from 'utils/verifyAddress';
import { toTitleCase } from 'utils/toTitleCase';
import Popup from 'components/Popup';
import { appConfig } from 'config/appConfig';
import { states } from 'utils/states';

// import Footer from 'components/Footer';

import schema from './schema';
import './style.scss';
import dateFns from 'date-fns';
import {
  FormGroup,
  Col,
  Container,
  Row,
  Form,
} from 'reactstrap';

import Validator from 'components/Validator/Validator';
import { Button, VerifyButton } from 'components/Button';
import Input from 'components/Form/Input';
import Select from 'components/Form/Select';

import {
  requestBrochureAction,
} from 'actions/brochure';

class RequestBrochures extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // isSubmitted: false,
      // eslint-disable-next-line
      response: {},

      // address
      isVerified: false,
      isAddressLoading: false,
      isAddressPopupVisible: false,
      isVerifyButtonClicked: false,
      popupType: null,
      isPOBoxError: false,
      isLoading: false,
    };
  }

  componentWillMount() {
    const { validator: { setValues } } = this.props;
    const initialFormData = {
      businessName: localStorage.getItem('businessName') || 'default',
    };
    setValues(initialFormData);
  }

  getCurrentDate = () => dateFns.format(new Date(), 'MM/DD/YYYY');

  processSubmit = (formData) => {
    const merchantId = localStorage.getItem('merchantId');
    this.setState({
      isLoading: true,
    });
    this.props.requestBrochureAction({
      data: formData,
      url: `/merchants/${merchantId}/brochures`,
      success: (response) => {
        // eslint-disable-next-line
        const { history } = this.props;
        this.setState({
          // isSubmitted: true,
          // eslint-disable-next-line
          response: response,
          isLoading: false,
        });
        history.push('/dashboard');
      },
      fail: (error) => {
        if (error && error.data && error.data.message) {
          this.notificationSystem.addNotification({
            message: error.data.message,
            level: 'error',
            position: 'tc',
          });
        } else {
          console.log(error);
        }
        this.setState({
          isLoading: false,
        });
      },
    });
  }
  handleSubmitForm = (data, e) => {
    e.preventDefault();
    const { validator: { validate, errors } } = this.props;
    const isAddressValid = appConfig.smartyStreetEnforce ? this.state.isVerified : true;
    if (validate(schema).isValid && isAddressValid) {
      const formData = {
        ...data,
      };
      this.setState({
        isLoading: true,
      });
      // restrict PO BOX address
      verifyAddress(data).then((response) => {
        if (response) {
          if (get(response, 'metadata.recordType') === 'P') {
            this.setState({
              isPOBoxError: true,
              isLoading: false,
            });
          } else {
            this.processSubmit(formData);
          }
        } else {
          this.processSubmit(formData);
        }
      }).catch((error) => { // eslint-disable-line
        this.processSubmit(formData);
      });
    } else {
      console.log('api error', errors, !this.state.isVerified && 'address is not verified');
    }
  };

  handleInputChange = (event) => {
    const { validator: { onChangeHandler } } = this.props;
    switch (event.target.name) {
      case 'state':
        this.initializeAddressState();
        onChangeHandler(event.target.name, event.target.value);
        break;
      case 'zip':
        this.initializeAddressState();
        onChangeHandler(event.target.name, event.target.value);
        break;
      case 'address':
      case 'city':
        this.initializeAddressState();
        onChangeHandler(event.target.name, (event.target.value).replace(/[^a-zA-Z0-9- ']/g, ''));
        break;
      default:
        onChangeHandler(event.target.name, event.target.value);
    }
  };

  handleBlur = (event) => {
    event.preventDefault();

    const { validator: { onChangeHandler, values } } = this.props;
    switch (event.target.name) {
      case 'state':
        if (unSupportedStates.indexOf(event.target.value) !== -1) {
          this.setState({
            isAddressPopupVisible: true,
            isAddressLoading: false,
            popupType: 4,
          });
        } else if (this.state.isFirstLoad && get(values, 'city') && get(values, 'address')) {
          this.verifySmartyStreet({
            zip: get(values, 'zip'),
            address: get(values, 'address'),
            city: get(values, 'city'),
            state: event.target.value,
          });
        }
        break;
      case 'zip':
        if (this.state.isFirstLoad && get(values, 'city') && get(values, 'state') && get(values, 'address')) {
          this.verifySmartyStreet({
            zip: event.target.value,
            address: get(values, 'address'),
            city: get(values, 'city'),
            state: get(values, 'state'),
          });
        }
        onChangeHandler(event.target.name, toTitleCase(event.target.value));
        break;
      case 'address':
        if (this.state.isFirstLoad && get(values, 'city') && get(values, 'state')) {
          this.verifySmartyStreet({
            zip: get(values, 'zip'),
            address: toTitleCase(event.target.value),
            city: get(values, 'city'),
            state: get(values, 'state'),
          });
        }
        onChangeHandler(event.target.name, toTitleCase(event.target.value));
        break;
      case 'city':
        if (this.state.isFirstLoad && get(values, 'address') && get(values, 'state')) {
          this.verifySmartyStreet({
            zip: get(values, 'zip'),
            address: get(values, 'address'),
            city: toTitleCase(event.target.value),
            state: get(values, 'state'),
          });
        }
        onChangeHandler(event.target.name, toTitleCase(event.target.value));
        break;
      default:
        onChangeHandler(event.target.name, toTitleCase(event.target.value));
    }
  }

  initializeAddressState = () => {
    this.setState({
      isVerified: false,
      isVerifyButtonClicked: false,
      isPOBoxError: false,
    });
  }

  handleAbort = () => {
    this.setState({
      isAddressPopupVisible: false,
    });
  }

  handleVerifyAddressClick = (e) => {
    e.preventDefault();

    const { validator: { values } } = this.props;

    if (!get(values, 'address')) {
      this.setState({
        isAddressPopupVisible: true,
        popupType: 1,
        isVerifyButtonClicked: true,
      });
    } else {
      this.verifySmartyStreet({
        address: get(values, 'address'),
        city: get(values, 'city'),
        state: get(values, 'state'),
        zip: get(values, 'zip'),
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
      zip: get(this.state, 'prevAddresses.zip'),
    };

    this.setState({
      isVerified: false,
    });
    setValues(addressData);
  }

  verifySmartyStreet = ({ address, city, state, zip }) => {
    const { validator: { values, setValues } } = this.props;

    this.setState({
      isAddressLoading: true,
      isVerifyButtonClicked: true,
    });

    verifyAddress({ zip, address, city, state }).then((response) => {
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
            address: response.deliveryLine1,
            city: get(response, 'components.cityName'),
            state: get(response, 'components.state'),
            zip: `${response.deliveryPointBarcode}`.slice(0, 5),
          };
          this.setState({
            isVerified: true,
            isAddressLoading: false,
            isFirstLoad: false,
            // eslint-disable-next-line
            prevAddresses: { address, city, state, zip },
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
    const { validator: { values, errors } } = this.props;
    const {
      isAddressLoading,
      isAddressPopupVisible,
      isVerifyButtonClicked,
      isVerified,
      popupType,
      isPOBoxError,
      isLoading,
    } = this.state;
    if (!get(errors, 'address') && !isVerified && appConfig.smartyStreetEnforce) {
      errors.address = isVerifyButtonClicked ? 'Address is not valid, please enter valid address' : 'Please click verify Address';
    }
    if (isPOBoxError) {
      errors.address = 'PO BOX Address is not allowed';
    }
    return (
      <div className="page-dashboard">
        <Container fluid>
          <NotificationSystem ref={(item) => { this.notificationSystem = item; }} />
          <Row>
            <Col md={6} className="brochures-img" />
            <Col md={6} className="text-center brochure-content">
              <div className="max-container">
                <h2 className="mb-1 mb-md-2">Request Brochures</h2>
                <p className="mb-3 mb-md-4">If you need to order new printed brochures for your office please complete the form below</p>
                <Form onSubmit={this.handleSubmitForm.bind(null, values)}>
                  <Container fluid>
                    <Row>
                      <Col lg={6}>
                        <FormGroup>
                          <Input
                            label="Full Name"
                            name="contactName"
                            value={values.contactName}
                            onChange={this.handleInputChange}
                            isRequired
                            hasError={!!errors.contactName}
                            tabIndex={1} // eslint-disable-line
                          />
                        </FormGroup>
                      </Col>
                      <Col lg={6}>
                        <FormGroup>
                          <Input
                            label="Business Name"
                            name="businessName"
                            value={localStorage.getItem('businessName') || 'default'}
                            readOnly
                            isRequired
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12} className="positionRelative">
                        <Input
                          label="Street Address"
                          name="address"
                          value={values.address}
                          onChange={this.handleInputChange}
                          isRequired
                          hasError={!!errors.address}
                          errorMessage={errors.address}
                          onBlur={this.handleBlur}
                          className="streetAddress"
                          tabIndex={2} // eslint-disable-line
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
                              address: get(values, 'address'),
                              city: get(values, 'city'),
                              state: get(values, 'state'),
                              zip: get(values, 'zip'),
                            }}
                          />
                        }
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12}>
                        <FormGroup>
                          <Row form>
                            <Col md={6}>
                              <Input
                                label="City"
                                name="city"
                                value={values.city}
                                onChange={this.handleInputChange}
                                isRequired
                                hasError={!!errors.city}
                                errorMessage={errors.city}
                                onBlur={this.handleBlur}
                                tabIndex={3} // eslint-disable-line
                              />
                            </Col>
                            <Col md={6}>
                              <Row>
                                <Col sm={7}>
                                  <FormGroup className="dropdown-toggle mb-0 pb-0">
                                    <Select
                                      name="state"
                                      data={states}
                                      value={values.state}
                                      onChange={this.handleInputChange}
                                      onBlur={this.handleBlur}
                                      label="State"
                                      isRequired
                                      hasError={!!errors.state}
                                      errorMessage={errors.state}
                                      tabIndex={4} // eslint-disable-line
                                    />
                                  </FormGroup>
                                </Col>
                                <Col sm={5}>
                                  <Input
                                    label="Zip"
                                    isMasked={[/\d/, /\d/, /\d/, /\d/, /\d/]}
                                    name="zip"
                                    value={values.zip}
                                    onChange={this.handleInputChange}
                                    isRequired
                                    hasError={!!errors.zip}
                                    errorMessage={errors.zip}
                                    tabIndex={5} // eslint-disable-line
                                  />
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={12}>
                        <Select
                          name="requestType"
                          data={[
                            { value: 'First Order', title: 'First Order' },
                            { value: 'Reorder', title: 'Reorder' },
                          ]}
                          isRequired
                          value={values.requestType}
                          onChange={this.handleInputChange}
                          hasError={!!errors.requestType}
                          errorMessage={errors.requestType}
                          label="Request Type"
                          tabIndex={6} // eslint-disable-line
                        />
                      </Col>
                    </Row>

                    <Row>
                      <Col>
                        <Button
                          className="mt-0 mt-3 mb-3"
                          onClick={this.handleSubmitForm.bind(null, values)}
                          color="primary"
                          isLoading={isLoading}
                          tabIndex={7} // eslint-disable-line
                        >
                          Request Brochures
                        </Button>
                      </Col>
                    </Row>
                  </Container>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

RequestBrochures.propTypes = {
  validator: PropTypes.object.isRequired,
  requestBrochureAction: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

RequestBrochures.defaultProps = {

};
export default compose(
  Validator(schema),
  connect(
    null,
    {
      requestBrochureAction,
    }
  )
)(RequestBrochures);
