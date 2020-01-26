import React from 'react';
import PropTypes from 'prop-types';

const IconLabel = ({ content, className, icon }) => (
  // IconLabel
  <h6 className={className}>
    {icon}
    <div style={{ marginTop: 15 }}>{content}</div>
  </h6>
  // End IconLabel
);

IconLabel.propTypes = {
  icon: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired,
  className: PropTypes.string,
};

IconLabel.defaultProps = {
  className: '',
};

export default IconLabel;
