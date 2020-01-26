import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getIPAddress } from 'actions/workflow';

export default function withIPAddress(WrappedComponent) {
  const HOC = class extends Component {
    static propTypes = {
      getIPAddress: PropTypes.func.isRequired,
      location: PropTypes.object.isRequired,
    };

    state = {
      ipAddress: null,
    };

    componentDidMount() {
      this.props.getIPAddress({
        data: {},
        success: (ipResponse) => {
          this.setState({ ipAddress: ipResponse.ip });
        },
        fail: (err) => {
          console.log(err, 'Getting IP address failed');
        },
      });
    }

    componentWillReceiveProps(nextProps) {
      const currentPage = this.props.location.pathname;
      const nextPage = nextProps.location.pathname;

      if (currentPage !== nextPage) {
        this.props.getIPAddress({
          data: {},
          success: (ipResponse) => {
            this.setState({ ipAddress: ipResponse.ip });
          },
          fail: (err) => {
            console.log(err, 'Getting IP address failed');
          },
        });
      }
    }

    render() {
      return <WrappedComponent {...this.props} ipAddress={this.state.ipAddress || ''} />;
    }
  };

  return connect(null, { getIPAddress })(HOC);
}

