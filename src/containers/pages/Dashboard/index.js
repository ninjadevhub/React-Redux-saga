import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { get, findIndex } from 'lodash';
import './style.scss';

import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  Col,
  Container,
  ListGroup,
  ListGroupItem,
  Row,
} from 'reactstrap';

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  // linearGradient,
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';

import Loading from 'react-loading-components';
import Input from 'components/Form/Input';

import {
  getStats,
  getFeatures,
} from 'actions/application';
import { formatCurrency } from 'utils/func';

// Chart Data
const progressData = [
  { name: 'Progress', value: 75 },
];
const YTDData = [
  { month: 'OCT', Applications: 0 },
  { month: 'NOV', Applications: 20 },
  { month: 'DEC', Applications: 50 },
  { month: 'JAN', Applications: 65 },
  { month: 'FEB', Applications: 85 },
  { month: 'MAR', Applications: 125 },
  { month: 'APR', Applications: 145 },
  { month: 'MAY', Applications: 200 },
  { month: 'JUN', Applications: 270 },
  { month: 'JUL', Applications: 310 },
  { month: 'AUG', Applications: 330 },
  { month: 'SEP', Applications: 375 },
];
class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchQuery: '',
      data: null,
      isLoading: true,
      features: null,
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeydown, false);

    this.getStats();
    this.getFeatures();
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeydown, false);
    sessionStorage.setItem('visitedDashboard', true);
  }

  getStats = () => {
    this.props.getStats({
      url: `/stats/merchant/${localStorage.getItem('merchantId')}/portal/lusa`,
      success: (res) => {
        this.setState({
          data: res,
          isLoading: false,
        });
      },
      fail: (res) => {
        console.log(res);
      },
    });
  }

  getFeatures = () => {
    this.props.getFeatures({
      url: `/merchants/${localStorage.getItem('merchantId')}/features`,
      success: (res) => {
        this.setState({
          features: res,
          isLoading: false,
        });
      },
      fail: (res) => {
        console.log(res);
      },
    });
  }

  handleSubmitFrom = (data, e) => {
    e.preventDefault();
  }

  handleClickButton = (url, e) => {
    e.preventDefault();
    const { history } = this.props;
    history.push(url);
  }

  handleKeydown = (event) => {
    if (event.keyCode === 13) {
      this.props.history.push(`/dashboard/application-review/action/AllApplications/${this.state.searchQuery}`);
    }
  }

  handleChange = (e) => {
    e.preventDefault();

    this.setState({
      searchQuery: e.target.value,
    });
  }

  handleButtonClick = (type) => {
    switch (type) {
      case 'needSignatures':
        this.props.history.push('/dashboard/application-review/action/ContractSent');
        break;
      case 'approvalsDueToExpire':
        this.props.history.push('/dashboard/application-review/action/ApprovalsDueToExpire');
        break;
      case 'needInfo':
        this.props.history.push('/dashboard/application-review/action/InfoRequired');
        break;
      default:
        this.props.history.push('/dashboard/application-review/action/AllApprovals');
    }
  }

  render() {
    const {
      data,
      isLoading,
      features,
    } = this.state;
    const { isApplicationReviewDataLoaded } = this.props;
    const t2aIndex = findIndex(features, item => item.code === 't2a');
    const isT2aEnabled = get(features, `${t2aIndex}.value`) === 'Enabled';
    const visitedDashboard = sessionStorage.getItem('visitedDashboard');
    const merchantName = localStorage.businessName;

    return (
      <div className={`page-dashboard ${visitedDashboard ? 'noAnimations' : ''} m-auto`}>
        <Container fluid>
          <Row className="mb-3 mt-1 align-items-center">
            <Col md={6} className="text-center text-md-left animated fadeInUp nameContainer">
              <h3>Welcome, {merchantName}!</h3>
              <p className="m-0">You have <strong className="text-primary cursor-pointer" onClick={this.handleClickButton.bind(null, '/dashboard/application-review/action/AllApprovals')}>{get(data, 'loanApprovals')} pre-approved applications</strong> that need action</p>
            </Col>
            <Col md={6} className="text-right d-none d-md-flex justify-content-end align-items-center animated fadeInUp delay-2s">
              <div>
                <h5 className="mb-0"><span className="text-success">75%</span> to VIP Status</h5>
                <p className="mb-0"><small>113/150 Applications</small></p>
                <Link to="/dashboard"><small>Learn More</small></Link>
              </div>
              <div className="progress-bar-small ml-3">
                <PieChart width={80} height={80} onMouseEnter={this.onPieEnter}>
                  <Pie
                    data={progressData}
                    cx={35}
                    cy={35}
                    innerRadius={35}
                    outerRadius={40}
                    startAngle={-90}
                    endAngle={-360}
                    fill="#04BC6C"
                    paddingAngle={2}
                    animationBegin={2000}
                    dataKey="value"
                  >
                    {
                      // eslint-disable-next-line
                      progressData.map(entry => <Cell />)
                    }
                  </Pie>
                </PieChart>
                <div className="center-content"><img src="/icons/vip.svg" alt="VIP" /></div>
              </div>
            </Col>
          </Row>

          <Row>
            <Col md={6} lg={4}>

              <div className="animated fadeInUp delay-200ms" onClick={this.handleClickButton.bind(null, '/applications/dtm/application')}>
                <Card inverse color="primary" tag="a" href="#">
                  <CardBody>
                    <div className="d-flex align-items-center">
                      <div className="icon-bubble mr-3"><img src="icons/lusa-logo.svg" alt="LendingUSA" className="m-1" /></div>
                      <h3 className="text-white">Start here to submit a new application</h3>
                    </div>
                  </CardBody>
                  <Button color="primary" tag="div">Start New Application</Button>
                </Card>
              </div>

              <Card className="animated fadeInUp delay-300ms">
                <CardHeader>Check App Status</CardHeader>
                <CardBody>
                  <Form>
                    <FormGroup className="mb-0 input-inline input-btn-inline">
                      <Input
                        type="text"
                        name="applicant"
                        id="applicantSearch"
                        value={this.state.searchQuery}
                        onChange={this.handleChange}
                        label="Applicant Name Or Application ID"
                        isBadgeVisible={false}
                        isErrorVisible={false}
                      />
                      <Button color="primary" className="btn-icon app-status-button" tag="a"><img src="icons/arrow-right.svg" alt="Submit" /></Button>
                    </FormGroup>
                  </Form>
                </CardBody>
              </Card>

              {/* <Card className="animated fadeInUp delay-600ms">
                <ListGroup>
                  {
                    isT2aEnabled &&
                    <ListGroupItem tag="a" href="#" className="d-flex" onClick={this.handleClickButton.bind(null, '/dashboard/text-apply')}>
                      <div className="icon-bubble mr-2"><img src="icons/text-to-apply.svg" alt="Text to Apply" /></div>
                      <div>
                        <h5 className="mb-0">Text to Apply &nbsp;<Badge color="warning">BETA</Badge></h5>
                        <small>Text application link to your customer</small>
                      </div>
                    </ListGroupItem>
                  }
                  <ListGroupItem tag="a" href="#" className="d-flex" onClick={isApplicationReviewDataLoaded ? this.handleClickButton.bind(null, '/dashboard/application-review/action/AllApplications') : undefined}>
                    <div className="icon-bubble mr-2"><img src="icons/review.svg" alt="Review" /></div>
                    <div>
                      <h5 className="mb-0">Review Applications</h5>
                      <small>View current and past applications</small>
                    </div>
                  </ListGroupItem> */}
              {/* <ListGroupItem tag="a" href="#" className="d-flex">
                    <div className="icon-bubble mr-2"><img src="icons/merchant-resources.svg" alt="Merchant Resources" /></div>
                    <div>
                      <h5 className="mb-0">Merchant Resources &nbsp;<Badge color="warning">NEW</Badge></h5>
                      <small>Your LendingUSA Knowledge Base</small>
                    </div>
                  </ListGroupItem> */}
              {/* </ListGroup>
              </Card> */}
              <Card className="animated fadeInUp delay-600ms">
                <CardHeader>Merchant Tools</CardHeader>
                <ListGroup>
                  {
                    isT2aEnabled &&
                    <ListGroupItem tag="a" href="#" className="d-flex" onClick={this.handleClickButton.bind(null, '/dashboard/text-apply')}>
                      <div className="icon-bubble mr-2"><img src="icons/text-to-apply.svg" alt="Text to Apply" /></div>
                      <div>
                        <h5 className="mb-0">Text to Apply &nbsp;<Badge color="warning">NEW</Badge></h5>
                        <small>Text application link to your customer</small>
                      </div>
                    </ListGroupItem>
                  }
                  <ListGroupItem tag="a" href="#" className="d-flex" onClick={isApplicationReviewDataLoaded ? this.handleClickButton.bind(null, '/dashboard/application-review/action/AllApplications') : undefined}>
                    <div className="icon-bubble mr-2"><img src="icons/review.svg" alt="Review" /></div>
                    <div>
                      <h5 className="mb-0">Review Applications</h5>
                      <small>View current and past applications</small>
                    </div>
                  </ListGroupItem>
                  <ListGroupItem tag="a" href="/brochures" className="d-flex">
                    <div className="icon-bubble mr-2"><img src="icons/brochures.svg" alt="Request Brochures" /></div>
                    <div>
                      <h5 className="mb-0">Request Brochures</h5>
                      <small>Order more physical brochures</small>
                    </div>
                  </ListGroupItem>
                </ListGroup>
              </Card>
            </Col>
            <Col md={6} lg={4}>

              <Card className="animated fadeInUp delay-400ms">
                <CardHeader>Action Center</CardHeader>
                <CardBody>
                  <Container fluid className="mt-1">

                    <Row className="text-center mb-1">
                      <Col xs={6} className="mb-3">
                        <Link to="/dashboard/application-review/action/ContractSent" className="d-flex flex-column">
                          <div className="icon-bubble large ml-auto mr-auto mb-2">
                            <img src="icons/signature.svg" alt="Need Signature" />
                            <Badge pill color="danger" className="top-right">{get(data, 'needSignatures')}</Badge>
                          </div>
                          <h5 className="m-0">Need Signature</h5>
                        </Link>
                      </Col>
                      <Col xs={6} className="mb-3">
                        <Link to="/dashboard/application-review/action/ApprovalsDueToExpire" className="d-flex flex-column">
                          <div className="icon-bubble large ml-auto mr-auto mb-2">
                            <img src="icons/expire.svg" alt="Due to Expire" />
                            <Badge pill color="danger" className="top-right">{get(data, 'approvalsDueToExpire')}</Badge>
                          </div>
                          <h5 className="m-0">Due to Expire</h5>
                        </Link>
                      </Col>
                      <Col xs={6} className="d-flex flex-column">
                        <Link to="/dashboard/application-review/action/InfoRequired" className="d-flex flex-column">
                          <div className="icon-bubble large  ml-auto mr-auto mb-2">
                            {
                              isLoading ?
                                <Loading type="puff" fill="#3989E3" width={50} height={50} />
                              :
                                <h3 className="mb-0">{get(data, 'needInfo')}</h3>
                            }
                            <small>Total</small>
                          </div>
                          <h5 className="m-0">Need Info</h5>
                        </Link>
                      </Col>
                      <Col xs={6} className="d-flex flex-column">
                        <Link to="/dashboard/application-review/action/AppInitiated" className="d-flex flex-column">
                          <div className="icon-bubble large  ml-auto mr-auto mb-2">
                            {
                              isLoading ?
                                <Loading type="puff" fill="#3989E3" width={50} height={50} />
                              :
                                <h3 className="mb-0">{get(data, 'appInitiated')}</h3>
                            }
                            <small>Total</small>
                          </div>
                          <h5 className="m-0">Incomplete</h5>
                        </Link>
                      </Col>
                    </Row>

                  </Container>
                </CardBody>
              </Card>

              {/* <Card className="animated fadeInUp delay-700ms">
                <CardHeader>Merchant Resources</CardHeader>
                <ListGroup className="pt-0">
                  <ListGroupItem tag="a" href="#" className="d-flex" onClick={this.handleClickButton.bind(null, '/dashboard/web-banners')}>
                    <div className="icon-bubble mr-2"><img src="icons/banners.svg" alt="Website Banners" /></div>
                    <div>
                      <h5 className="mb-0">Website Banners</h5>
                      <small>Get embed codes for your website</small>
                    </div>
                  </ListGroupItem>
                  <ListGroupItem tag="a" href="#" className="d-flex" onClick={this.handleClickButton.bind(null, '/dashboard/request-brochures')}>
                    <div className="icon-bubble mr-2"><img src="icons/brochures.svg" alt="Request Brochures" /></div>
                    <div>
                      <h5 className="mb-0">Request Brochures</h5>
                      <small>Order more physical brochures</small>
                    </div>
                  </ListGroupItem>
                </ListGroup>
              </Card> */}
              <Card className="animated fadeInUp delay-700ms">
                <CardHeader>Knowledge Base</CardHeader>
                <ListGroup className="pt-0">
                  <ListGroupItem className="training-videos">
                    <Row>
                      <h6 className="w-100 text-center letter-space-for-h6">TRAINING VIDEOS</h6>
                    </Row>
                    <Row>
                      <Col xs="4">
                        <Link to="/" className="video-link">
                          <div className="video-preview video1" style={{ backgroundImage: 'url(images/video1.jpg)' }}>
                            <img src="icons/play.svg" height="12" alt="Play Video" />
                          </div>
                          <span>Welcome</span>
                        </Link>
                      </Col>
                      <Col xs="4">
                        <Link to="/" className="video-link">
                          <div className="video-preview video2" style={{ backgroundImage: 'url(images/video2.jpg)' }}>
                            <img src="icons/play.svg" height="12" alt="Play Video" />
                          </div>
                          <span>Your Portal</span>
                        </Link>
                      </Col>
                      <Col xs="4">
                        <Link to="/" className="video-link">
                          <div className="video-preview video3" style={{ backgroundImage: 'url(images/video3.jpg)' }}>
                            <img src="icons/play.svg" height="12" alt="Play Video" />
                          </div>
                          <span>Action Center</span>
                        </Link>
                      </Col>
                    </Row>
                  </ListGroupItem>
                  <ListGroupItem tag="a" href="#" className="d-flex" onClick={this.handleClickButton.bind(null, '/dashboard/web-banners')}>
                    <div className="icon-bubble mr-2"><img src="icons/banners.svg" alt="Website Banners" /></div>
                    <div>
                      <h5 className="mb-0">Website Banners</h5>
                      <small>Get embed codes for your website</small>
                    </div>
                  </ListGroupItem>
                  <ListGroupItem tag="a" href="/banners" className="d-flex">
                    <div className="icon-bubble mr-2"><img src="icons/merchant-resources.svg" alt="Merchant Resources" /></div>
                    <div>
                      <h5 className="mb-0">Merchant Resources</h5>
                      <small>Best practices, website banners & more</small>
                    </div>
                  </ListGroupItem>
                </ListGroup>
              </Card>

            </Col>
            <Col md={6} lg={4}>
              <Card className="animated fadeInUp delay-500ms">
                <CardHeader>Loan Stats</CardHeader>
                <ButtonGroup size="sm" className="d-flex">
                  <Button color="primary">Week</Button>
                  <Button color="primary">MTD</Button>
                  <Button color="primary" active>YTD</Button>
                </ButtonGroup>
                <CardBody className="no-border">
                  <ResponsiveContainer className="card-chart">
                    <AreaChart data={YTDData}>
                      <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3989E3" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#3989E3" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" tickLine={false} interval={0} fontSize="10" tickSize={10} dx={13} />
                      <CartesianGrid stroke="#E7E7E7" vertical={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="Applications" strokeWidth="3" stroke="#AACEF6" fillOpacity={1} fill="url(#colorUv)" animationBegin={900} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardBody>
                <ListGroup className="pt-0">
                  <ListGroupItem className="text-center">
                    <Row>
                      <Col className="d-flex align-items-center">
                        <h6 className="mb-0 text-left">
                          TOTAL LOANS APPROVED<br />
                          <span className="text-muted">YEAR TO DATE</span>
                        </h6>
                      </Col>
                      <Col className="text-right">
                        <h2 className="text-primary mb-1">${formatCurrency(get(data, 'loansApproved') || '0', 2)}</h2>
                      </Col>
                    </Row>
                  </ListGroupItem>
                </ListGroup>
              </Card>
              {/* <Card className="animated fadeInUp delay-500ms">
                <CardHeader>Loan Stats</CardHeader>
                <CardBody>
                  <Row>
                    <Col className="text-center" md={6} sm={12}>
                      {
                        isLoading ?
                          <Loading type="puff" fill="#3989E3" width={50} height={50} />
                        :
                          <h2 className="text-primary mb-1">{get(data, 'appsSubmittedMTD') || 0}</h2>
                      }
                      <h5 className="mb-0">Apps Submitted MTD</h5>
                    </Col>
                    <Col className="text-center" md={6} sm={12}>
                      {
                        isLoading ?
                          <Loading type="puff" fill="#3989E3" width={50} height={50} />
                        :
                          <h2 className="text-primary mb-1">{get(data, 'appsSubmittedYTD') || 0}</h2>
                      }
                      <h5 className="mb-0">Apps Submitted YTD</h5>
                    </Col>
                  </Row>
                </CardBody>
                <ListGroup className="pt-0">
                  <ListGroupItem className="text-center">
                    {
                      isLoading ?
                        <Loading type="puff" fill="#3989E3" width={50} height={50} />
                      :
                        <h2 className="text-primary mb-1">${formatCurrency(get(data, 'loansApproved') || '0', 2)}</h2>
                    }
                    <h5>Total Loans Approved – Year to Date</h5>
                  </ListGroupItem>
                </ListGroup>
              </Card> */}
              {/* <Card className="animated fadeInUp delay-800ms">
                <ListGroup>
                  <ListGroupItem tag="a" href="#" className="d-flex" onClick={this.handleClickButton.bind(null, '/dashboard/refunds/All')}>
                    <div className="icon-bubble mr-2"><img src="icons/review.svg" alt="Review" /></div>
                    <div>
                      <h5 className="mb-0">Refunds</h5>
                      <small>View current and past applications</small>
                    </div>
                  </ListGroupItem>
                </ListGroup>
              </Card> */}

              {/* <Card className="animated fadeInUp delay-800ms">
                <ListGroup>
                  <ListGroupItem tag="a" href="#" className="d-flex">
                    <div className="icon-bubble mr-2"><img src="icons/support.svg" alt="Merchant Support" /></div>
                    <div>
                      <h5 className="mb-0">Merchant Support</h5>
                      <small>Have a question? Contact us</small>
                    </div>
                  </ListGroupItem>
                </ListGroup>
              </Card> */}
              <Card className="animated fadeInUp delay-800ms">
                <CardHeader>Transaction Tools</CardHeader>
                <ListGroup>
                  <ListGroupItem tag="a" href="#" className="d-flex">
                    <div className="icon-bubble mr-2">
                      <img src="icons/completion-date.svg" alt="Confirm Completion Date" />
                      <Badge pill color="danger" className="top-right">3</Badge>
                    </div>
                    <div>
                      <h5 className="mb-0">Confirm Completion Date &nbsp;<Badge color="warning">NEW</Badge></h5>
                      <small>Confirm the completion date of<br className="d-lg-none d-xl-block" /> service and products provided</small>
                    </div>
                  </ListGroupItem>
                  <ListGroupItem tag="a" href="#" className="d-flex" onClick={this.handleClickButton.bind(null, '/dashboard/refunds/All')}>
                    <div className="icon-bubble mr-2">
                      <img src="icons/refund.svg" alt="Request Refund" />
                      <Badge pill color="danger" className="top-right">1</Badge>
                    </div>
                    <div>
                      <h5 className="mb-0">Request Refund &nbsp;<Badge color="warning">NEW</Badge></h5>
                      <small>Start the process for a refund</small>
                    </div>
                  </ListGroupItem>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

Dashboard.propTypes = {
  history: PropTypes.object.isRequired,
  getStats: PropTypes.func.isRequired,
  getFeatures: PropTypes.func.isRequired,
  isApplicationReviewDataLoaded: PropTypes.bool.isRequired,
};

export default compose(
  withRouter,
  connect(
    state => ({
      auth: state.auth,
    }),
    {
      getStats,
      getFeatures,
    }
  )
)(Dashboard);
