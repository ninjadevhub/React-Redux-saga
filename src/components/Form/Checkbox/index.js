import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const Checkbox = (props) => {
  const handleOnChange = () => {
    if (props.isDisabled) return false;
    const { onChange, type, value, isChecked } = props;
    onChange(type === 'checkbox' ? !isChecked : value);
  };

  const { isChecked, className, errorMessage, isDisabled, type, label, name, id, value, ...rest } = props;

  return (
    <div className="checkboxContainer">
      <div className="checkbox">
        <input
          {...rest}
          className="input"
          type={type}
          name={name}
          onChange={handleOnChange}
          disabled={isDisabled}
          value={value}
          checked={isChecked}
          id={id}
          style={{ zIndex: 10 }}
        />
        <label className={cn(className, 'label')} htmlFor={id} style={{ whiteSpace: 'initial' }}>
          {label.map((item, index) => <Fragment key={index}>{item}</Fragment>)}
        </label>
      </div>
      {!!errorMessage && <div className="error">{errorMessage}</div> }
    </div>
  );
};

Checkbox.propTypes = {
  onChange: PropTypes.func,
  isChecked: PropTypes.bool,
  isDisabled: PropTypes.bool,
  label: PropTypes.array,
  name: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  errorMessage: PropTypes.string,
};

Checkbox.defaultProps = {
  onChange: () => {},
  isChecked: false,
  isDisabled: false,
  label: [],
  name: '',
  type: 'checkbox',
  value: 'on',
  className: '',
  errorMessage: '',
};

export default Checkbox;
