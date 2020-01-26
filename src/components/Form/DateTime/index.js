import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import Datetime from 'react-datetime';

class DateTimeComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFocused: false,
      isRequired: false,
    };
  }

  handleFocus = () => {
    this.setState({
      isFocused: true,
    });
  }

  handleBlur = (value) => {
    const { isRequired } = this.props;
    if (value) {
      this.setState({ isRequired: false });
    } else {
      this.setState({ isRequired });
    }
    !isRequired && this.setState({ isFocused: false });
  }

  render() {
    const { className, labelClassName, isBadgeVisible, errorMessage, label, placeHolder, value = '', hasError, isDisabled, isRequired, onChange } = this.props;
    const { isFocused } = this.state;

    return (
      <div className={cn({ 'has-value': isFocused || value.length || isDisabled || hasError, required: this.state.isRequired || hasError }, labelClassName)}>
        <span>
          {label}
          {
            isBadgeVisible && !isDisabled &&
            <em>{isRequired ? 'Required' : 'Optional'}</em>
          }
        </span>
        {
          <Datetime
            className={`${className}`}
            value={value || ''}
            disabled={isDisabled}
            placeholder={(isFocused || value.length || isDisabled || hasError) ? placeHolder : ''}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onChange={(e) => { onChange(e); }}
            closeOnSelect
          />
        }
        <div className="error">{errorMessage}</div>
      </div>
    );
  }
}

DateTimeComponent.propTypes = {
  isRequired: PropTypes.bool,
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  value: PropTypes.string,
  isDisabled: PropTypes.bool,
  label: PropTypes.node,
  hasError: PropTypes.bool,
  errorMessage: PropTypes.string,
  onChange: PropTypes.func,
  isBadgeVisible: PropTypes.bool,
  placeHolder: PropTypes.string,
};

DateTimeComponent.defaultProps = {
  isRequired: false,
  className: '',
  labelClassName: '',
  value: '',
  isDisabled: false,
  label: null,
  hasError: false,
  errorMessage: '',
  isBadgeVisible: true,
  placeHolder: '',
  onChange: () => {},
};

export default DateTimeComponent;
