import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Loading from 'react-loading-components';

import { startPlaid } from 'actions/plaid';
import { parseUrlParams } from 'utils/parseUrlParams';
import { appConfig } from 'config/appConfig';

export default function withPlaidSessionId(WrappedComponent) {
  const HOC = class extends Component {
    static propTypes = {
      startPlaid: PropTypes.func.isRequired,
      location: PropTypes.object.isRequired,
    };

    state = {
      sessionId: null,
    };

    componentDidMount() {
      const params = parseUrlParams(window.location.search);
      this.props.startPlaid({
        data: {
          entityType: 'application',
          entityId: params.applicationId,
        },
        apiUrl: appConfig.plaidService,
        url: '/session',
        success: (session) => {
          this.setState({ sessionId: session.id });
        },
        fail: (err) => {
          console.log('Initiating Session failed', err);
        },
      });
    }

    // eslint-disable-next-line
    UNSAFE_componentWillReceiveProps(nextProps) {
      const params = parseUrlParams(window.location.search);
      const currentPage = this.props.location.pathname;
      const nextPage = nextProps.location.pathname;

      if (currentPage !== nextPage) {
        this.props.startPlaid({
          data: {
            entityType: 'application',
            entityId: params.applicationId,
          },
          success: (session) => {
            this.setState({ sessionId: session.id });
          },
          fail: (err) => {
            console.log('Initiating Session failed', err);
          },
        });
      }
    }

    render() {
      const { sessionId } = this.state;
      return sessionId ?
        <WrappedComponent {...this.props} sessionId={this.state.sessionId} />
        :
        <div className="plaidContainer">
          <Loading
            type="puff"
            width={100}
            height={100}
            fill="#f44242"
          />
        </div>;
    }
  };

  return connect(null, { startPlaid })(HOC);
}

