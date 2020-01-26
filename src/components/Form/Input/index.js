import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import MaskedInput from 'react-text-mask';
import './style.scss';

class Input extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFocused: false,
      isRequired: false,
      isNotificationShowing: false,
    };
  }

  handleFocus = () => {
    this.setState({
      isFocused: true,
    });
  }

  handleBlur = (e) => {
    const { value } = e.target;
    const { isRequired } = this.props;
    if (value) {
      this.setState({ isRequired: false });
    } else {
      this.setState({ isRequired });
    }
    !isRequired && this.setState({ isFocused: false });
  }

  handleMouseEnter = () => {
    this.setState({ isNotificationShowing: true });
  }

  handleMouseLeave = () => {
    this.setState({ isNotificationShowing: false });
  }

  render() {
    const { className, labelClassName, notification, isMasked, isBadgeVisible, errorMessage, label, placeHolder, value = '', hasError, hasValue, isDisabled, isRequired, readOnly, isErrorVisible, ...restProps } = this.props;
    const { isFocused, isNotificationShowing } = this.state;

    return (
      <label className={cn({ inputLabel: true, 'has-value': isFocused || value.length || isDisabled || hasError, required: this.state.isRequired || hasError }, labelClassName)}>
        {
          label &&
            <span>
              {label}
              {
                isBadgeVisible && !isDisabled &&
                <em>
                  {isRequired && errorMessage === 'The input field is required' && 'Required'}
                  {isRequired && errorMessage !== 'The input field is required' && hasError && 'Error'}
                  {!isRequired && errorMessage !== 'The input field is required' && hasError && 'Error'}
                  {isRequired && !hasError && 'Required'}
                  {!isRequired && !hasError && 'Optional'}
                </em>
              }
            </span>
        }
        {
          isMasked ?
            <MaskedInput
              className={cn(className, 'input')}
              value={value}
              mask={isMasked}
              disabled={isDisabled}
              placeholder={(isFocused) ? placeHolder : ''}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              onChange={this.handleInputChange}
              ref={(el) => { this.autocomplete = el; }}
              readOnly={readOnly}
              {...restProps}
            />
          :
            <input
              className={cn(className, 'input')}
              value={value}
              disabled={isDisabled}
              placeholder={(isFocused || value.length || isDisabled || hasError) ? placeHolder : ''}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              onChange={this.handleInputChange}
              ref={(el) => { this.autocomplete = el; }}
              readOnly={readOnly}
              {...restProps}
            />
        }
        {
          notification &&
          <div className={cn('tooltip', isNotificationShowing && 'active')}>
            <i
              onMouseEnter={this.handleMouseEnter}
              onMouseLeave={this.handleMouseLeave}
            >i
            </i>
            <div>{notification}</div>
          </div>
        }
        {
          isErrorVisible && !readOnly && <div className="error">{errorMessage !== 'The input field is required' && errorMessage}</div>
        }
      </label>
    );
  }
}

Input.propTypes = {
  isRequired: PropTypes.bool,
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  value: PropTypes.string,
  max: PropTypes.number,
  isDisabled: PropTypes.bool,
  label: PropTypes.node,
  hasError: PropTypes.bool,
  hasValue: PropTypes.bool,
  errorMessage: PropTypes.string,
  type: PropTypes.string,
  onChange: PropTypes.func,
  isBadgeVisible: PropTypes.bool,
  placeHolder: PropTypes.string,
  isMasked: PropTypes.any,
  notification: PropTypes.string,
  readOnly: PropTypes.bool,
  isErrorVisible: PropTypes.bool,
};

Input.defaultProps = {
  isRequired: false,
  className: '',
  labelClassName: '',
  value: '',
  isDisabled: false,
  label: null,
  hasError: false,
  errorMessage: '',
  type: 'text',
  max: 0,
  isBadgeVisible: true,
  placeHolder: '',
  isMasked: false,
  notification: '',
  onChange: () => {},
  hasValue: false,
  readOnly: false,
  isErrorVisible: true,
};

export default Input;
