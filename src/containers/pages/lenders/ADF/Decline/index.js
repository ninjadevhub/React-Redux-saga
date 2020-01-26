import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import get from 'lodash/get';
import { connect } from 'react-redux';
import {
  Button,
  Col,
  Container,
  Row,
} from 'reactstrap';
import CircleDeclined from 'assets/icons/circle-declined.svg';
import { parseUrlParams } from 'utils/parseUrlParams';

class PersonifyDecline extends Component {
  componentWillMount() {
    const params = parseUrlParams(window.location.search);
    const { history, workflow } = this.props;

    if (!params.key) {
      history.push('/dashboard');
    }

    if (get(workflow, 'data') === undefined) {
      history.push(`/personify/checkin?key=${params.key}`);
    }
  }

  renderDeclineContent = (reasonCode) => {
    switch (reasonCode) {
      case 'mla':
        return (
          <Fragment>
            <h2 className="mb-2">Unfortunately, we are not able to offer you a loan at this time.</h2>
            <p className="mb-2">You indicated that you are an active duty service member or a dependent of one. Federal regulations set the maximum Annual Percentage Rate(APR) for which active duty service members and their dependents are eligible, regardless of their creditworthiness. At this time, we are not able to offer you a loan with an APR allowable under these regulations. For more information, please visit the official <a href="https://mla.dmdc.osd.mil/">Military Lending Act website.</a></p>
            <small className="mb-4">Thank you for applying for a loan with Personify Financial. We hope we will be able to serve you in the future.</small>
          </Fragment>
        );
      case 'bk':
        return (
          <Fragment>
            <img src={CircleDeclined} alt="Declined" className="mb-3" />
            <h2 className="mb-2">
              Thanks for applying.
              Unfortunately, none of our available loan programs match your current profile.
            </h2>
            <p className="mb-4">We&apos;re grateful that you considered Personify Financial for your borrowing needs, and we hope we can help you sometime in the future.</p>
          </Fragment>
        );
      case 'freeze':
        return (
          <Fragment>
            <img src={CircleDeclined} alt="Declined" className="mb-3" />
            <h2 className="mb-2">
              We&apos;re sorry.
            </h2>
            <p>
              Thank you for requesting a loan with us.
              Unfortunately, we were unable to verify your credit history due to a block or freeze on your credit file.
              You can restart your loan request once you resolve the matter with the credit bureau. Thank you.
            </p>
          </Fragment>
        );
      default:
        return (
          <Fragment>
            <img src={CircleDeclined} alt="Declined" className="mb-3" />
            <h2 className="mb-2">Unfortunately, we were unable to approve your application at this time.</h2>
            <p className="mb-4">You will receive an adverse action notice within 30 days that will provide you with specific reason(s) as to why we were unable to approve your application.</p>
          </Fragment>
        );
    }
  }

  render() {
    const { workflow } = this.props;
    const reasonCode = get(workflow, 'data.declineReason');
    return (
      <div className="page-personify narrow">
        <Container>
          <Row>
            <Col lg={10} className="text-center mb-2 mt-2 mt-md-5 ml-auto mr-auto align-item-center">
              {
                this.renderDeclineContent(reasonCode)
              }
              <Button tag={Link} to="/dashboard" color="personify" size="lg" className="mb-2 mt-1">Return to Dashboard</Button>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

PersonifyDecline.propTypes = {
  history: PropTypes.object.isRequired,
  workflow: PropTypes.object.isRequired,
};

export default connect(state => ({
  workflow: state.workflow,
}))(PersonifyDecline);

