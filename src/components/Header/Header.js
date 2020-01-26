import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { NavLink, withRouter } from 'react-router-dom';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { connect } from 'react-redux';
import { signOut } from 'actions/auth';
import {
  IconDashboard,
  IconApplications,
  // IconNotifications,
  // IconSupport,
} from 'components/Icons';
import { appConfig } from 'config/appConfig';
import isApplicationFiltersLoaded from 'components/Hoc/isApplicationFiltersLoaded';

export class HeaderComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  handlePageNavigation = (route, e) => {
    e.preventDefault();
    const { history } = this.props;
    history.push(route);
  }
  handleSignOut = () => {
    window.intercomReset(appConfig.intercomId);
    this.props.signOut();
  }

  render() {
    const { isApplicationReviewDataLoaded, location: { pathname } } = this.props;
    const isADFMerchant = appConfig.adfMerchantId === localStorage.getItem('merchantId');
    return (
      <div className="headerContainer">
        <Navbar light expand="lg">
          <NavbarBrand className="text-hide" onClick={this.handlePageNavigation.bind(null, '/dashboard')}>LendingUSA Portal</NavbarBrand>
          {
            localStorage.idToken ?
              <Fragment>
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                  <Nav navbar className="w-100">
                    <div className="lu-main-nav d-lg-flex ml-lg-auto">
                      <NavItem>
                        <a href="/dashboard" className={`nav-link ${pathname === '/dashboard' && 'active'}`} onClick={this.handlePageNavigation.bind(null, '/dashboard')}>
                          <IconDashboard /> Dashboard
                        </a>
                      </NavItem>
                      <NavItem>
                        <NavLink to={isApplicationReviewDataLoaded ? '/dashboard/application-review/action/AllApplications' : ''} className="nav-link">
                          <IconApplications /> Applications
                        </NavLink>
                      </NavItem>
                    </div>
                    <div className="lu-second-nav d-lg-flex ml-lg-auto">
                      {/* <NavItem>
                        <NavLink to="#" className="nav-link nav-support">
                          <IconSupport />
                          <span className="d-lg-none">Support</span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink to="#" className="nav-link nav-notifications">
                          <IconNotifications />
                          <span className="d-lg-none">Notifications</span>
                        </NavLink>
                      </NavItem> */}
                      <NavItem>
                        <a href="tel:+18009946177" className="nav-link nav-support phoneNumber"><span>Questions?&nbsp;</span><strong>800-994-6177</strong></a>
                      </NavItem>
                      <UncontrolledDropdown nav inNavbar>
                        <DropdownToggle nav caret>
                          Account
                        </DropdownToggle>
                        <DropdownMenu right>
                          { !isADFMerchant && <DropdownItem tag="a" onClick={this.handlePageNavigation.bind(null, '/dashboard/profile')}>Profile</DropdownItem>}
                          { !isADFMerchant && <DropdownItem tag="a" onClick={this.handlePageNavigation.bind(null, '/dashboard/funding-information')}>Funding Information</DropdownItem>}
                          { !isADFMerchant && <DropdownItem tag="a" onClick={this.handlePageNavigation.bind(null, '/dashboard/plan-menu')}>Plan Menu</DropdownItem>}
                          { !isADFMerchant && <DropdownItem tag="a" onClick={this.handlePageNavigation.bind(null, '/dashboard/reset-password')}>Reset Password</DropdownItem>}
                          <DropdownItem tag="a" onClick={this.handleSignOut.bind()}>Sign Out</DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>
                  </Nav>
                </Collapse>
              </Fragment>
            :
              <div style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'flex-end',
                }}
              >
                <a href="tel:+18009946177" className="phoneNumber"><span>Questions?&nbsp;</span><strong>800-994-6177</strong></a>
              </div>
          }
        </Navbar>
      </div>
      // <!-- End Portal Header -->
      // End Global Header
    );
  }
}

HeaderComponent.propTypes = {
  signOut: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  isApplicationReviewDataLoaded: PropTypes.bool,
  location: PropTypes.object.isRequired,
};

HeaderComponent.defaultProps = {
  isApplicationReviewDataLoaded: true,
};

export default compose(
  withRouter,
  connect(
    null,
    {
      signOut,
    }
  ),
  isApplicationFiltersLoaded
)(HeaderComponent);
