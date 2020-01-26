import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Navbar, NavbarBrand } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import get from 'lodash/get';

class PartnerHeader extends Component {
  render() {
    const { isPastBumperScreen, workflow } = this.props;
    return (
      <div>
        <Navbar light className="navbar-partner">
          {
            isPastBumperScreen &&
            <div className="left-header">
              <div><NavLink to="/dashboard" className="phoneNumber" onClick={this.handleClickReturn}>Return to Dashboard</NavLink></div>
              <div>Application ID: {get(workflow, 'attributes.entityId')}</div>
            </div>
          }
          <NavbarBrand className="text-hide" href="/">LendingUSA Partner</NavbarBrand>
        </Navbar>
      </div>
    );
  }
}

PartnerHeader.defaultProps = {
  isPastBumperScreen: true,
};

PartnerHeader.propTypes = {
  isPastBumperScreen: PropTypes.bool,
  workflow: PropTypes.object.isRequired,
};

export default connect(state => ({
  workflow: state.workflow,
}))(PartnerHeader);
