import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import cn from 'classnames';
import dateFns from 'date-fns';
import Datetime from 'react-datetime';
import get from 'lodash/get';
import pickBy from 'lodash/pickBy';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Collapse,
  Container,
  FormGroup,
  Row,
  UncontrolledTooltip,
} from 'reactstrap';

import Validator from 'components/Validator/Validator';
import Input from 'components/Form/Input';
import Select from 'components/Form/Select';
import { Button } from 'components/Button';
import { TimesCircle } from 'components/Icons';
import { parseUrlParams } from 'utils/parseUrlParams';
import { currencyMask, floatUnmask, numberMask, unmask } from 'utils/masks';
import { formatCurrency } from 'utils/formatCurrency';
import { toTitleCase } from 'utils/toTitleCase';
import { nextAction } from 'actions/workflow';
import schema from './schema';

class PersonifyIncome extends Component {
  state = {
    isLoading: false,
  }

  componentWillMount() {
    const { history, workflow, validator: { setValues } } = this.props; // eslint-disable-line
    const params = parseUrlParams(window.location.search);
    if (!params.key) {
      history.push('/dashboard');
    }

    if (get(workflow, 'data') === undefined || get(workflow, 'activity') !== 'Income') {
      history.push(`/personify/checkin?key=${params.key}`);
    }
    setValues({
      incomeOpen: false,
      isAdditionalIncomeOpen: false,
      isAdditionalIncomeOpen1: false,
      additionalSourceOfIncome: false,
      additionalSourceOfIncome1: false,
    });
  }

  onRadioIncome = (index, selection) => {
    const { validator: { setValues, values } } = this.props;

    if (index === 1) {
      setValues({
        ...values,
        sourceOfIncome: selection,
        incomeOpen: true,
      });
    } else if (index === 2) {
      setValues({
        ...values,
        additionalSourceOfIncome: selection,
        isAdditionalIncomeOpen: true,
      });
    } else {
      setValues({
        ...values,
        additionalSourceOfIncome1: selection,
        isAdditionalIncomeOpen1: true,
      });
    }
  }

  onRadioFrequency = (index, selection) => {
    const { validator: { onChangeHandler } } = this.props;
    onChangeHandler(`payFrequency${index}`, selection);
  }

