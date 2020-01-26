import React from 'react';
import PropTypes from 'prop-types';

const FormGroupLabel = ({ value }) => (
  // FormGroupLabel
  <h4 style={{ marginBottom: 30, paddingBottom: 15, borderBottom: '2px solid #f2f1f0', fontSize: 24, fontWeight: 500 }}>{value}</h4>
  // End FormGroupLabel
);

FormGroupLabel.propTypes = {
  value: PropTypes.string.isRequired,
};
export default FormGroupLabel;
