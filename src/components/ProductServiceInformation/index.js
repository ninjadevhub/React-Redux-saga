import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';

class ProductServiceInformation extends Component {
  constructor(props) {
    super(props);
    // eslint-disable-next-line
    console.log('ewfwoeifjwo');
  }
  render() {
    const { amount } = this.props;
    return (
      // LoanAmountRequested
      <Fragment>
        <h4>Loan Amount Requested</h4>
        <div className="grid-x grid-margin-x slider-cells">
          <div className="cell small-12 medium-9 padded-bottom">
            <div className="slider simple" data-slider data-start="1000" data-initial-start={amount} data-end="35000" data-step="100">
              <span className="slider-handle" data-slider-handle aria-controls="sliderOutput" />
              <span className="slider-fill" data-slider-fill />
            </div>
          </div>
          <div className="cell small-12 medium-3 padded-bottom">
            <div className="value-container">
              <span>$</span>
              <input
                type="text"
                id="sliderOutput"
                className="currency"
                onChange={this.onChange}
                ref={(input) => { this.amountInput = input; }}
              />
            </div>
          </div>
        </div>
      </Fragment>
      // LoanAmountRequested
    );
  }
}

ProductServiceInformation.propTypes = {
  amount: PropTypes.number,
};

ProductServiceInformation.defaultProps = {
  amount: 2220,
};

export default ProductServiceInformation;
