import React from 'react';
import PropTypes from 'prop-types';

const Pane = ({ title, content, className }) => (
  // FormGroupLabel
  <div className={`cell small-12 form-provider ${className}`}>
    <div className="card">
      <div className="card-section">
        <h6>{title}</h6>
        <h5>
          {
            content.map((item, id) => <span key={id} style={{ color: '#002147' }}>{item}</span>)
          }
        </h5>
      </div>
    </div>
  </div>
  // End FormGroupLabel
);

Pane.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.array.isRequired,
  className: PropTypes.string,
};

Pane.defaultProps = {
  className: 'medium-4',
};

export default Pane;
