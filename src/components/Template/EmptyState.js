import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import style from './EmptyState.scss';

const EmptyState = ({ className, icon, title, children }) => (
  <div className={cn(className, style.container)}>
    {icon}
    <p className={style.title}>{title}</p>
    {children}
  </div>
);

EmptyState.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
};

EmptyState.defaultProps = {
  children: null,
  className: '',
};

export default EmptyState;
