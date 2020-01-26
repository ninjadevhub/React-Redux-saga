import React from 'react';
import PropTypes from 'prop-types';

const CircleMessage = ({ width, className }) => (
  <svg
    width={width}
    height={width * (32 / 32)}
    className={className}
    viewBox="0 0 32 32"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs />
    <g id="Borrowers---Apply" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="Borrowers---Apply---Step-1---Desktop---V2" transform="translate(-910.000000, -514.000000)">
        <g id="Group-10" transform="translate(910.000000, 514.000000)">
          <circle id="Oval" fill="#002248" cx="16" cy="16" r="16" />
          <path d="M23.5975,24.31875 C23.555,24.31875 23.49125,24.31875 23.44875,24.2972875 L19.2197875,23.5535375 C18.3272875,23.85125 17.4135375,24 16.5,24 C11.80375,24 8,20.19625 8,15.5 C8,10.80375 11.80375,7 16.5,7 C21.1960375,7 25,10.80375 25,15.5 C25,16.5625 24.8085375,17.60375 24.4260375,18.6025 C24.15,19.3035375 23.7675,19.98375 23.3210375,20.6 L24.405,23.1285375 C24.5322875,23.405 24.4897875,23.745 24.29875,24 C24.1072875,24.2125 23.8522875,24.31875 23.5975,24.31875" id="Fill-1" fill="#FFFFFF" transform="translate(16.500000, 15.659375) scale(-1, 1) translate(-16.500000, -15.659375) " />
        </g>
      </g>
    </g>
  </svg>
);

CircleMessage.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
};

CircleMessage.defaultProps = {
  width: 32,
  className: '',
};

export default CircleMessage;
