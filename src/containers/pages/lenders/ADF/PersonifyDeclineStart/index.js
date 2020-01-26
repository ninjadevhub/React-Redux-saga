/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import get from 'lodash/get';
import {
  Card,
  CardBody,
  Col,
  Container,
  CustomInput,
  Form,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from 'reactstrap';
import { Button } from 'components/Button';
import { parseUrlParams } from 'utils/parseUrlParams';
import { nextAction } from 'actions/workflow';
import PersonifyLogo from 'assets/images/personify-logo.png';
import LoanDeclined from 'assets/icons/loan-declined.svg';

class PersonifyDeclineStart extends Component {
  state = {
    modal: false,
    agreeChecked: false,
    isLoading: false,
  }

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

  handleModal = (e) => {
    e.preventDefault();

    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleCheck = () => {
    this.setState({ agreeChecked: !this.state.agreeChecked });
  }

  handleCheckBtn = () => {
    this.setState({
      agreeChecked: true,
      modal: false,
    });
  }

  handleContinueClick = (e) => {
    e.preventDefault();

    const params = parseUrlParams(window.location.search);
    this.setState({ isLoading: true });
    this.props.nextAction({
      data: {},
      url: `/workflows/adf/${params.key}/next`,
      success: (response) => {
        this.setState({ isLoading: false });
        this.props.history.push(response.data.url);
      },
      fail: (error) => { // eslint-disable-line
        this.setState({ isLoading: false });
        if (get(error, 'status') === 400) {
          this.props.history.push({
            pathname: '/personify/error',
            search: `key=${params.key}`,
            state: {
              data: get(error, 'data.failure'),
            },
          });
        } else if (get(error, 'status') === 504) {
          this.props.history.push({
            pathname: '/personify/timeout',
            search: `key=${params.key}`,
          });
        } else {
          this.props.history.push({
            pathname: '/personify/error',
            search: `key=${params.key}`,
          });
        }
      },
    });
  }

  render() {
    const { modal, agreeChecked, isLoading } = this.state;

    return (
      <div className="page-personify">
        <Container>

          <Row className="mb-3 mt-4">
            <Col xs={12} md={9} lg={5} className="text-center ml-auto mr-auto">
              <img src={LoanDeclined} alt="Declined" className="mb-3" />
              <h3 className="ml-auto mr-auto mb-2">Unfortunately, LendingUSA is unable to approve your application for a loan</h3>
              <p className="mb-3">You will receive an adverse action notice within 30 days that will provide you with the specific reason(s) as to why we were unable to approve your application for a Cross River Bank loan.</p>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={9} lg={5} className="text-center ml-auto mr-auto mb-3">
              <h3 className="mb-3">But wait! You might still qualify with a different lender</h3>
              <Card color="primary">
                <Form>
                  <CardBody>
                    <h4 className="mb-3 mt-1 text-white">Our partner, Personify Financial offers personal loans with APR&apos;s starting at 40.00%. Find out if you are approved in just a few steps!</h4>
                    <img src={PersonifyLogo} alt="Personify Financial" width="246" className="mb-3" />
                    <FormGroup className="mb-3">
                      <CustomInput type="checkbox" id="disclosuresCheckbox" label="I've read and agree to" className="mr-0 text-white bumper-checkbox" inline checked={agreeChecked} onChange={this.handleModal} />
                      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}&nbsp;
                      <a href="#" onClick={this.handleModal} className="text-white"><u>Personify’s Disclosures</u></a>
                    </FormGroup>
                    <Button
                      color="personify"
                      className="w-100"
                      disabled={!agreeChecked || isLoading}
                      onClick={this.handleContinueClick}
                      isLoading={isLoading}
                    >
                      Yes, I&apos;m Interested
                    </Button>
                  </CardBody>
                </Form>
              </Card>
              <Link to="/dashboard" className="text-secondary">No thank you, I&apos;m not interested</Link>
            </Col>
          </Row>

        </Container>

        <Modal isOpen={modal} toggle={this.handleModal} size="lg" className="modal-personify">
          <ModalHeader toggle={this.handleModal}>Personify Financial</ModalHeader>
          <ModalBody>
            Personify Financial (“Personify”) offers installment consumer loans (“Loans”) ranging from $1,000 to $10,000 made by First Electronic Bank (&quot;Lender&quot;), a Utah-chartered industrial bank located in Salt Lake City, Utah, member FDIC. Personify works with First Electronic Bank to originate installment loans made by First Electronic Bank using the Personify Platform. The APR’s on these Loans range from 40.00% APR to 99.99% APR. By clicking ‘Yes, I&apos;m Interested’, you consent for LendingUSA to share your personally identifiable information with Personify and its Lender. By clicking ‘Yes, I&apos;m Interested’ you also agree that you have read this disclaimer, understand it, and agree to be bound by it. Upon clicking ‘Yes, I&apos;m Interested’ you and the data that you provided in your LendingUSA application will be forwarded to Personify and its Lender. Your use of the products, or services provided to you by Personify and/or its Lender will be subject to their terms and conditions, terms of use, and privacy policies and you should carefully review them. If you decide to purchase a product or service from Personify and/or its Lender, that transaction, and the use of those products and services will be between you, Personify, and its Lender. LendingUSA and Cross River Bank are not parties to your financial transaction with Personify and its Lender. LendingUSA and Cross River Bank do not assume any responsibility or liability for the actions or representations of Personify, its Lender, its affiliates or other third parties. LendingUSA provides you with access to Personify as a convenience, however, if your Loan application is approved by Personify and subsequently funded, we may receive compensation from Personify in connection with this transaction.
          </ModalBody>
          <ModalFooter>
            <Button color="personify" onClick={this.handleCheckBtn} className="ml-auto mr-auto">I Understand &amp; Agree</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

PersonifyDeclineStart.propTypes = {
  history: PropTypes.object.isRequired,
  nextAction: PropTypes.func.isRequired,
  workflow: PropTypes.object.isRequired,
};

export default connect(
  state => ({
    workflow: state.workflow,
  }),
  {
    nextAction,
  }
)(PersonifyDeclineStart);
