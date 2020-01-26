import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import cn from 'classnames';
import {
  CognitoUserPool,
  CognitoUser,
} from 'amazon-cognito-identity-js';
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
} from 'reactstrap';

import Input from 'components/Form/Input';
import Validator from 'components/Validator/Validator';
import { Button } from 'components/Button';
import { appConfig } from 'config/appConfig';

import schema from './forgotSchema';
import emailFormSchema from './emailFormSchema';
import style from './style.scss';

class Forgot extends Component {
  state = {
    redirectToReferrer: false,
    error: '',
    step: 1,
    isLoading: false,
    destination: '',
  }

  componentWillMount() {
    const resetUser = localStorage.getItem('reset-user');
    if (resetUser) { // reset password required
      localStorage.removeItem('reset-user');
      const poolData = {
        UserPoolId: appConfig.userPoolId,
        ClientId: appConfig.clientId,
      };
      const userPool = new CognitoUserPool(poolData);

      const userData = {
        Username: resetUser,
        Pool: userPool,
      };

      const cognitoUser = new CognitoUser(userData);

      this.setState({
        isLoading: true,
      });
      const $this = this;
      cognitoUser.forgotPassword({
        onSuccess: (result) => { // eslint-disable-line
          $this.setState({
            isLoading: false,
            step: 2,
            cognitoUser,
            destination: result.CodeDeliveryDetails.Destination,
          });
        },
        onFailure: (err) => {
          this.setState({
            error: err.message,
            isLoading: false,
          });
        },
        // inputVerificationCode() {
        // },
      });
    }
  }

  handleInputChange = (event) => {
    const { validator: { onChangeHandler } } = this.props;
    onChangeHandler(event.target.name, event.target.value.trim());
  };

  handleSubmitFrom = (e) => {
    e.preventDefault();
    const { validator: { validate, values } } = this.props;
    const $this = this;

    if (validate(emailFormSchema).isValid) {
      const poolData = {
        UserPoolId: appConfig.userPoolId,
        ClientId: appConfig.clientId,
      };
      const userPool = new CognitoUserPool(poolData);

      const userData = {
        Username: values.username,
        Pool: userPool,
      };

      const cognitoUser = new CognitoUser(userData);

      this.setState({
        isLoading: true,
      });
      cognitoUser.forgotPassword({
        onSuccess: (result) => { // eslint-disable-line
          $this.setState({
            step: 2,
            error: '',
            cognitoUser,
            that: $this,
            isLoading: false,
            destination: result.CodeDeliveryDetails.Destination,
          });
        },
        onFailure: (err) => {
          this.setState({
            error: err.message,
            isLoading: false,
          });
        },
        // inputVerificationCode() {
        // },
      });
    } else {
      console.log('api error');
    }
  };

  handleResetPassword = (data, e) => {
    e.preventDefault();

    const { validator: { validate, values }, history } = this.props;
    const { cognitoUser } = this.state;
    if (validate(schema).isValid) {
      this.setState({
        isLoading: true,
      });
      cognitoUser.confirmPassword(values.verificationCode, values.newPassword, {
        onSuccess: (result) => { // eslint-disable-line
          history.replace('/');
        },
        onFailure: (err) => { // eslint-disable-line
          this.setState({
            error: err.message || '',
            isLoading: false,
          });
        },
      });
    } else {
      console.log('api error');
    }
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const { validator: { values, errors } } = this.props;
    const { error, redirectToReferrer, step, isLoading, destination } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }
    return (
      <form onSubmit={this.handleSubmitFrom} style={{ minHeight: 650 }} className="d-flex justify-content-center align-items-center">
        <Container fluid>
          <Col sm={{ size: 6, offset: 3 }}>
            <Row>
              <Col>
                <label className={style.error}>{error}</label>
                <Row>
                  <Col>
                    <Card className="animated fadeInUp delay-300ms">
                      <CardHeader>Reset Password</CardHeader>
                      <CardBody>
                        {
                          step === 1 ?
                            <Input
                              name="username"
                              label="Username"
                              onChange={this.handleInputChange}
                              value={values.username}
                              hasError={!!errors.username}
                              hasValue
                              placeHolder="username"
                              isBadgeVisible={false}
                              isRequired
                              isDisabled={isLoading}
                              errorMessage={errors.username}
                            />
                          :
                            <Fragment>
                              <p>Verification code was sent to <b>{`${destination}`}</b>. Please enter the verification code below and provide the new password.</p>
                              <Row>
                                <Col sm={12} lg={12}>
                                  <Input
                                    name="verificationCode"
                                    label="Verification Code"
                                    onChange={this.handleInputChange}
                                    value={values.verificationCode}
                                    hasError={!!errors.verificationCode}
                                    hasValue
                                    placeHolder="Verification Code"
                                    isBadgeVisible={false}
                                    isRequired
                                    errorMessage={errors.verificationCode}
                                  />
                                </Col>
                                <Col sm={12} lg={12}>
                                  <Input
                                    name="newPassword"
                                    type="password"
                                    label="New Password"
                                    onChange={this.handleInputChange}
                                    value={values.newPassword}
                                    hasError={!!errors.newPassword}
                                    hasValue
                                    placeHolder="New Password"
                                    isBadgeVisible={false}
                                    isRequired
                                    errorMessage={errors.newPassword}
                                  />
                                </Col>
                                <Col sm={12} lg={12}>
                                  <Input
                                    name="confirmPassword"
                                    type="password"
                                    label="Confirm Password"
                                    onChange={this.handleInputChange}
                                    value={values.confirmPassword}
                                    hasError={!!errors.confirmPassword}
                                    hasValue
                                    placeHolder="Confirm Password"
                                    isBadgeVisible={false}
                                    isRequired
                                    errorMessage={errors.confirmPassword}
                                  />
                                </Col>
                              </Row>
                            </Fragment>
                        }
                      </CardBody>
                    </Card>
                    {
                      step === 1 ?
                        <Button
                          className={cn('small w-100', style.button)}
                          onClick={this.handleSubmitFrom}
                          isLoading={isLoading}
                          color="primary"
                        >
                          Send Verification Code
                        </Button>
                      :
                        <Button
                          className={cn('small w-100', style.button)}
                          onClick={this.handleResetPassword.bind(null, values)}
                          isLoading={isLoading}
                          color="primary"
                        >
                          Reset Password
                        </Button>
                    }
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Container>
      </form>
    );
  }
}

Forgot.propTypes = {
  validator: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default compose(
  withRouter,
  Validator(schema),
  connect(state => ({
    auth: state.auth,
  }))
)(Forgot);
