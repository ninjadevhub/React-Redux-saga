import React from 'react';
import PropTypes from 'prop-types';

const Close = ({ width, className }) => (
  <svg
    width={width}
    height={width * (14 / 14)}
    className={className}
    viewBox="0 0 14 14"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      stroke="#000"
      fill="none"
      fillRule="evenodd"
      strokeWidth="1px"
      strokeLinecap="round"
      strokeLinejoin="round"
      vectorEffect="non-scaling-stroke"
      d="M6.852 6.417L1.3.864l-.17-.17-.337.338.168.17 5.555 5.552L.96 12.307l-.167.17.337.336.17-.168L6.85 7.09l5.642 5.644.17.168.336-.337-.17-.168-5.64-5.643 5.64-5.642.17-.17-.337-.336-.17.17-5.64 5.64z"
    />
  </svg>
);

Close.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
};

Close.defaultProps = {
  width: 14,
  className: '',
};

export default Close;
