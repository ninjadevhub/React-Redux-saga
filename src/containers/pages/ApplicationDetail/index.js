import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cn from 'classnames';
import { withRouter } from 'react-router-dom';
import dateFNS from 'date-fns';
import get from 'lodash/get';
import _ from 'lodash';
import filter from 'lodash/filter';
import {
  Badge,
  Col,
  Container,
  Row,
} from 'reactstrap';
import Loading from 'react-loading-components';
import Sidebar from 'react-sidebar';
import NotificationSystem from 'react-notification-system';
import ReactTooltip from 'react-tooltip';
import { FilePond } from 'react-filepond';

// components
import { Button } from 'components/Button';
import Select from 'components/Form/Select';
import Card from 'components/Card';

// redux actions
import { nextAction } from 'actions/workflow';
import { getApplications, refundRequest, getRefundReasons, getActiveContract, requestIdByText, getDocumentTags, postIdFront, postIdBack } from 'actions/application';

// utility funcs
import { parseUrlParams } from 'utils/parseUrlParams';
import { states } from 'utils/states';

import { unmaskCurrency } from 'utils/masks';

// requestRefund
import RequestRefund from './RequestRefund';
import './style.scss';
import CheckMark from 'assets/icons/checkmark.svg';

class ApplicationDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isSelectOfferVisible: false,
      isContinueVisible: false,
      isSignContractVisible: false,
      isRequestRefundVisible: false,
      response: null,
      sidebarOpen: false,
      isSubmitting: false,
      refund: null,
      refundReasons: [],
      contract: null,
      hasIdFront: false,
      hasIdBack: false,
      frontIdFile: null,
      backIdFile: null,
      isFrontUploading: false,
      isBackUploading: false,
      isRequesting: false,
    };

    this.filters = JSON.parse(localStorage.getItem('filters'));
  }

  componentDidMount() {
    const params = parseUrlParams(window.location.search);
    this.props.getDocumentTags({
      url: `/documents/applications/${params.applicationId}`,
      success: (res) => {
        if (Array.isArray(res)) {
          _.map(res, (reason) => {
            if (reason.tags) {
              _.map(reason.tags, (tag) => {
                const hasIdFront = tag === 'id front';
                const hasIdBack = tag === 'id back';
                if (hasIdFront) this.setState({ hasIdFront });
                if (hasIdBack) this.setState({ hasIdBack });
              });
            }
          });
        }
      },
      fail: (err) => {
        console.log(err);
      },
    });
    this.props.getApplications({
      url: `/applications/${params.applicationId}?fields=applicationId,lender.label,lender.code,lender.status.label,lender.status.code,status.code,status.aliases.merchantPortal,applicant.firstName,applicant.lastName,applicant.middleName,applicant.email,applicant.ssnLastFour,applicant.dateOfBirth,applicant.addresses.*,applicant.email,applicant.phoneNumbers.*`,
      success: (res) => {
        this.setState({
          response: res,
        });

        const status = get(res, 'status.aliases.merchantPortal') ? get(res, 'status.aliases.merchantPortal').toUpperCase() : '';
        const isRefund = status === 'FUNDED';
        const applicationType = get(res, 'lender.code', 'lusa');
        let isSelectOfferVisible = false;
        let isSignContractVisible = false;
        let isContinueVisible = false;
        let isADF = false;

        switch (applicationType) {
          case 'lusa':
            isSelectOfferVisible = !(get(filter(this.filters, item => item.filterId === 'selectoffer'), '0.attributes.query.statusCode').indexOf(get(res, 'status.code')) === -1);
            break;
          case 'personify':
            isADF = true;
            isSelectOfferVisible = get(res, 'status.code') === '2005' && get(res, 'lender.status.code') === '2004';
            isSignContractVisible = get(res, 'status.code') === '2005' && (get(res, 'lender.status.code') === '2010' || get(res, 'lender.status.code') === '2011');
            isContinueVisible = get(res, 'lender.status.code') === '2000';
            break;
          default:
        }
        this.setState({
          isSelectOfferVisible,
          isSignContractVisible,
          isRequestRefundVisible: isRefund,
          applicationType,
          isADF,
          isContinueVisible,
        });
        if (isRefund) {
          this.loadRefundData();
        }
      },
      fail: (err) => {
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

  onSetSidebarOpen = (open) => {
    this.setState({ sidebarOpen: open });
  }

  loadRefundData = () => {
    this.loadRefunds();
    this.loadRefundReasons();
    this.loadActiveContract();
  }

  loadRefunds = () => {
    const params = parseUrlParams(window.location.search);
    const merchantId = localStorage.getItem('merchantId');
    this.props.getRefundReasons({
      url: `/refunds/search?merchantId=${merchantId}&applicationId=${params.applicationId}&refundStatus=6008&sortBy=createdOn&sortOrder=desc`,
      success: (res) => {
        this.setState({ isLoading: false });
        if (res && res.data.length > 0) {
          // eslint-disable-next-line prefer-destructuring
          const refund = res.data[0];
          this.setState({
            refund,
          });
        }
      },
      fail: (err) => {
        if (err.response) {
          this.notificationSystem.addNotification({
            message: 'fetching refund reasons',
            level: 'error',
            position: 'tc',
          });
        } else {
          console.log('Error', err);
        }
      },
    });
  }

  loadRefundReasons = () => {
    this.props.getRefundReasons({
      url: '/lookup/refund-reasons',
      success: (res) => {
        const reasons = [];
        _.map(res, (reason) => {
          reasons.push({
            title: reason.label,
            value: reason.code,
          });
        });
        this.setState({ refundReasons: reasons });
      },
      fail: (err) => {
        if (err.response) {
          this.notificationSystem.addNotification({
            message: 'fetching refund reasons',
            level: 'error',
            position: 'tc',
          });
        } else {
          console.log('Error', err);
        }
      },
    });
  }

  loadActiveContract = () => {
    const params = parseUrlParams(window.location.search);
    this.props.getActiveContract({
      url: `/offers/application/${params.applicationId}/contract/active`,
      success: (res) => {
        this.setState({ contract: res });
      },
      fail: (err) => {
        if (err.data) {
          this.notificationSystem.addNotification({
            message: err.data.message,
            level: 'error',
            position: 'tc',
          });
        } else {
          console.log('Error', err);
        }
      },
    });
  }

  handleInputChange = (e) => {
    e.preventDefault();
  }

  handleSelectOffer = (e) => {
    e.preventDefault();

    const { applicationType } = this.state;
    const params = parseUrlParams(window.location.search);

    if (params.applicationId) {
      this.setState({ isLoading: true });
      const apiUrl = applicationType === 'lusa' ?
        `/workflows/application/${params.applicationId}/workflow/dtm/step/SelectOffer`
        :
        `/workflows/adf/application/${params.applicationId}/step/OfferSelection`;

      this.props.nextAction({
        data: {},
        url: apiUrl,
        success: (response) => {
          const routeUrl = get(response, applicationType === 'lusa' ? 'state.url' : 'data.url');
          this.props.history.push(routeUrl);
        },
        fail: (error) => { // eslint-disable-line
          this.setState({ isLoading: false });
          this.props.history.push({
            pathname: `/applications/${applicationType === 'lusa' ? 'dtm' : 'personify'}/general-error-page`,
            search: '',
            state: {
              data: error.data,
            },
          });
        },
      });
    }
  }

  handleContinueOffer = (e) => {
    e.preventDefault();

    const { applicationType } = this.state;
    const params = parseUrlParams(window.location.search);

    if (params.applicationId && applicationType !== 'lusa') {
      this.setState({ isLoading: true });
      const apiUrl = `/workflows/adf/application/${params.applicationId}/checkin`;

      this.props.nextAction({
        data: {},
        url: apiUrl,
        success: (response) => {
          const routeUrl = get(response, 'data.url');
          this.props.history.push(routeUrl);
        },
        fail: (error) => { // eslint-disable-line
          this.setState({ isLoading: false });
          this.props.history.push({
            pathname: '/applications/personify/general-error-page',
            search: '',
            state: {
              data: error.data,
            },
          });
        },
      });
    }
  }

  handleSignContract = (e) => {
    e.preventDefault();
    const params = parseUrlParams(window.location.search);

    if (params.applicationId) {
      this.setState({ isLoading: true });
      const apiUrl = `/workflows/adf/application/${params.applicationId}/step/LoanAgreementSignature`;

      this.props.nextAction({
        data: {},
        url: apiUrl,
        success: (response) => {
          const routeUrl = get(response, 'data.url');
          this.props.history.push(routeUrl);
        },
        fail: (error) => { // eslint-disable-line
          this.setState({ isLoading: false });
          this.props.history.push({
            pathname: `/applications/${this.props.match.params.workflowtype}/general-error-page`,
            search: '',
            state: {
              data: error.data,
            },
          });
        },
      });
    }
  }

  handleRequestRefundSubmit = (data) => {
    const params = parseUrlParams(window.location.search);
    if (params.applicationId) {
      this.setState({
        isSubmitting: true,
      });
      this.props.refundRequest({
        url: '/refunds',
        data: {
          applicationId: params.applicationId,
          refundRequestedAmount: parseFloat(unmaskCurrency(data.refundAmount)),
          refundReason: data.reasonForRefund,
          signature: data.signature,
          consentAutomaticDebit: true,
        },
        success: (response) => {
          console.log('succeed', response);
          this.setState({
            sidebarOpen: false,
            isSubmitting: false,
          });
          this.notificationSystem.addNotification({
            message: 'Refund request has been successfully submitted',
            level: 'success',
            position: 'tc',
          });
        },
        fail: (error) => {
          console.log('failed', error);
          this.setState({
            sidebarOpen: true,
            isSubmitting: false,
          });
          this.notificationSystem.addNotification({
            message: (error.data && error.data.message) || 'Refund request submission failed',
            level: 'error',
            position: 'tc',
          });
        },
      });
    }
  }

  handleRequestRefund = (e) => {
    e.preventDefault();
    this.setState({ sidebarOpen: true });
  }

  handleRequestIdByTextSubmit = () => {
    const params = parseUrlParams(window.location.search);
    this.setState({ isRequesting: true });
    if (params.applicationId) {
      this.props.requestIdByText({
        url: `applications/${params.applicationId}/applicant/ida`,
        data: {
          applicationId: params.applicationId,
        },
        success: (response) => {
          console.log('succeed', response);
          this.notificationSystem.addNotification({
            message: 'Request ID via Text has been successfully submitted',
            level: 'success',
            position: 'tc',
          });
          this.setState({ isRequesting: false });
        },
        fail: (error) => {
          console.log('failed', error);
          this.notificationSystem.addNotification({
            message: (error.data && error.data.message) || 'Request ID via Text submission failed',
            level: 'error',
            position: 'tc',
          });
          this.setState({ isRequesting: false });
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
    const { response, isLoading, isRequesting, isSelectOfferVisible, isContinueVisible, isRequestRefundVisible, sidebarOpen, isSubmitting, refundReasons, contract, refund, isSignContractVisible, isADF, hasIdFront, hasIdBack, isFrontUploading, isBackUploading } = this.state;
    const lender = response ? response.lender : null;
    const params = parseUrlParams(window.location.search);

    return (
      <Fragment>
        <NotificationSystem ref={(item) => { this.notificationSystem = item; }} />
        {isRequestRefundVisible &&
          <Sidebar
            sidebar={
              <RequestRefund
                handleBack={() => this.onSetSidebarOpen(false)}
                handleSubmit={data => this.handleRequestRefundSubmit(data)}
                isSubmitting={isSubmitting}
                sidebarOpen={sidebarOpen}
                refund={refund}
                refundReasons={refundReasons}
                contract={contract}
              />
            }
            open={sidebarOpen}
            onSetOpen={this.onSetSidebarOpen}
            pullRight
            styles={{ sidebar: { zIndex: 10000, background: 'white' }, root: { pointerEvents: sidebarOpen ? 'auto' : 'none' } }}
            rootClassName="rootSidebar"
          >
            <div />
          </Sidebar>
        }
        <Container fluid style={{ minHeight: 620 }}>
          <Row>
            <Col sm={{ size: 10, offset: 1 }}>
              <Row className="mb-3 align-items-center">
                <Col md={6} lg={6} xl={8} className="text-center text-md-left">
                  <h3 className="d-lg-flex mb-3 mb-md-0">
                    Application ID: {response && response.applicationId} &nbsp;&nbsp; <Badge color="info" className="mt-1 mt-lg-0">{get(response, 'status.aliases.merchantPortal')}</Badge>
                    {lender && lender.code !== 'lusa' &&
                      <div style={{ display: 'flex' }}>
                        <div style={{ marginLeft: 20 }}>({lender && lender.status ? lender.status.label : ''})</div>
                        <p data-tip="" data-for="test" style={{ height: 16, fontSize: 14 }}>
                          <i className="fa fa-info-circle" />
                        </p>
                        <ReactTooltip id="test" place="right">
                          {lender ? lender.label : ''}
                        </ReactTooltip>
                      </div>
                    }
                  </h3>
                </Col>
                <Col md={6} lg={6} xl={4}>
                  <Container className="p-0" fluid>
                    <Row className="flex-column-reverse flex-sm-row" noGutters>
                      <Col sm={6} className="pr-sm-1">
                        {/* <Button color="secondary" tag="a" href="#" className="w-100" onClick={this.handleCancelClick}>Cancel Contract</Button> */}
                      </Col>
                      {
                        isADF ?
                          <Col sm={6} className="pl-sm-1 mb-1 mb-sm-0">
                            {
                              isContinueVisible &&
                                <Button
                                  color="primary"
                                  tag="a"
                                  href="/application/continue"
                                  className="w-100"
                                  onClick={this.handleContinueOffer}
                                  isLoading={isLoading}
                                >
                                  Continue
                                </Button>
                            }
                            {
                              isSelectOfferVisible &&
                                <Button
                                  color="primary"
                                  tag="a"
                                  href="/application/select-offer"
                                  className="w-100"
                                  onClick={this.handleSelectOffer}
                                  isLoading={isLoading}
                                >
                                  Select Offer
                                </Button>
                            }
                            {
                              isSignContractVisible &&
                                <Button
                                  color="primary"
                                  tag="a"
                                  href="/application/select-offer"
                                  className="w-100"
                                  onClick={this.handleSignContract}
                                  isLoading={isLoading}
                                >
                                  Sign Contract
                                </Button>
                            }
                          </Col>
                          :
                          <Col sm={6} className="pl-sm-1 mb-1 mb-sm-0">
                            {
                              isSelectOfferVisible && !isRequestRefundVisible &&
                                <Button
                                  color="primary"
                                  tag="a"
                                  href="/application/select-offer"
                                  className="w-100"
                                  onClick={this.handleSelectOffer}
                                  isLoading={isLoading}
                                >
                                  Select Offer
                                </Button>
                            }
                            {
                              isRequestRefundVisible &&
                                <Button
                                  color="primary"
                                  className="w-100"
                                  onClick={this.handleRequestRefund}
                                  isLoading={isLoading}
                                >
                                  Request Refund
                                </Button>
                            }
                          </Col>
                      }
                    </Row>
                  </Container>
                </Col>
              </Row>
              <Row style={{ marginTop: 20 }}>
                <Col sm={12} lg={4}>
                  <Card title="Personal Information">
                    <label className="has-value full-width"><span>First Name</span>
                      <input
                        type="text"
                        value={(response && response.applicant.firstName) || ''}
                        readOnly
                      />
                    </label>
                    <label className="has-value full-width"><span>Last Name</span>
                      <input
                        type="text"
                        value={(response && response.applicant.lastName) || ''}
                        readOnly
                      />
                    </label>
                    <label className="has-value full-width"><span>Last 4 SSN</span>
                      <input
                        type="text"
                        value={(response && response.applicant.ssnLastFour) || ''}
                        readOnly
                      />
                    </label>
                    <label className="has-value full-width"><span>Date of Birth</span>
                      <input
                        type="text"
                        value={(response && dateFNS.format(new Date(response.applicant.dateOfBirth), 'MM/DD/YYYY')) || ''}
                        readOnly
                      />
                    </label>
                    <label className="has-value full-width"><span>Email Address</span>
                      <input
                        type="text"
                        value={(response && response.applicant.email) || ''}
                        readOnly
                      />
                    </label>
                    <label className="has-value full-width"><span>Mobile Phone</span>
                      <input
                        type="text"
                        value={(response && response.applicant.phoneNumbers.filter(item => item.isPrimary)[0].number) || ''}
                        readOnly
                      />
                    </label>
                    { !response && this.renderLoadingIndication() }
                  </Card>
                </Col>
                <Col sm={12} lg={4}>
                  <Card title="Borrower Address">
                    <p>Address of the primary borrower</p>
                    <label className="has-value full-width"><span>Street Address</span>
                      <input
                        type="text"
                        value={(response && response.applicant.addresses.filter(item => item.isPrimary)[0].address) || ''}
                        readOnly
                      />
                    </label>
                    <label className="has-value full-width"><span>City</span>
                      <input
                        type="text"
                        value={(response && response.applicant.addresses.filter(item => item.isPrimary)[0].city) || ''}
                        readOnly
                      />
                    </label>
                    <Row>
                      <Col sm={7}>
                        <Select
                          name="applicant.addresses.state"
                          data={states}
                          value={(response && response.applicant.addresses.filter(item => item.isPrimary)[0].state) || 'WA'}
                          onChange={this.handleInputChange}
                          label="State"
                          isDisabled
                          isRequired
                          // hasError={!!errors['applicant.addresses.state']}
                        />
                      </Col>
                      <Col sm={5}>
                        <label className="has-value full-width"><span>Zip Code</span>
                          <input
                            type="text"
                            value={(response && response.applicant.addresses.filter(item => item.isPrimary)[0].zipCode) || ''}
                            readOnly
                          />
                        </label>
                      </Col>
                    </Row>
                    { !response && this.renderLoadingIndication() }
                  </Card>
                </Col>
                <Col sm={12} lg={4}>
                  <Card title="Action Center">
                    <Container fluid>
                      <Row className="justify-content-center">
                        <Col sm={6} md={6} xl={6} className="pb-3">
                          <div className="upload-header">
                            <span>ID Upload - Front</span>
                            {hasIdFront && (
                              <span>
                                <img src={CheckMark} alt="FrontImg" className="has-id-img" />
                              </span>
                            )}
                          </div>
                          {isFrontUploading && (
                            <div className="smarty-upload-loading">
                              <div title="Loading..." className={cn('smarty-dots', 'smarty-addr-29102')} />
                            </div>
                          )}
                          {!isFrontUploading && (
                            <FilePond
                              allowMultiple="true"
                              onupdatefiles={(fileItems) => {
                                const [firstFile] = fileItems;
                                const { file } = firstFile;
                                const isFileDifferent = _.isEqual(file, this.state.frontIdFile);
                                this.setState({
                                  frontIdFile: file,
                                });
                                if (isFileDifferent) {
                                  this.setState({
                                    isFrontUploading: true,
                                  });
                                  const { type } = file;
                                  const fileTypes = type.split('/');
                                  const data = new FormData();
                                  const newFile = new File([file], `LCUSA-${params.applicationId}-DLF.${fileTypes[1]}`);
                                  data.append('file', newFile);
                                  data.append('tag', 'id%20front');
                                  this.props.postIdFront({
                                    url: `documents/applications/${params.applicationId}/upload/id%20front`,
                                    data,
                                    success: (res) => {
                                      console.log('succeed', res);
                                      this.setState({
                                        hasIdFront: true,
                                        isFrontUploading: false,
                                      });
                                      this.notificationSystem.addNotification({
                                        message: 'ID Front has been successfully submitted',
                                        level: 'success',
                                        position: 'tc',
                                      });
                                    },
                                    fail: (error) => {
                                      console.log('failed', error);
                                      this.setState({
                                        isFrontUploading: false,
                                      });
                                      this.notificationSystem.addNotification({
                                        message: (error.data && error.data.message) || 'ID Front submission failed',
                                        level: 'error',
                                        position: 'tc',
                                      });
                                    },
                                  });
                                }
                              }}
                            />
                          )}
                        </Col>
                        <Col sm={6} md={6} xl={6} className="pb-3">
                          <div className="upload-header">
                            <span>ID Upload - Back</span>
                            {hasIdBack && (
                              <span>
                                <img src={CheckMark} alt="BackImg" className="has-id-img" />
                              </span>
                            )}
                          </div>
                          {isBackUploading && (
                            <div className="smarty-upload-loading">
                              <div title="Loading..." className={cn('smarty-dots', 'smarty-addr-29102')} />
                            </div>
                          )}
                          {!isBackUploading && (
                            <FilePond
                              allowMultiple="true"
                              onupdatefiles={(fileItems) => {
                                const [firstFile] = fileItems;
                                const { file } = firstFile;
                                const isFileDifferent = _.isEqual(file, this.state.backIdFile);
                                this.setState({
                                  backIdFile: file,
                                });
                                if (isFileDifferent) {
                                  this.setState({
                                    isBackUploading: true,
                                  });
                                  const { type } = file;
                                  const fileTypes = type.split('/');
                                  const data = new FormData();
                                  const newFile = new File([file], `LCUSA-${params.applicationId}-DLB.${fileTypes[1]}`);
                                  data.append('file', newFile);
                                  data.append('tag', 'id%20back');
                                  this.props.postIdBack({
                                    url: `documents/applications/${params.applicationId}/upload/id%20back`,
                                    data,
                                    success: (res) => {
                                      console.log('succeed', res);
                                      this.setState({
                                        hasIdBack: true,
                                        isBackUploading: false,
                                      });
                                      this.notificationSystem.addNotification({
                                        message: 'ID Back has been successfully submitted',
                                        level: 'success',
                                        position: 'tc',
                                      });
                                    },
                                    fail: (error) => {
                                      console.log('failed', error);
                                      this.setState({
                                        isBackUploading: false,
                                      });
                                      this.notificationSystem.addNotification({
                                        message: (error.data && error.data.message) || 'ID Back submission failed',
                                        level: 'error',
                                        position: 'tc',
                                      });
                                    },
                                  });
                                }
                              }}
                            />
                          )}
                        </Col>
                      </Row>
                      <Row className="justify-content-center">
                        <div> - OR - </div>
                        <br />
                        <br />
                      </Row>
                      <Row className="justify-content-center">
                        <Col sm={10} md={10} xl={10} className="pb-3">
                          <Button
                            color="primary"
                            tag="a"
                            href="#"
                            className="w-100 whilte-space-normal"
                            isLoading={isRequesting}
                            onClick={this.handleRequestIdByTextSubmit}
                          >
                            REQUEST ID via TEXT
                          </Button>
                        </Col>
                      </Row>
                    </Container>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </Fragment>
    );
  }
}

ApplicationDetail.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  getApplications: PropTypes.func.isRequired,
  refundRequest: PropTypes.func.isRequired,
  getRefundReasons: PropTypes.func.isRequired,
  getActiveContract: PropTypes.func.isRequired,
  requestIdByText: PropTypes.func.isRequired,
  getDocumentTags: PropTypes.func.isRequired,
  postIdFront: PropTypes.func.isRequired,
  postIdBack: PropTypes.func.isRequired,
  nextAction: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  applications: state.applications,
  navigation: state.navigation,
  fetch: state.fetch,
});

export default connect(
  mapStateToProps,
  {
    getApplications,
    refundRequest,
    getRefundReasons,
    getActiveContract,
    requestIdByText,
    getDocumentTags,
    postIdFront,
    postIdBack,
    nextAction,
  }
)(withRouter(ApplicationDetail));
