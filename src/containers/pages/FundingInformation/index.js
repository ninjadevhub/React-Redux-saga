import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import get from 'lodash/get';
import {
  Col,
  Container,
  Row,
} from 'reactstrap';

// components
import Loading from 'react-loading-components';
import Input from 'components/Form/Input';
import Card from 'components/Card';

import { getFundingInformation } from 'actions/application';
import { maskBankInformation } from 'utils/func';

class FundingInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageData: null,
    };
  }
  componentWillMount() {
    const merchantId = localStorage.getItem('merchantId');
    if (merchantId) {
      this.props.getFundingInformation({
        url: `/bank-accounts/merchant/${merchantId}/primary`,
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
    return (
      <div className="fundingInformation-page">
        <Container fluid>
          <Row>
            <Col sm={{ size: 10, offset: 1 }}>

              <Row className="pageHeader">
                <Col sm={12}>
                  <h3>Funding Profile</h3>
                </Col>
              </Row>

              <Row>
                <Col sm={12}>
                  <Card title="Bank Account Information">
                    <p>If you need to make any changes to your bank information, please contact us.</p>
                    <Row>
                      <Col sm={4}>
                        <Input
                          type="text"
                          name="accountHolderName"
                          value={get(pageData, 'accountHolderName')}
                          onChange={() => {}}
                          label="Account Holder Name"
                          isBadgeVisible={false}
                          isDisabled
                        />
                      </Col>
                      <Col sm={4}>
                        <Input
                          type="text"
                          name="bankName"
                          value={get(pageData, 'bankName')}
                          onChange={() => {}}
                          label="Bank Name"
                          isBadgeVisible={false}
                          isDisabled
                        />
                      </Col>
                      <Col sm={4}>
                        <Input
                          type="text"
                          name="accountType"
                          value={get(pageData, 'accountType')}
                          onChange={() => {}}
                          label="Account Type"
                          isBadgeVisible={false}
                          isDisabled
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={4}>
                        <Input
                          type="text"
                          name="routingNumber"
                          value={maskBankInformation(get(pageData, 'routingNumber'))}
                          onChange={() => {}}
                          label="Bank ABA Routing Number"
                          isBadgeVisible={false}
                          isDisabled
                        />
                      </Col>
                      <Col sm={4}>
                        <Input
                          type="text"
                          name="accountNumber"
                          value={maskBankInformation(get(pageData, 'accountNumber'))}
                          onChange={() => {}}
                          label="Bank Account Number"
                          isBadgeVisible={false}
                          isDisabled
                        />
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

FundingInformation.propTypes = {
  getFundingInformation: PropTypes.func.isRequired,
};

FundingInformation.defaultProps = {

};

const mapStateToProps = state => ({
  applications: state.applications,
  navigation: state.navigation,
  fetch: state.fetch,
});

const mapDispatchToProps = dispatch => ({
  getFundingInformation: data => dispatch(getFundingInformation(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(FundingInformation));