  handleInputChange = (event) => {
    const { validator: { onChangeHandler } } = this.props;
    switch (event.target.name) {
      case 'firstName':
      case 'lastName':
        onChangeHandler(event.target.name, (event.target.value).replace(/[^a-zA-Z '-]/g, ''));
        break;
      default:
        onChangeHandler(event.target.name, event.target.value);
    }
  };

  handleClickContinue = (e) => {
    e.preventDefault();

    const params = parseUrlParams(window.location.search);

    const { validator: { validate, values, errors } } = this.props;
    if ((validate(schema).isValid)) {
      const incomesArray = [];
      incomesArray.push(pickBy({
        isPrimary: true,
        source: values.sourceOfIncome || null,
        employerName: values.employerName1 || null,
        monthlyIncomeAfterTaxes: (values.monthlyIncomeAfterTaxes1 && unmask(values.monthlyIncomeAfterTaxes1)) || null,
        employedSince: values.employedSince1 || null,
        receivingIncomeAfter3Years: values.receivingIncomeAfter3Years1 || null,
        incomeEndDate: values.incomeEndDate1 || null,
        otherDescription: values.otherDescription1 || null,
        payFrequency: values.payFrequency1,
      }, _ => _));

      if (values.isAdditionalIncomeOpen) {
        incomesArray.push(pickBy({
          source: values.additionalSourceOfIncome || null,
          employerName: values.employerName2 || null,
          monthlyIncomeAfterTaxes: (values.monthlyIncomeAfterTaxes2 && unmask(values.monthlyIncomeAfterTaxes2)) || null,
          employedSince: values.employedSince2 || null,
          receivingIncomeAfter3Years: values.receivingIncomeAfter3Years2 || null,
          incomeEndDate: values.incomeEndDate2 || null,
          otherDescription: values.otherDescription2 || null,
          payFrequency: values.payFrequency2,
        }, _ => _));
      }

      if (values.isAdditionalIncomeOpen1) {
        incomesArray.push(pickBy({
          source: values.additionalSourceOfIncome1 || null,
          employerName: values.employerName3 || null,
          monthlyIncomeAfterTaxes: (values.monthlyIncomeAfterTaxes3 && unmask(values.monthlyIncomeAfterTaxes3)) || null,
          employedSince: values.employedSince3 || null,
          receivingIncomeAfter3Years: values.receivingIncomeAfter3Years3 || null,
          incomeEndDate: values.incomeEndDate3 || null,
          otherDescription: values.otherDescription3 || null,
          payFrequency: values.payFrequency3,
        }, _ => _));
      }

      const formData = {
        incomes: incomesArray,
        bankAccountNumber: values.bankAccountNumber,
        routingNumber: values.routingNumber,
        bankAccountFirstName: values.bankAccountFirstName,
        bankAccountLastName: values.bankAccountLastName,
      };

      this.setState({ isLoading: true });
      this.props.nextAction({
        data: formData,
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
    } else {
      console.log(errors);
    }
  }

  handleDateChange = (name, date) => {
    const { validator: { onChangeHandler } } = this.props;
    if (typeof date.toISOString === 'function') {
      onChangeHandler(name, dateFns.format(date.toISOString(), 'MM/DD/YYYY'));
    } else {
      onChangeHandler(name, '');
    }
  }

  handleBlur = (event) => {
    event.preventDefault();
    const { validator: { onChangeHandler } } = this.props;

    switch (event.target.name) {
      case 'monthlyIncome':
        onChangeHandler(event.target.name, event.target.value ? formatCurrency(floatUnmask(event.target.value), 2) : '');
        break;
      case 'companyName':
      case 'companyName2':
        onChangeHandler(event.target.name, toTitleCase(event.target.value));
        break;
      default:
        break;
    }
  }

  toggleAdditionalIncome = (name) => {
    const { validator: { onChangeHandler, values } } = this.props;

    if ((name === 'isAdditionalIncomeOpen') && values[name] && values.isAdditionalIncomeOpen1) {
      return false;
    }
    onChangeHandler(name, !values[name]);
  }

  renderIncomeSource = (rSelectedIncome, type) => {
    const { validator: { values, errors } } = this.props;
    if (rSelectedIncome === 1) {
      return (
        <CardBody className="pt-0 pb-1">
          <Row>
            <Col lg={6}>
              <FormGroup className="mb-0 pb-0">
                <Input
                  label="Company Name or Description"
                  name={`employerName${type}`}
                  value={values[`employerName${type}`]}
                  onChange={this.handleInputChange}
                  isRequired
                  hasError={!!(errors[`employerName${type}`])}
                  errorMessage={errors[`employerName${type}`]}
                />
                <span className="tip-icon" id={`companyNameOrDescription${rSelectedIncome}_${type}`} />
                <UncontrolledTooltip placement="top" target={`companyNameOrDescription${rSelectedIncome}_${type}`}>
                  <p style={{ textAlign: 'left' }}>Enter your company name or describe your employment</p>
                </UncontrolledTooltip>
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup className="mb-0 pb-0">
                <Input
                  label="Monthly income after taxes"
                  name={`monthlyIncomeAfterTaxes${type}`}
                  value={values[`monthlyIncomeAfterTaxes${type}`]}
                  onChange={this.handleInputChange}
                  isRequired
                  onBlur={this.handleBlur}
                  isMasked={currencyMask}
                  hasError={!!(errors[`monthlyIncomeAfterTaxes${type}`])}
                  errorMessage={errors[`monthlyIncomeAfterTaxes${type}`]}
                />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup className="mb-0 pb-0">
                <Select
                  name={`employedSince${type}`}
                  data={[
                    { value: 1, title: '0 - 3 months' },
                    { value: 2, title: '3 - 6 months' },
                    { value: 3, title: '6 - 12 months' },
                    { value: 4, title: '1 to 2 years' },
                    { value: 5, title: '2+ years' },
                  ]}
                  value={values[`employedSince${type}`]}
                  onChange={this.handleInputChange}
                  label="How long earning from this source?"
                  isRequired
                  hasError={!!(errors[`employedSince${type}`])}
                  errorMessage={errors[`employedSince${type}`]}
                />
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
      );
    } else if (rSelectedIncome === 2) {
      return (
        <CardBody className="pt-0 pb-1">
          <Row>
            <Col lg={6}>
              <FormGroup className="mb-0 pb-0">
                <Input
                  label="Company Name or Description"
                  name={`employerName${type}`}
                  value={values[`employerName${type}`]}
                  onChange={this.handleInputChange}
                  isRequired
                  hasError={!!(errors[`employerName${type}`])}
                  errorMessage={errors[`employerName${type}`]}
                />

                <span className="tip-icon" id={`companyNameOrDescription${rSelectedIncome}_${type}`} />
                <UncontrolledTooltip placement="top" target={`companyNameOrDescription${rSelectedIncome}_${type}`}>
                  <p style={{ textAlign: 'left' }}>Enter your company name or describe your employment</p>
                </UncontrolledTooltip>
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup className="mb-0 pb-0">
                <Input
                  label="Monthly income after taxes"
                  name={`monthlyIncomeAfterTaxes${type}`}
                  value={values[`monthlyIncomeAfterTaxes${type}`]}
                  onChange={this.handleInputChange}
                  isRequired
                  onBlur={this.handleBlur}
                  isMasked={currencyMask}
                  hasError={!!(errors[`monthlyIncomeAfterTaxes${type}`])}
                  errorMessage={errors[`monthlyIncomeAfterTaxes${type}`]}
                />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup className="mb-0 pb-0">
                <Select
                  name={`employedSince${type}`}
                  data={[
                    { value: 1, title: '0 - 3 months' },
                    { value: 2, title: '3 - 6 months' },
                    { value: 3, title: '6 - 12 months' },
                    { value: 4, title: '1 to 2 years' },
                    { value: 5, title: '2+ years' },
                  ]}
                  value={values[`employedSince${type}`]}
                  onChange={this.handleInputChange}
                  label="How long earning from this source?"
                  isRequired
                  hasError={!!(errors[`employedSince${type}`])}
                  errorMessage={errors[`employedSince${type}`]}
                />
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
      );
    } else if (rSelectedIncome === 3) {
      return (
        <CardBody className="pt-0 pb-1">
          <Row>
            <Col lg={6}>
              <FormGroup className="mb-0 pb-0">
                <Input
                  label="Description"
                  name={`otherDescription${type}`}
                  value={values[`otherDescription${type}`]}
                  onChange={this.handleInputChange}
                  isRequired
                  hasError={!!(errors[`otherDescription${type}`])}
                  errorMessage={errors[`otherDescription${type}`]}
                />
                <span className="tip-icon" id={`otherDescription${rSelectedIncome}_${type}`} />
                <UncontrolledTooltip placement="top" target={`otherDescription${rSelectedIncome}_${type}`}>
                  <p style={{ textAlign: 'left' }}>Enter your company name or describe your employment</p>
                </UncontrolledTooltip>
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup className="mb-0 pb-0">
                <Input
                  label="Monthly income after taxes"
                  name={`monthlyIncomeAfterTaxes${type}`}
                  value={values[`monthlyIncomeAfterTaxes${type}`]}
                  onChange={this.handleInputChange}
                  isRequired
                  onBlur={this.handleBlur}
                  isMasked={currencyMask}
                  hasError={!!(errors[`monthlyIncomeAfterTaxes${type}`])}
                  errorMessage={errors[`monthlyIncomeAfterTaxes${type}`]}
                />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup className="mb-0 pb-0">
                <Select
                  name={`receivingIncomeAfter3Years${type}`}
                  data={[
                    { value: true, title: 'Yes' },
                    { value: false, title: 'No' },
                  ]}
                  value={values[`receivingIncomeAfter3Years${type}`]}
                  onChange={this.handleInputChange}
                  label="Income for next 3 years?"
                  isRequired
                  hasError={!!(errors[`receivingIncomeAfter3Years${type}`])}
                  errorMessage={errors[`receivingIncomeAfter3Years${type}`]}
                />
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup className="mb-0 pb-0">
                <div className={cn({ 'has-value': true, hasValue: true, required: errors[`incomeEndDate${type}`] })}>
                  <span className="layerOrder">
                    Approximate Income End Date
                    <em>Required</em>
                  </span>
                  <Datetime
                    ref={(el) => { this[`dateTime${type}`] = el; }}
                    name={`incomeEndDate${type}`}
                    label="Approximate income end date?"
                    className="input approximate"
                    value={values[`incomeEndDate${type}`]}
                    onChange={this.handleDateChange.bind(null, `incomeEndDate${type}`)}
                    closeOnSelect
                    dateFormat="MM/DD/YYYY"
                    timeFormat={false}
                    placeHolder="MM/DD/YYYY"
                    renderInput={props => (
                      <Input
                        isMasked={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
                        isRequired
                        hasError={!!(errors[`incomeEndDate${type}`])}
                        errorMessage={errors[`incomeEndDate${type}`]}
                        placeHolder="MM/DD/YYYY"
                        {...props}
                      />
                    )}
                  />
                </div>
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
      );
    } else if (rSelectedIncome === 4) {
      return (
        <CardBody className="pt-0 pb-1">
          <Row>
            <Col lg={6}>
              <FormGroup className="mb-0 pb-0">
                <Input
                  label="Description"
                  name={`otherDescription${type}`}
                  value={values[`otherDescription${type}`]}
                  onChange={this.handleInputChange}
                  isRequired
                  hasError={!!(errors[`otherDescription${type}`])}
                  errorMessage={errors[`otherDescription${type}`]}
                />
                <span className="tip-icon" id={`otherDescription${rSelectedIncome}_${type}`} />
                <UncontrolledTooltip placement="top" target={`otherDescription${rSelectedIncome}_${type}`}>
                  <p style={{ textAlign: 'left' }}>Enter your company name or describe your employment</p>
                </UncontrolledTooltip>
              </FormGroup>
            </Col>
            <Col lg={6}>
              <FormGroup className="mb-0 pb-0">
                <Input
                  label="Monthly income after taxes"
                  name={`monthlyIncomeAfterTaxes${type}`}
                  value={values[`monthlyIncomeAfterTaxes${type}`]}
                  onChange={this.handleInputChange}
                  isRequired
                  onBlur={this.handleBlur}
                  isMasked={currencyMask}
                  hasError={!!(errors[`monthlyIncomeAfterTaxes${type}`])}
                  errorMessage={errors[`monthlyIncomeAfterTaxes${type}`]}
                />
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
      );
    }
  }

  render() {
    const { validator: { values, errors } } = this.props;
    const { isLoading } = this.state;

    return (
      <div className="page-personify narrow">
        <Container>
          <Row>
            <Col className="text-center mb-4 mt-2">
              <h2>Just a few more questions</h2>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card className="overflow-visible">
                <CardHeader className="has-tooltip">
                  <h4 className="mb-0">What is the <strong>main source</strong> of your income?</h4>
                  <p style={{ fontSize: 14, fontWeight: 500, color: '#888', fontStyle: 'italic', margin: 0 }}>You will be able to add more sources of income later</p>
                  <span className="tip-icon" id="mainIncomeTooltip" />
                  <UncontrolledTooltip placement="top" target="mainIncomeTooltip">
                    Try using your highest and most consistent source of income
                  </UncontrolledTooltip>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md={6} className="mb-1 mb-md-2">
                      <Button onClick={this.onRadioIncome.bind(null, 1, 1)} active={values.sourceOfIncome === 1} className="w-100 text-ellipse">Employment (Part time or Full time)</Button>
                    </Col>
                    <Col md={6} className="mb-1 mb-md-2">
                      <Button onClick={this.onRadioIncome.bind(null, 1, 2)} active={values.sourceOfIncome === 2} className="w-100 text-ellipse">Self Employment</Button>
                    </Col>
                    <Col md={6} className="mb-1 mb-md-2">
                      <Button onClick={this.onRadioIncome.bind(null, 1, 3)} active={values.sourceOfIncome === 3} className="w-100 text-ellipse">Retired/Benefits</Button>
                    </Col>
                    <Col md={6} className="mb-2 mb-md-2">
                      <Button onClick={this.onRadioIncome.bind(null, 1, 4)} active={values.sourceOfIncome === 4} className="w-100 text-ellipse">Other</Button>
                    </Col>
                    <Col md={8} className="text-center ml-auto mr-auto">
                      <small>Note: Alimony, child support, or separate maintenance income need not be revealed if you do not wish to have it considered as a basis for repaying the loan.</small>
                    </Col>
                  </Row>
                </CardBody>
                <Collapse isOpen={values.incomeOpen}>
                  {this.renderIncomeSource(values.sourceOfIncome, 1)}
                </Collapse>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <h4 className="mb-0">How often do you get paid from your main source of income?</h4>
                  {
                      (errors.payFrequency1 === 'The input field is required') ?
                        <p style={{ fontSize: 14, color: 'red', fontWeight: 500, margin: 0 }}>This field is required.</p>
                      :
                        null
                    }
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md={4} className="mb-1 mb-md-2">
                      <Button onClick={this.onRadioFrequency.bind(null, 1, 1)} active={values.payFrequency1 === 1} className="w-100">WEEKLY</Button>
                    </Col>
                    <Col md={4} className="mb-1 mb-md-2">
                      <Button onClick={this.onRadioFrequency.bind(null, 1, 2)} active={values.payFrequency1 === 2} className="w-100">BIWEEKLY</Button>
                    </Col>
                    <Col md={4} className="mb-1 mb-md-2">
                      <Button onClick={this.onRadioFrequency.bind(null, 1, 3)} active={values.payFrequency1 === 3} className="w-100">SEMIMONTHLY</Button>
                    </Col>
                    <Col md={4} className="mb-1 mb-md-0">
                      <Button onClick={this.onRadioFrequency.bind(null, 1, 4)} active={values.payFrequency1 === 4} className="w-100">MONTHLY</Button>
                    </Col>
                    <Col md={4}>
                      <Button onClick={this.onRadioFrequency.bind(null, 1, 5)} active={values.payFrequency1 === 5} className="w-100">Other</Button>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={6} lg={6}>
              <Button onClick={this.toggleAdditionalIncome.bind(null, 'isAdditionalIncomeOpen')} active={values.isAdditionalIncomeOpen} className="d-flex align-items-center">
                {
                  values.isAdditionalIncomeOpen && <span className="btn-cancel"><TimesCircle /> Cancel</span>
                }
                <span>Add additional income</span>
              </Button>
            </Col>
          </Row>
          <Collapse isOpen={values.isAdditionalIncomeOpen}>
            <Row className="mt-2">
              <Col>
                <Card className="overflow-visible">
                  <CardHeader className="has-tooltip">
                    <h4 className="mb-0">Add additional income?</h4>
                    <p style={{ fontSize: 14, fontWeight: 500, color: '#888', fontStyle: 'italic', margin: 0 }}>You will be able to add more sources of income later</p>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col md={6} className="mb-1 mb-md-2">
                        <Button onClick={this.onRadioIncome.bind(null, 2, 1)} active={values.additionalSourceOfIncome === 1} className="w-100">Employment (Part time or Full time)</Button>
                      </Col>
                      <Col md={6} className="mb-1 mb-md-2">
                        <Button onClick={this.onRadioIncome.bind(null, 2, 2)} active={values.additionalSourceOfIncome === 2} className="w-100">Self Employment</Button>
                      </Col>
                      <Col md={6} className="mb-1 mb-md-2">
                        <Button onClick={this.onRadioIncome.bind(null, 2, 3)} active={values.additionalSourceOfIncome === 3} className="w-100">Retired/Benefits</Button>
                      </Col>
                      <Col md={6} className="mb-2 mb-md-2">
                        <Button onClick={this.onRadioIncome.bind(null, 2, 4)} active={values.additionalSourceOfIncome === 4} className="w-100">Other</Button>
                      </Col>
                      <Col md={8} className="text-center ml-auto mr-auto">
                        <small>Note: Alimony, child support, or separate maintenance income need not be revealed if you do not wish to have it considered as a basis for repaying the loan.</small>
                      </Col>
                    </Row>
                  </CardBody>
                  <Collapse isOpen={values.isAdditionalIncomeOpen}>
                    {this.renderIncomeSource(values.additionalSourceOfIncome, 2)}
                  </Collapse>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card>
                  <CardHeader>
                    <h4 className="mb-0">How often do you get paid from your additional income?</h4>
                    {
                      (errors.payFrequency2 === 'The input field is required') ?
                        <p style={{ fontSize: 14, color: 'red', fontWeight: 500, margin: 0 }}>This field is required.</p>
                      :
                        null
                    }
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col md={4} className="mb-1 mb-md-2">
                        <Button onClick={this.onRadioFrequency.bind(null, 2, 1)} active={values.payFrequency2 === 1} className="w-100">WEEKLY</Button>
                      </Col>
                      <Col md={4} className="mb-1 mb-md-2">
                        <Button onClick={this.onRadioFrequency.bind(null, 2, 2)} active={values.payFrequency2 === 2} className="w-100">BIWEEKLY</Button>
                      </Col>
                      <Col md={4} className="mb-1 mb-md-2">
                        <Button onClick={this.onRadioFrequency.bind(null, 2, 3)} active={values.payFrequency2 === 3} className="w-100">SEMIMONTHLY</Button>
                      </Col>
                      <Col md={4} className="mb-1 mb-md-0">
                        <Button onClick={this.onRadioFrequency.bind(null, 2, 4)} active={values.payFrequency2 === 4} className="w-100">MONTHLY</Button>
                      </Col>
                      <Col md={4}>
                        <Button onClick={this.onRadioFrequency.bind(null, 2, 5)} active={values.payFrequency2 === 5} className="w-100">Other</Button>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Collapse>
          {
            values.isAdditionalIncomeOpen &&
              <Row>
                <Col md={6} lg={6}>
                  <Button onClick={this.toggleAdditionalIncome.bind(null, 'isAdditionalIncomeOpen1')} active={values.isAdditionalIncomeOpen1} className="d-flex align-items-center">
                    {
                      values.isAdditionalIncomeOpen1 && <span className="btn-cancel"><TimesCircle /> Cancel</span>
                    }
                    <span>Add additional income</span>
                  </Button>
                </Col>
              </Row>
          }
          <Collapse isOpen={values.isAdditionalIncomeOpen1}>
            <Row className="mt-2">
              <Col>
                <Card className="overflow-visible">
                  <CardHeader className="has-tooltip">
                    <h4 className="mb-0">Add additional income?</h4>
                    <p style={{ fontSize: 14, fontWeight: 500, color: '#888', fontStyle: 'italic', margin: 0 }}>You will be able to add more sources of income later</p>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col md={6} className="mb-1 mb-md-2">
                        <Button onClick={this.onRadioIncome.bind(null, 3, 1)} active={values.additionalSourceOfIncome1 === 1} className="w-100">Employment (Part time or Full time)</Button>
                      </Col>
                      <Col md={6} className="mb-1 mb-md-2">
                        <Button onClick={this.onRadioIncome.bind(null, 3, 2)} active={values.additionalSourceOfIncome1 === 2} className="w-100">Self Employment</Button>
                      </Col>
                      <Col md={6} className="mb-1 mb-md-2">
                        <Button onClick={this.onRadioIncome.bind(null, 3, 3)} active={values.additionalSourceOfIncome1 === 3} className="w-100">Retired/Benefits</Button>
                      </Col>
                      <Col md={6} className="mb-2 mb-md-2">
                        <Button onClick={this.onRadioIncome.bind(null, 3, 4)} active={values.additionalSourceOfIncome1 === 4} className="w-100">Other</Button>
                      </Col>
                      <Col md={8} className="text-center ml-auto mr-auto">
                        <small>Note: Alimony, child support, or separate maintenance income need not be revealed if you do not wish to have it considered as a basis for repaying the loan.</small>
                      </Col>
                    </Row>
                  </CardBody>
                  <Collapse isOpen={values.isAdditionalIncomeOpen1}>
                    {this.renderIncomeSource(values.additionalSourceOfIncome1, 3)}
                  </Collapse>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col>
                <Card>
                  <CardHeader>
                    <h4 className="mb-0">How often do you get paid from your additional income?</h4>
                    {
                      (errors.payFrequency3 === 'The input field is required') ?
                        <p style={{ fontSize: 14, color: 'red', fontWeight: 500, margin: 0 }}>This field is required.</p>
                      :
                        null
                    }
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col md={4} className="mb-1 mb-md-2">
                        <Button onClick={this.onRadioFrequency.bind(null, 3, 1)} active={values.payFrequency3 === 1} className="w-100">WEEKLY</Button>
                      </Col>
                      <Col md={4} className="mb-1 mb-md-2">
                        <Button onClick={this.onRadioFrequency.bind(null, 3, 2)} active={values.payFrequency3 === 2} className="w-100">BIWEEKLY</Button>
                      </Col>
                      <Col md={4} className="mb-1 mb-md-2">
                        <Button onClick={this.onRadioFrequency.bind(null, 3, 3)} active={values.payFrequency3 === 3} className="w-100">SEMIMONTHLY</Button>
                      </Col>
                      <Col md={4} className="mb-1 mb-md-0">
                        <Button onClick={this.onRadioFrequency.bind(null, 3, 4)} active={values.payFrequency3 === 4} className="w-100">MONTHLY</Button>
                      </Col>
                      <Col md={4}>
                        <Button onClick={this.onRadioFrequency.bind(null, 3, 5)} active={values.payFrequency3 === 5} className="w-100">Other</Button>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Collapse>
          <Row>
            <Col>
              <Card className="mt-3">
                <CardHeader>
                  <h4 className="mb-0">Checking Account Information{(values.bankAccountFirstName || values.bankAccountLastName || values.bankAccountNumber || values.routingNumber) ? <span> (Required)</span> : <span> (Optional)</span>}</h4>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md={6}>
                      <FormGroup className="mb-0 pb-0">
                        <Input
                          label="Account Holder First Name"
                          name="bankAccountFirstName"
                          value={values.bankAccountFirstName}
                          onChange={this.handleInputChange}
                          hasError={!!errors.bankAccountFirstName}
                          errorMessage={errors.bankAccountFirstName}
                          isBadgeVisible={!!(values.bankAccountFirstName || values.bankAccountLastName || values.bankAccountNumber || values.routingNumber)}
                          isRequired={values.bankAccountFirstName || values.bankAccountLastName || values.bankAccountNumber || values.routingNumber}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup className="mb-0 pb-0">
                        <Input
                          label="Account Holder Last Name"
                          name="bankAccountLastName"
                          value={values.bankAccountLastName}
                          onChange={this.handleInputChange}
                          hasError={!!errors.bankAccountLastName}
                          errorMessage={errors.bankAccountLastName}
                          isBadgeVisible={!!(values.bankAccountFirstName || values.bankAccountLastName || values.bankAccountNumber || values.routingNumber)}
                          isRequired={values.bankAccountFirstName || values.bankAccountLastName || values.bankAccountNumber || values.routingNumber}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup className="mb-0 pb-0">
                        <Input
                          label="Routing Number"
                          name="routingNumber"
                          onChange={this.handleInputChange}
                          value={values.routingNumber}
                          isMasked={[/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                          hasError={!!errors.routingNumber}
                          errorMessage={errors.routingNumber}
                          isBadgeVisible={!!(values.bankAccountFirstName || values.bankAccountLastName || values.bankAccountNumber || values.routingNumber)}
                          isRequired={values.bankAccountFirstName || values.bankAccountLastName || values.bankAccountNumber || values.routingNumber}
                        />
                        <span className="tip-icon" id="mainIncomeTooltip4" />
                        <UncontrolledTooltip placement="top" target="mainIncomeTooltip4">
                          <b>Where can I find this?</b>
                          <p style={{ textAlign: 'left' }}>You can find in your online account, phone app, on a check, through a web search for your bank&apos;s routing number, or by calling your bank</p>
                        </UncontrolledTooltip>
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup className="mb-0 pb-0">
                        <Input
                          label="Account Number"
                          name="bankAccountNumber"
                          onChange={this.handleInputChange}
                          value={values.bankAccountNumber}
                          isMasked={numberMask}
                          hasError={!!errors.bankAccountNumber}
                          errorMessage={errors.bankAccountNumber}
                          isBadgeVisible={!!(values.bankAccountFirstName || values.bankAccountLastName || values.bankAccountNumber || values.routingNumber)}
                          isRequired={values.bankAccountFirstName || values.bankAccountLastName || values.bankAccountNumber || values.routingNumber}
                        />
                        <span className="tip-icon" id="mainIncomeTooltip5" />
                        <UncontrolledTooltip placement="top" target="mainIncomeTooltip5">
                          <b>Where can I find this?</b>
                          <p style={{ textAlign: 'left' }}>you can find in your online account, phone app, on a check, or by calling your bank.</p>
                        </UncontrolledTooltip>
                      </FormGroup>
                    </Col>
                    <Col>
                      <img src="/images/check-numbers.jpg" alt="Example Check" className="check-example-img" width="100%" style={{ maxWidth: 'initial' }} />
                    </Col>
                  </Row>
                </CardBody>
              </Card>
              <Row>
                <Col md={6} className="ml-auto mr-auto">
                  <Button
                    onClick={this.handleClickContinue}
                    color="personify"
                    size="lg"
                    className="w-100"
                    disabled={isLoading}
                    isLoading={isLoading}
                  >
                    Continue
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

PersonifyIncome.propTypes = {
  nextAction: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  validator: PropTypes.object.isRequired,
  workflow: PropTypes.object.isRequired,
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
)(PersonifyIncome);
