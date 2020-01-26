import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
// import Input from 'components/Form/Input';
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { unmask } from 'utils/masks';
import {
  Row, Col,
} from 'reactstrap';

import Slider from 'components/Slider';

const currencyMask = createNumberMask({
  prefix: '$ ',
  allowDecimal: true,
  integerLimit: 5,
});

const loanAmountRequested = ({ amount, onChange, hasError, onBlur, errorMessage }) => (
// LoanAmountRequested
  <Fragment>
    <h4>Loan Amount Requested</h4>
    <Row className="slider-cells">
      <Col sm={12} md={8} className="padded-bottom">
        <Slider
          value={parseInt(unmask(`${amount}`), 10) || 1000}
          orientation="horizontal"
          handleChange={onChange}
          min={1000}
          max={35000}
          step={100}
          labels={{
            1000: '$1k',
            10000: '$10k',
            20000: '$20k',
            30000: '$30k',
          }}
          format={value => `$ ${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        />
      </Col>
      <Col sm={12} md={4} className="padded-bottom">
        <label className={cn('has-value', 'label', hasError && 'required')}>
          {
            hasError &&
              <span>
                <em>
                  {(errorMessage === 'The input field is required') ? 'Required' : 'Error'}
                </em>
              </span>
          }
          <MaskedInput
            name="requestedAmount"
            mask={currencyMask}
            className={cn('form-control ui-input', 'input')}
            type="text"
            required="required"
            placeholder="0.00"
            value={amount}
            onChange={(e) => {
              if (unmask(e.target.value) <= 35000) {
                onChange(unmask(e.target.value));
              } else {
                onChange(unmask(amount));
              }
            }}
            onBlur={onBlur}
          />
        </label>
      </Col>
      {
        hasError &&
        <Col className="small-12">
          <div className="error">{errorMessage !== 'The input field is required' && errorMessage}</div>
        </Col>
      }
    </Row>
  </Fragment>
  // LoanAmountRequested
);

loanAmountRequested.propTypes = {
  amount: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  hasError: PropTypes.bool,
  errorMessage: PropTypes.string,
};

loanAmountRequested.defaultProps = {
  amount: 2220,
  hasError: false,
  errorMessage: '',
};

export default loanAmountRequested;
