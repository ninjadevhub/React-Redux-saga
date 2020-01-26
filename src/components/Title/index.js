import React from 'react';
import PropTypes from 'prop-types';

const Title = ({ className, children }) => (
  <h3 className={className}>
    {children}
  </h3>
);

Title.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

Title.defaultProps = {
  children: null,
  className: '',
};

export default Title;
