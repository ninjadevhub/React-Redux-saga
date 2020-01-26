import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import NotificationSystem from 'react-notification-system';
import { confirmAlert } from 'react-confirm-alert';
import {
  Col,
  Container,
  Row,
} from 'reactstrap';

import FormGroup from 'components/Form/FormGroup';
import Input from 'components/Form/Input';
import Validator from 'components/Validator/Validator';
import { Button } from 'components/Button';
import Card from 'components/Card';
import { getCognitoUser } from 'utils/aws';

import { signOut } from 'actions/auth';
import schema from './changeSchema';

class ResetPassword extends Component {
  state = {
    redirectToReferrer: false,
    error: '',
    loading: false,
  }

  handleInputChange = (event) => {
    const { validator: { onChangeHandler } } = this.props;
    onChangeHandler(event.target.name, event.target.value.trim());
  };

  handleSubmitFrom = (data, e) => {
    e.preventDefault();
    const { validator: { validate } } = this.props;

    if (validate(schema).isValid) {
      confirmAlert({
        title: 'Confirm to submit',
        message: 'Are you sure to do this.',
        buttons: [
          {
            label: 'Yes',
            onClick: () => this.resetPassword(data),
          },
          {
            label: 'No',
          },
        ],
      });
    } else {
      console.log('api error');
    }
  };

  resetPassword = (data) => {
    const { signOut: signOutAction, validator: { setValues } } = this.props;
    const cognitoUser = getCognitoUser();
    this.setState({
      loading: true,
    });
    if (cognitoUser != null) {
      cognitoUser.getSession((err, session) => {
        if (err) {
          this.setState({
            error: err.message || '',
            loading: false,
          });
          return;
        }
        if (session.isValid()) {
          cognitoUser.changePassword(data.oldPassword, data.newPassword, (err1, result) => {
            if (err1) {
              this.setState({
                error: err1.message,
              });
              return;
            }
            setValues({});
            this.setState({
              error: result,
              loading: false,
            });
          });
        } else {
          signOutAction();
        }
      });
    }
  }

  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const { validator: { values, errors } } = this.props;
    const { error, redirectToReferrer, loading } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }
    return (
      <div className="changePassword-page">
        <form onSubmit={this.handleSubmitFrom}>
          <Container fluid>
            <Row>
              <Col sm={{ size: 10, offset: 1 }}>
                <NotificationSystem ref={(item) => { this.notification = item; }} />
                <FormGroup className="form-group">
                  <Row>
                    <Col sm={12} md={12} className="positionRelative">
                      <label className="error mb-1 text-center">{error}</label>
                      <Row>
                        <Col sm={12} md={12}>
                          <Card
                            title="Reset Password"
                            isSectionWrapped
                            className="animated fadeInUp delay-100ms"
                          >
                            <Row>
                              <Col sm={12} lg={12}>
                                <Input
                                  name="oldPassword"
                                  label="Old Password"
                                  onChange={this.handleInputChange}
                                  value={values.oldPassword}
                                  hasError={!!errors.oldPassword}
                                  hasValue
                                  placeHolder="Old Password"
                                  isBadgeVisible={false}
                                  isRequired
                                  type="password"
                                  errorMessage={errors.oldPassword}
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
                              <Col sm={{ size: 6, offset: 3 }} md={{ size: 4, offset: 4 }}>
                                <Button
                                  className="small w-100"
                                  onClick={this.handleSubmitFrom.bind(null, values)}
                                  color="primary"
                                  isLoading={loading}
                                >
                                  Reset Password
                                </Button>
                              </Col>
                            </Row>
                          </Card>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </FormGroup>
              </Col>
            </Row>
          </Container>
        </form>
      </div>
    );
  }
}

ResetPassword.propTypes = {
  signOut: PropTypes.func.isRequired,
  validator: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default compose(
  withRouter,
  Validator(schema),
  connect(
    state => ({
      auth: state.auth,
    }),
    {
      signOut,
    }
  )
)(ResetPassword);
