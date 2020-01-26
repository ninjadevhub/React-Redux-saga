import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { conformToMask } from 'react-text-mask';
import get from 'lodash/get';

import {
  Col,
  Container,
  Row,
} from 'reactstrap';
import Loading from 'react-loading-components';

// components
import Input from 'components/Form/Input';
import Select from 'components/Form/Select';
import Card from 'components/Card';

import { getMerchantDetail } from 'actions/application';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageData: null,
    };
  }
  componentWillMount() {
    const merchantId = localStorage.getItem('merchantId');
    if (merchantId) {
      this.props.getMerchantDetail({
        url: `/merchants/${merchantId}`,
        success: (res) => {
          this.setState({
            pageData: res,
          });
        },
        fail: (err) => {
          // this.setState({ loading: false });

          if (err.response) {
            this.notificationSystem.addNotification({
              message: 'fetching user detail failes',
              level: 'error',
              position: 'tc',
            });
          } else {
            console.log('Error', err);
          }
        },
      });
    }
  }

  renderLoadingIndication = () => (
    <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.42)' }}>
      <Loading type="puff" width="100%" height={50} fill="#3989e3" />
    </div>
  )

  render() {
    const { pageData } = this.state;
    const phoneNumberMask = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    return (
      <div className="profile-page">
        <Container fluid>
          <Row>
            <Col sm={{ size: 10, offset: 1 }} className="card-grid-container">

              <Row className="pageHeader">
                <Col sm={12}>
                  <h3>Profile Settings</h3>
                </Col>
              </Row>

              <Row>
                <Col sm={12} lg={6}>

                  <Card title="Personal Information">
                    <Row>
                      <Col sm={12} lg={6}>
                        <Input
                          type="text"
                          name="firstName"
                          value={get(pageData, 'contacts.0.firstName')}
                          onChange={() => {}}
                          label="First Name"
                          isBadgeVisible={false}
                          isErrorVisible={false}
                        />
                      </Col>
                      <Col sm={12} lg={6}>
                        <Input
                          type="text"
                          name="lastName"
                          value={get(pageData, 'contacts.0.lastName')}
                          onChange={() => {}}
                          label="Last Name"
                          isBadgeVisible={false}
                        />
                      </Col>
                      <Col sm={12} lg={6}>
                        <Input
                          type="text"
                          name="title"
                          value={get(pageData, 'contacts.0.title')}
                          onChange={() => {}}
                          label="Title"
                          isBadgeVisible={false}
                        />
                      </Col>
                      <Col sm={12} lg={6}>
                        <Input
                          type="text"
                          name="Email"
                          value={get(pageData, 'contacts.0.email')}
                          onChange={() => {}}
                          label="Email"
                          isBadgeVisible={false}
                        />
                      </Col>
                      <Col sm={12} lg={6}>
                        <Input
                          type="text"
                          name="phone"
                          value={get(pageData, 'contacts.0.phoneNumber') ? conformToMask(get(pageData, 'contacts.0.phoneNumber'), phoneNumberMask).conformedValue : ''}
                          onChange={() => {}}
                          label="Phone"
                          isBadgeVisible={false}
                        />
                      </Col>
                      <Col sm={12} lg={6}>
                        <Input
                          type="text"
                          name="extension"
                          value={get(pageData, 'contacts.0.phoneExt') ? conformToMask(get(pageData, 'contacts.0.phoneExt'), phoneNumberMask).conformedValue : ''}
                          onChange={() => {}}
                          label="Extension"
                          isBadgeVisible={false}
                        />
                      </Col>
                    </Row>
                    { !pageData && this.renderLoadingIndication() }
                  </Card>
                </Col>

                <Col sm={12} lg={6}>
                  <Card title="Business Location">
                    <Input
                      type="text"
                      name="streetName"
                      value={get(pageData, 'businessAddresses.0.address')}
                      onChange={() => {}}
                      label="Street Address"
                      isBadgeVisible={false}
                    />
                    <Row>
                      <Col sm={5}>
                        <Input
                          type="text"
                          name="city"
                          value={get(pageData, 'businessAddresses.0.city')}
                          onChange={() => {}}
                          label="City"
                          isBadgeVisible={false}
                        />
                      </Col>
                      <Col sm={4}>
                        <Select
                          name="state"
                          value={get(pageData, 'businessAddresses.0.state')}
                          data={[
                            { value: 'AL', title: 'Alabama' },
                            { value: 'AK', title: 'Alaska' },
                            { value: 'AZ', title: 'Arizona' },
                            { value: 'AR', title: 'Arkansas' },
                            { value: 'CA', title: 'California' },
                            { value: 'CO', title: 'Colorado' },
                            { value: 'DE', title: 'Delaware' },
                            { value: 'DC', title: 'District of Columbia' },
                            { value: 'FL', title: 'Florida' },
                            { value: 'GA', title: 'Georgia' },
                            { value: 'HI', title: 'Hawaii' },
                            { value: 'ID', title: 'Idaho' },
                            { value: 'IL', title: 'Illinois' },
                            { value: 'IN', title: 'Indiana' },
                            { value: 'IA', title: 'Iowa' },
                            { value: 'KY', title: 'Kentucky' },
                            { value: 'LA', title: 'Louisiana' },
                            { value: 'ME', title: 'Maine' },
                            { value: 'MD', title: 'Maryland' },
                            { value: 'MA', title: 'Massachusetts' },
                            { value: 'MI', title: 'Michigan' },
                            { value: 'MN', title: 'Minnesota' },
                            { value: 'MO', title: 'Missouri' },
                            { value: 'MT', title: 'Montana' },
                            { value: 'NE', title: 'Nebraska' },
                            { value: 'NV', title: 'Nevada' },
                            { value: 'NJ', title: 'New Jersey' },
                            { value: 'NM', title: 'New Mexico' },
                            { value: 'NC', title: 'North Carolina' },
                            { value: 'ND', title: 'North Dakota' },
                            { value: 'OH', title: 'Ohio' },
                            { value: 'OK', title: 'Oklahoma' },
                            { value: 'OR', title: 'Oregon' },
                            { value: 'PA', title: 'Pennsylvania' },
                            { value: 'RI', title: 'Rhode Island' },
                            { value: 'SD', title: 'South Dakota' },
                            { value: 'TN', title: 'Tennessee' },
                            { value: 'TX', title: 'Texas' },
                            { value: 'UT', title: 'Utah' },
                            { value: 'VA', title: 'Virginia' },
                          ]}
                          onChange={() => {}}
                          label="State"
                          isRequired
                        />
                      </Col>
                      <Col sm={3}>
                        <Input
                          type="text"
                          name="zipCode"
                          value={get(pageData, 'businessAddresses.0.zipCode')}
                          onChange={() => {}}
                          label="Zip Code"
                          isBadgeVisible={false}
                        />
                      </Col>
                      <Col sm={12} className="checkbox-row padded-bottom">
                        <input id="ConfirmCheckbox" type="checkbox" readOnly />
                        <label htmlFor="ConfirmCheckbox">This is the primary account address</label>
                      </Col>
                    </Row>
                    { !pageData && this.renderLoadingIndication() }
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

Profile.propTypes = {
  getMerchantDetail: PropTypes.func.isRequired,
};

Profile.defaultProps = {

};

const mapStateToProps = state => ({
  applications: state.applications,
  navigation: state.navigation,
  fetch: state.fetch,
});

const mapDispatchToProps = dispatch => ({
  getMerchantDetail: data => dispatch(getMerchantDetail(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Profile));
