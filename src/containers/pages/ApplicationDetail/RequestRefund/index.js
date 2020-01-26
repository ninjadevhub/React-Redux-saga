import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import cn from 'classnames';
import Toggle from 'react-toggle';
import {
  Col,
  Row,
} from 'reactstrap';

import { currencyMask, floatUnmask } from 'utils/masks';
import { formatCurrency } from 'utils/formatCurrency';
import { toTitleCase } from 'utils/toTitleCase';
import Validator from 'components/Validator/Validator';
import { Button } from 'components/Button';
import Input from 'components/Form/Input';
import Select from 'components/Form/Select';
// import Checkbox from 'components/Form/Checkbox';

import schema from './schema';
import ArrowBack from 'assets/icons/arrow-left.svg';

import './style.scss';

class RequestRefund extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubmitted: false,
      isFull: false,
      isChecked: false,
    };
  }

  componentWillMount() {
    this.initializeForm();
  }

  componentWillReceiveProps(nextProps) {
    if ((nextProps.sidebarOpen !== this.props.sidebarOpen && nextProps.sidebarOpen === false) || nextProps.refund !== this.props.refund || nextProps.contract !== this.props.contract) {
      this.initializeForm(nextProps);
    }
  }

  setFormRef = (el) => { this.form = el; }

  getCurrentAmountFinanced = (props) => {
    const { refund, contract } = props || this.props;
    let currentAmountFinanced = 0;
    if (refund) {
      currentAmountFinanced = refund.newAmountFinanced || 0;
    } else if (contract) {
      currentAmountFinanced = contract.amountTaken || 0;
    }
    return parseFloat(currentAmountFinanced);
  }

  initializeForm = (props) => {
    const { validator: { setValues } } = this.props;
    const initialFormData = {
      refundAmount: 0,
      currentAmountFinanced: this.getCurrentAmountFinanced(props),
      isIssueFullRefund: false,
      signature: '',
    };
    setValues(initialFormData);
    this.setState({
      isFull: false,
    });
  }

  handleBlur = (event) => {
    event.preventDefault();
    const { validator: { onChangeHandler } } = this.props;
    switch (event.target.name) {
      case 'refundAmount':
        onChangeHandler(event.target.name, formatCurrency(floatUnmask(event.target.value || '0'), 2));
        break;
      default:
        onChangeHandler(event.target.name, toTitleCase(event.target.value));
        break;
    }
  }

  handleInputChange = (event) => {
    const { validator: { onChangeHandler } } = this.props;
    const currentAmountFinanced = this.getCurrentAmountFinanced();
    switch (event.target.name) {
      case 'refundAmount':
        onChangeHandler(event.target.name, event.target.value);
        this.setState({
          isFull: parseFloat(floatUnmask(event.target.value)) === currentAmountFinanced,
        });
        break;
      default:
        onChangeHandler(event.target.name, event.target.value);
        break;
    }
  }

  handleCheckboxChange = (event) => {
    this.setState({ isChecked: event.target.checked });
  };

  handleSubmitForm = (data, e) => {
    e.preventDefault();
    const { validator: { validate, errors } } = this.props;
    this.setState({ isSubmitted: true });

    if (validate(schema).isValid) {
      const formData = {
        ...data,
        refundAmount: floatUnmask(data.refundAmount),
        signature: data.signature,
      };
      this.props.handleSubmit(formData);
    } else {
      console.log('submit error', errors);
    }
  }

  handleToggleChange = (event) => {
    // eslint-disable-next-line prefer-destructuring
    const checked = event.target.checked;
    this.setState({
      isFull: event.target.checked,
    });
    if (checked) {
      const amountFinanced = this.getCurrentAmountFinanced().toString();
      const { validator: { onChangeHandler } } = this.props;
      onChangeHandler('refundAmount', formatCurrency(floatUnmask(amountFinanced || '0'), 2));
    }
  }

  render() {
    const { isSubmitted, isFull, isChecked } = this.state;
    const { className, validator: { values, errors, isValid }, isSubmitting, refundReasons, contract, refund } = this.props;

    const currentAmountFinanced = this.getCurrentAmountFinanced();
    let currentPayoutAmount = 0;
    let newAmountFinanced = 0;
    const refundAmount = floatUnmask(values.refundAmount || '0');
    if (refund) {
      currentPayoutAmount = refund.newPayoutAmount || 0;
      newAmountFinanced = currentAmountFinanced - parseFloat(refundAmount);
    } else if (contract) {
      currentPayoutAmount = contract.payoutAmount;
      newAmountFinanced = currentAmountFinanced - parseFloat(refundAmount);
    }
    // const debitAmount = refundAmount - (refundAmount * (1 - (contract ? contract.payout : 0)));
    const debitAmount = refundAmount * (contract ? contract.payout : 0);

    if (this.form && !isValid && isSubmitted) {
      const errs = Object.keys(errors);
      this.form[errs[0]].focus();
      this.setState({ isSubmitted: false });
    }

    return (
      <form className={cn('requestRefund', className)} onSubmit={this.handleSubmitForm.bind(null, values)} ref={this.setFormRef}>
        <div className="formHeader">
          <img src={ArrowBack} alt="Back" onClick={this.props.handleBack} />
          Request Refund
        </div>
        <div className="formBody">
          <div className="div-separator" />
          <Input
            label="Refund Amount"
            name="refundAmount"
            value={values.refundAmount}
            onChange={this.handleInputChange}
            isRequired
            hasError={!!errors.refundAmount}
            isMasked={currencyMask}
            errorMessage={errors.refundAmount}
            onBlur={this.handleBlur}
          />
          <div className="containerToggle">
            <Toggle
              checked={isFull}
              icons={false}
              onChange={this.handleToggleChange}
            />
            <span style={{ marginLeft: 5 }}>Full</span>
          </div>
          <Select
            name="reasonForRefund"
            data={refundReasons}
            value={values.reasonForRefund}
            onChange={this.handleInputChange}
            label="Reason for Refund"
            isRequired
            hasError={!!errors.reasonForRefund}
            errorMessage={errors.reasonForRefund}
          />
          <div className="div-space" />
          <Row>
            <Col sm={12} lg={6}>
              <label className="has-value full-width">
                <span>Current Amount Financed</span>
                <input
                  type="text"
                  value={`$ ${formatCurrency(currentAmountFinanced, 2)}`}
                  readOnly
                />
              </label>
            </Col>
            <Col sm={12} lg={6}>
              <label className="has-value full-width">
                <span>Current Payout Amount</span>
                <input
                  type="text"
                  value={`$ ${formatCurrency(currentPayoutAmount, 2)}`}
                  readOnly
                />
              </label>
            </Col>
          </Row>
          <Row>
            <Col sm={12} lg={6}>
              <label className="has-value full-width">
                <span>New Amount Financed</span>
                <input
                  type="text"
                  value={`$ ${formatCurrency(newAmountFinanced, 2)}`}
                  readOnly
                />
              </label>
            </Col>
            <Col sm={12} lg={6}>
              <label className="has-value full-width">
                <span>Debit Amount</span>
                <input
                  type="text"
                  value={`$ ${formatCurrency(debitAmount, 2)}`}
                  readOnly
                />
              </label>
            </Col>
          </Row>
          <div className="containerCheckbox">
            <input
              className="input"
              type="checkbox"
              name="chkCopyright"
              onChange={this.handleCheckboxChange}
              id="chkCopyright"
              checked={isChecked}
            />
            <label
              htmlFor="chkCopyright"
              className="chkCopyright"
            >
              {'By submitting this electronic Refund Request Form ("Refund Form") you ("You") authorize LendingUSA and/or its affiliates, collectively("LendingUSA", "we" and "us") to initiate a debit ("ACH Debit") from your bank account that we have on file ("Bank Account") in the amount listed on the Refund Form. You are responsible for ensuring that your Bank Account has sufficient funds available in order for us to successfully complete the ACH Debit. You also authorize us to initiate credits and debits to correct any errors that may occur in the processing of the ACH Debit, or to honor any subsequent modifications that you make to your refund request. You warrant and represent to us that you are an authorized representative and have the authority to submit this Refund Form on behalf of your company.'}
            </label>
          </div>
          <div className="div-space" />
          <Input
            label="Signature - Type Full Name"
            name="signature"
            value={values.signature}
            onChange={this.handleInputChange}
            isRequired
            hasError={!!errors.signature}
            onBlur={this.handleBlur}
            errorMessage={errors.signature}
          />
          <Button
            color="primary"
            className="w-80"
            onClick={this.handleSubmitForm.bind(null, values)}
            isLoading={isSubmitting}
            isDisabled={!isChecked}
          >
            Submit Request
          </Button>
        </div>
        <div className="formFooter" />
      </form>
    );
  }
}

RequestRefund.propTypes = {
  className: PropTypes.string,
  handleBack: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  validator: PropTypes.object.isRequired,
  isSubmitting: PropTypes.bool,
  sidebarOpen: PropTypes.bool.isRequired,
  refundReasons: PropTypes.array.isRequired,
  refund: PropTypes.array.isRequired,
  contract: PropTypes.array.isRequired,
};

RequestRefund.defaultProps = {
  className: '',
  isSubmitting: false,
};

export default compose(
  Validator(schema),
  connect(
    state => ({
      auth: state.auth,
    }),
    {
    }
  )
)(RequestRefund);
