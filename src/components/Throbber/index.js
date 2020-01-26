import React from 'react';
import PropTypes from 'prop-types';

const Throbber = props => (
  <span
    className={props.className}
  />
);

Throbber.propTypes = {
  className: PropTypes.string,
};

Throbber.defaultProps = {
  className: '',
};

export default Throbber;
