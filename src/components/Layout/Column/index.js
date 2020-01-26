import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const Column = ({ className, id, children }) => (
  <div className={cn('cell', className)} id={id}>
    {children}
  </div>
);

Column.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Column.defaultProps = {
  className: '',
  id: '',
};

export default Column;
