import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import cn from 'classnames';
import NotificationSystem from 'react-notification-system';

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

import { awsLoginRequest, signOut } from 'utils/aws';
import schema from './setNewPasswordSchema';
import style from './style.scss';

class SetNewPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: '',
      isLoading: false,
    };
  }

  handleInputChange = (event) => {
    const { validator: { onChangeHandler } } = this.props;
    onChangeHandler(event.target.name, event.target.value.trim());
  };

  handleSubmitFrom = (data, e) => {
    e.preventDefault();
    const { validator: { validate }, history } = this.props;

    if (validate(schema).isValid) {
      this.setState({
        isLoading: true,
      });
      const userCred = {
        payload: {
          username: localStorage.getItem('user.username').trim(),
          password: data.temporaryPassword.trim(),
        },
      };

      const attributesData = {
        // email: localStorage.getItem('user.username'),
        // 'custom:first_name': data.firstName || 'John',
        // 'custom:last_name': data.lastName || 'Doe',
      };

      awsLoginRequest(userCred).then((res) => {
        if (res.error === 'New password required') {
          res.cognitoUser.completeNewPasswordChallenge(data.newPassword, attributesData, {
            // eslint-disable-next-line
            onSuccess: result => {
              this.setState({ isLoading: false });
              signOut();
              history.replace('/');
            },
            onFailure: error => this.setState({ error: error.message || 'Set password error', isLoading: false }),
          });
        }
      }).catch((err) => {
        this.setState({ error: err.message || 'Set password error', isLoading: false });
      });
    } else {
      console.log('api error');
    }
  };

  render() {
    const { validator: { values, errors } } = this.props;
    const { error, isLoading } = this.state;

    return (
      <form onSubmit={this.handleSubmitFrom} style={{ minHeight: 650 }} className="d-flex justify-content-center align-items-center">
        <Container fluid>
          <Col sm={{ size: 6, offset: 3 }}>
            <NotificationSystem ref={(item) => { this.notification = item; }} />
            <Row>
              <Col>
                <label className={style['set-new-password-error']}>{error}</label>
                <Row>
                  <Col>
                    <Card className="animated fadeInUp delay-300ms">
                      <CardHeader>Reset Password</CardHeader>
                      <CardBody>
                        <Col sm={12} lg={12}>
                          <Input
                            name="temporaryPassword"
                            label="Temporary Password"
                            onChange={this.handleInputChange}
                            value={values.temporaryPassword}
                            hasError={!!errors.temporaryPassword}
                            hasValue
                            placeHolder="Temporary Password"
                            isBadgeVisible={false}
                            isRequired
                            type="password"
                            errorMessage={errors.temporaryPassword}
                          />
                        </Col>
                        <Col sm={12} lg={12}>
                          <Input
                            name="newPassword"
                            label="New Password"
                            onChange={this.handleInputChange}
                            value={values.newPassword}
                            hasError={!!errors.newPassword}
                            hasValue
                            placeHolder="New Password"
                            isBadgeVisible={false}
                            isRequired
                            type="password"
                            errorMessage={errors.newPassword}
                          />
                        </Col>
                        <Col sm={12} lg={12}>
                          <Input
                            name="confirmPassword"
                            label="Confirm Password"
                            onChange={this.handleInputChange}
                            value={values.confirmPassword}
                            hasError={!!errors.confirmPassword}
                            hasValue
                            placeHolder="Confirm Password"
                            isBadgeVisible={false}
                            isRequired
                            type="password"
                            errorMessage={errors.confirmPassword}
                          />
                        </Col>
                      </CardBody>
                    </Card>
                  </Col>
                  <Col sm={12} lg={12}>
                    <Button
                      className={cn('small w-100', style.button)}
                      onClick={this.handleSubmitFrom.bind(null, values)}
                      isLoading={isLoading}
                      color="primary"
                    >
                      Set Password
                    </Button>
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

SetNewPassword.propTypes = {
  validator: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default compose(
  withRouter,
  Validator(schema),
  connect(state => ({
    auth: state.auth,
  }))
)(SetNewPassword);
