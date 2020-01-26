import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import get from 'lodash/get';
import {
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  Col,
  Collapse,
  Container,
  Form,
  FormGroup,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from 'reactstrap';

import { Button } from 'components/Button';
import Input from 'components/Form/Input';
import Validator from 'components/Validator/Validator';
import { nextAction } from 'actions/workflow';
import { parseUrlParams } from 'utils/parseUrlParams';
import { numberMask } from 'utils/masks';
import schema from './schema';

class PersonifyACH extends Component {
  state = {
    modal: false,
    isLoading: false,
  }

  componentWillMount() {
    const params = parseUrlParams(window.location.search);
    const { history, workflow, validator: { setValues } } = this.props;

    if (!params.key) {
      history.push('/dashboard');
    }

    if (get(workflow, 'data') === undefined || get(workflow, 'activity') !== 'AutoPay') {
      history.push(`/personify/checkin?key=${params.key}`);
    }

    setValues({
      bankAccountFirstName: '',
      bankAccountLastName: '',
      routingNumber: '',
      bankAccountNumber: '',
      enableAutoPay: true,
      showCheckingAccountForm: get(workflow, 'data.showCheckingAccountForm'),
    });
  }

  onCheckboxBtnClick = (selected) => {
    const index = this.state.cSelected.indexOf(selected);
    if (index < 0) {
      this.state.cSelected.push(selected);
    } else {
      this.state.cSelected.splice(index, 1);
    }
    this.setState({ cSelected: [...this.state.cSelected] });
  }

  handleRadioBtnClick = (rSelected) => {
    const { validator: { onChangeHandler } } = this.props;
    onChangeHandler('enableAutoPay', rSelected);
  }

  handleModal = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const params = parseUrlParams(window.location.search);

    const { validator: { validate, values } } = this.props;
    if ((values.showCheckingAccountForm && values.enableAutoPay && validate(schema).isValid) || !values.showCheckingAccountForm || (values.showCheckingAccountForm && !values.enableAutoPay)) {
      this.setState({ isLoading: true });
      this.props.nextAction({
        data: values,
        url: `/workflows/adf/${params.key}/next`,
        success: (response) => {
          this.setState({ isLoading: false });
          this.props.history.push(response.data.url);
        },
        fail: (error) => {
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
  }

  handleInputChange = (event) => {
    const { validator: { onChangeHandler } } = this.props;
    onChangeHandler(event.target.name, event.target.value);
  };

  render() {
    const { modal, isLoading } = this.state;
    const { validator: { values, errors } } = this.props;

    return (
      <div className="page-personify narrow">
        <Container>
          <Row>
            <Col className="text-center mb-4 mt-2">
              <h4 className="mb-2"><span className="flag-borrower">Borrower</span>&nbsp; Please Continue:</h4>
              <h2>Do you want to enroll in ACH Auto-Pay?</h2>
            </Col>
          </Row>
          <Row className="mb-md-2 no-gutters">
            <Col md={3}>
              <ul className="mb-0 check-icon">
                <li>Automatic Payments</li>
              </ul>
            </Col>
            <Col md={3} className="pl-s-4">
              <ul className="mb-0 check-icon">
                <li>$0 Fees</li>
              </ul>
            </Col>
            <Col md={3}>
              <ul className="mb-0 check-icon">
                <li>Hassle-free</li>
              </ul>
            </Col>
            <Col md={3}>
              <ul className="mb-0 check-icon">
                <li>You could earn a $25 Statement Credit</li>
              </ul>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <Row>
                    <Col xs={12}>
                      <ButtonGroup className="w-100 mb-3">
                        <Button color="primary" onClick={() => this.handleRadioBtnClick(true)} active={values.enableAutoPay}>YES &nbsp;–&nbsp; Enroll in Auto-Pay</Button>
                        <Button color="primary" onClick={() => this.handleRadioBtnClick(false)} active={!values.enableAutoPay}>NO &nbsp;–&nbsp; Decline Auto-Pay</Button>
                      </ButtonGroup>
                    </Col>
                    <Col md={6} className="text-center mb-2 mb-md-0">
                      <small>YES &nbsp;–&nbsp; I want to enroll in ACH Auto-Pay and become eligible to receive a $25 Statement Credit! <span className="text-link" onClick={this.handleModal}>View Details</span></small>
                    </Col>
                    <Col md={6} className="text-center">
                      <small>NO &nbsp;–&nbsp; I do not want to enroll in ACH Auto-Pay at this time.</small>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Collapse isOpen={values.showCheckingAccountForm && values.enableAutoPay}>
            <Row>
              <Col>
                <Card>
                  <CardHeader>
                    <h4 className="mb-0">Checking Account Information</h4>
                  </CardHeader>
                  <CardBody>
                    <Form>
                      <Row>
                        <Col lg={6}>
                          <FormGroup className="mb-md-0 pb-0">
                            <Input
                              label="Account Holder First Name"
                              name="bankAccountFirstName"
                              value={values.bankAccountFirstName}
                              onChange={this.handleInputChange}
                              hasError={!!errors.bankAccountFirstName}
                              errorMessage={errors.bankAccountFirstName}
                              isRequired
                            />
                          </FormGroup>
                        </Col>
                        <Col lg={6}>
                          <FormGroup className="mb-md-0 pb-0">
                            <Input
                              label="Account Holder Last Name"
                              name="bankAccountLastName"
                              value={values.bankAccountLastName}
                              onChange={this.handleInputChange}
                              hasError={!!errors.bankAccountLastName}
                              errorMessage={errors.bankAccountLastName}
                              isRequired
                            />
                          </FormGroup>
                        </Col>
                        <Col lg={6}>
                          <FormGroup className="mb-md-0 pb-0">
                            <Input
                              label="Routing Number"
                              name="routingNumber"
                              onChange={this.handleInputChange}
                              value={values.routingNumber}
                              isMasked={[/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                              hasError={!!errors.routingNumber}
                              errorMessage={errors.routingNumber}
                              isRequired
                            />
                          </FormGroup>
                        </Col>
                        <Col lg={6}>
                          <FormGroup className="mb-0 pb-0">
                            <Input
                              label="Account Number"
                              name="bankAccountNumber"
                              onChange={this.handleInputChange}
                              value={values.bankAccountNumber}
                              isMasked={numberMask}
                              hasError={!!errors.bankAccountNumber}
                              errorMessage={errors.bankAccountNumber}
                              isRequired
                            />
                          </FormGroup>
                        </Col>
                        <Col>
                          <img src="/images/check-numbers.jpg" alt="Example Check" className="check-example-img" />
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Collapse>
          <div className="text-center align-item-center">
            <Button
              color="personify"
              size="lg"
              className="mb-2 mt-1"
              onClick={this.handleSubmit}
              isLoading={isLoading}
              disabled={isLoading}
            >
              Save &amp; Continue
            </Button>
          </div>
        </Container>

        <Modal isOpen={modal} toggle={this.handleModal} size="lg">
          <ModalHeader toggle={this.handleModal}>Statement Credit Offer Details</ModalHeader>
          <ModalBody>
            To qualify for the $25 Statement Credit (“Statement Credit”) Promotion (“Promotion”), you must enroll in optional ACH Auto-Pay (“Auto-Pay”) at the same time that you execute your loan agreement with First Electronic Bank through Personify Financial and successfully complete your first three (3) scheduled payments using Auto-Pay. Each monthly payment must post to your loan account prior to the expiration of any applicable grace period as defined in your loan agreement. You understand that you are not required to enroll in Auto-Pay unless you want to take advantage of this promotional offer, and your willingness to enroll in Auto-Pay will not affect First Electronic Bank’s credit decision regarding your loan application. Limit one (1) Statement Credit per loan. Promotion cannot be transferred or assigned. After your first three (3) scheduled Auto-Pay payments successfully post to your loan account, the Statement Credit will appear on your next scheduled loan statement. The Statement Credit will be applied to your unpaid balance of the loan and will reduce your outstanding loan balance accordingly. Enrollment for the Statement Credit/Promotion must be made before March 31, 2020. This Promotion is subject to change or discontinuation without notice.
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

PersonifyACH.propTypes = {
  nextAction: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  workflow: PropTypes.object.isRequired,
  validator: PropTypes.object.isRequired,
};

export default compose(
  Validator(schema),
  connect(
    state => ({
      workflow: state.workflow,
    }),
    {
      nextAction,
    }
  )
)(PersonifyACH);
