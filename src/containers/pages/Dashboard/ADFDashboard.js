import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';

import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
} from 'reactstrap';

import {
  getStats,
} from 'actions/application';

// Chart Data
// const progressData = [
//   { name: 'Progress', value: 75 },
// ];
// const YTDData = [
//   { month: 'OCT', Applications: 0 },
//   { month: 'NOV', Applications: 20 },
//   { month: 'DEC', Applications: 50 },
//   { month: 'JAN', Applications: 65 },
//   { month: 'FEB', Applications: 85 },
//   { month: 'MAR', Applications: 125 },
//   { month: 'APR', Applications: 145 },
//   { month: 'MAY', Applications: 200 },
//   { month: 'JUN', Applications: 270 },
//   { month: 'JUL', Applications: 310 },
//   { month: 'AUG', Applications: 330 },
//   { month: 'SEP', Applications: 375 },
// ];
class ADFDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    this.getStats();
  }

  componentWillUnmount() {
    sessionStorage.setItem('visitedDashboard', true);
  }

  getStats = () => {
    this.props.getStats({
      url: `/stats/merchant/${localStorage.getItem('merchantId')}/portal/lusa`,
      success: (res) => {
        this.setState({
          data: res,
        });
      },
      fail: (res) => {
        console.log(res);
      },
    });
  }

  handleClickButton = (url, e) => {
    e.preventDefault();
    const { history } = this.props;
    history.push(url);
  }

  render() {
    const {
      data,
    } = this.state;
    const visitedDashboard = sessionStorage.getItem('visitedDashboard');
    const merchantName = localStorage.businessName;

    return (
      <div className={`page-dashboard ${visitedDashboard ? 'noAnimations' : ''}`}>
        <Container fluid>
          <Row className="mb-3 align-items-center">
            <Col md={6} className="text-center text-md-left animated fadeInUp nameContainer">
              <h3>Welcome, {merchantName}!</h3>
              <p className="m-0">You have <strong className="text-primary cursor-pointer" onClick={this.handleClickButton.bind(null, '/dashboard/application-review/action/AllApprovals')}>{get(data, 'loanApprovals')} pre-approved applications</strong> that need action</p>
            </Col>
            {/* <Col md={6} className="text-right d-none d-md-flex justify-content-end align-items-center animated fadeInUp delay-2s">
              <div>
                <h5 className="mb-0"><span className="text-warning">75%</span> to VIP Status</h5>
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
                    fill="#FF954E"
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
            </Col> */}
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

            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

ADFDashboard.propTypes = {
  history: PropTypes.object.isRequired,
  getStats: PropTypes.func.isRequired,
};

export default compose(
  withRouter,
  connect(
    state => ({
      auth: state.auth,
    }),
    {
      getStats,
    }
  )
)(ADFDashboard);
