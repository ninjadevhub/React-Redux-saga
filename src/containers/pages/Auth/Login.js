import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import cn from 'classnames';
import NotificationSystem from 'react-notification-system';

import { signIn } from 'actions/auth';
import Input from 'components/Form/Input';
import Validator from 'components/Validator/Validator';
import { ButtonLink, Button } from 'components/Button';

import {
  Container, Row, Form, Col,
} from 'reactstrap';

import schema from './loginSchema';
import style from './style.scss';

import { appConfig } from 'config/appConfig';

class Login extends Component {
  state = {
    redirectToReferrer: false,
    error: '',
    isLoading: false,
  }

  handleInputChange = (event) => {
    const { validator: { onChangeHandler } } = this.props;
    const value = event.target.value.trim();
    if (event.target.name === 'username') {
      onChangeHandler(event.target.name, value.toLowerCase());
    } else {
      onChangeHandler(event.target.name, value);
    }
  };

  handleSubmitFrom = (data, e) => {
    e.preventDefault();
    const { validator: { validate } } = this.props;

    if (validate(schema).isValid) {
      const formData = data;
      this.setState({
        isLoading: true,
      });
      this.props.signIn({
        data: formData,
        // eslint-disable-next-line
        success: (res) => {
          console.log(formData.username);
          window.intercomBoot(
            appConfig.intercomId,
            localStorage.getItem('user.username'),
            localStorage.getItem('user.firstName'),
            localStorage.getItem('user.lastName'),
            localStorage.getItem('email'),
            localStorage.getItem('merchantId'),
            localStorage.getItem('businessName')
          );
          this.setState({
            redirectToReferrer: true,
            isLoading: true,
          });
        },
        fail: (res) => {
          if (res.code === 'UserNotFoundException') {
            this.setState({
              isLoading: false,
            });
            this.notification.addNotification({
              message: res.message,
              level: 'error',
              position: 'tc',
            });
          } else if (res.code === 'NotAuthorizedException') {
            this.setState({
              isLoading: false,
            });
            this.notification.addNotification({
              message: res.message,
              level: 'error',
              position: 'tc',
            });
          } else if (res.code === 'PasswordResetRequiredException') {
            localStorage.setItem('reset-user', data.username);
            this.props.history.push('/forgot');
          } else {
            this.setState({
              error: res,
              isLoading: false,
            });
          }
        },
      });
    } else {
      console.log('api error');
    }
  };

  forgotPassworrd = () => {
    this.props.history.push('/forgot');
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const { validator: { values, errors } } = this.props;
    const { error, redirectToReferrer, isLoading } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      <div className="login-page">
        <NotificationSystem ref={(item) => { this.notification = item; }} />
        <Container fluid>
          <Form onSubmit={this.handleSubmitFrom}>
            <Row className="align-items-center" style={{ minHeight: '500px' }}>
              <Col md={{ size: 6, offset: 3 }}>
                <Row>
                  <Col><h2 className="mb-2">Login</h2></Col>
                </Row>
                <Row>
                  <Col>
                    <Input
                      name="username"
                      label="Username"
                      value={values.username}
                      onChange={this.handleInputChange}
                      hasError={!!errors.username}
                      hasValue
                      placeHolder="username"
                      isBadgeVisible={false}
                      isRequired
                      errorMessage={errors.username}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Input
                      name="password"
                      type="password"
                      label="Password"
                      value={values.password}
                      onChange={this.handleInputChange}
                      hasError={!!errors.password}
                      hasValue
                      placeHolder="password"
                      isBadgeVisible={false}
                      isRequired
                      errorMessage={errors.password}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button
                      className={cn('w-100', style.button)}
                      onClick={this.handleSubmitFrom.bind(null, values)}
                      isLoading={isLoading}
                      color="primary"
                      type="submit"
                    >
                      Login
                    </Button>
                  </Col>
                </Row>
                <Row className="mt-1 text-center">
                  <Col>
                    <ButtonLink onClick={this.forgotPassworrd}>Forgot password?</ButtonLink>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <label className={style.loginError}>{error.message}</label>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    );
  }
}

Login.propTypes = {
  validator: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  signIn: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default compose(
  withRouter,
  Validator(schema),
  connect(
    state => ({
      auth: state.auth,
    }),
    {
      signIn,
    }
  )
)(Login);
