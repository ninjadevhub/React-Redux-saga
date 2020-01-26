import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const GridLayout = ({ className, children }) => (
  <div className={cn('grid-x', className)}>
    {children}
  </div>
);

GridLayout.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

GridLayout.defaultProps = {
  className: '',
};

export default GridLayout;
