import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardHeader,
  CardBody,
} from 'reactstrap';

const CardComponent = ({ title, className, children }) => (
  // FormGroupLabel
  <Card className={className}>
    <CardHeader>{title}</CardHeader>
    <CardBody className="card-section">
      {children}
    </CardBody>
  </Card>
);

CardComponent.propTypes = {
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

CardComponent.defaultProps = {
  className: '',
};

export default CardComponent;
