import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import './style.scss';

export class CustomizedSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisited: false,
      isRequired: false,
    };
  }
  handleBlur = (e) => {
    const { value } = e.target;
    const { isRequired } = this.props;
    this.setState({
      isVisited: true,
    });
    if (value) {
      this.setState({ isRequired: false });
    } else {
      this.setState({ isRequired });
    }
  }

  render() {
    const {
      data,
      value,
      label,
      className,
      onChange,
      hasError,
      errorMessage,
      isRequired,
      isBadgeVisible,
      placeHolder,
      isDisabled,
      hasDefault,
      isErrorVisible,
      ...restProps
    } = this.props;
    const { isVisited } = this.state;
    return (
      <label className={cn({ selectLabel: true, 'has-value': true, required: (isVisited && this.state.isRequired) || hasError })}>
        {
          label &&
          <span>{label} {
            isBadgeVisible && ((isVisited && isRequired) || hasError) && <em>Required</em>
            }
            {
              isVisited && !isRequired && <em>Optional</em>
            }
          </span>
        }
        <select
          onChange={onChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          className="select"
          disabled={isDisabled}
          {...restProps}
          value={value}
        >
          { hasDefault && <option value="">Select ...</option> }
          {
            data && data.map((item, key) => (<option key={key} value={item.value}>{item.title}</option>))
          }
        </select>
        {
          isErrorVisible &&
          <div className="error">{errorMessage !== 'The input field is required' && errorMessage}</div>
        }
      </label>
    );
  }
}

CustomizedSelect.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array,
  hasError: PropTypes.bool,
  errorMessage: PropTypes.string,
  label: PropTypes.node,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  isRequired: PropTypes.bool,
  placeHolder: PropTypes.string,
  isBadgeVisible: PropTypes.bool,
  isDisabled: PropTypes.bool,
  hasDefault: PropTypes.bool,
  isErrorVisible: PropTypes.bool,
};

CustomizedSelect.defaultProps = {
  className: '',
  hasError: false,
  errorMessage: '',
  label: null,
  name: '',
  value: '',
  isRequired: false,
  placeHolder: 'Select ...',
  data: null,
  isBadgeVisible: true,
  isDisabled: false,
  hasDefault: true,
  isErrorVisible: true,
};

export default CustomizedSelect;
