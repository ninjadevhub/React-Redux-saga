import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Loading from 'react-loading-components';

import { appConfig as config } from 'config/appConfig';
import withPlaidSessionId from './WithPlaidSession';

import {
  succeedPlaid,
  exitPlaid,
} from 'actions/plaid';

class Plaid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
    };
  }

  componentDidMount() {
    const { sessionId } = this.props;
    this.loadScript('https://cdn.plaid.com/link/v2/stable/link-initialize.js', () => {
      const plaid = window.Plaid.create({
        apiVersion: 'v2',
        clientName: config.clientName, // set it to "LendingUSA"
        env: config.plaidEnv, // for development, set it to "sandbox"
        key: config.plaidPubKey, // for development, set it to "c1900d137da8bdbfb393fad8ab01b8"
        product: config.plaidProducts, // set it to [ "transactions" ]
        webhook: `${config.plaidService}/session/${sessionId}/webhook`,
        selectAccount: true,
        onLoad: this.onPlaidLoad,
        onSuccess: this.onPlaidSuccess,
        onExit: this.onPlaidExit,
        onEvent: this.handleEvent,
      });

      plaid.open();
    });
  }

  onPlaidLoad = () => {
    this.setState({
      isLoading: false,
    });
  }

  onPlaidSuccess = (publicToken, metadata) => {
    this.props.onPlaidSuccess(publicToken, metadata, this.props.sessionId);
  }

  onPlaidExit = (err, metadata) => {
    this.props.exitPlaid({
      data: {
        error: err,
        institution: metadata.institution,
        linkSessionId: metadata.link_session_id,
        requestId: metadata.request_id,
        status: metadata.status,
      },
      apiUrl: `${config.plaidService}/session/${this.props.sessionId}/exit`,
    });
    this.props.onPlaidExit();
  }

  loadScript = (url, callback) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';

    if (script.readyState) { // IE
      script.onreadystatechange = () => {
        if (script.readyState === 'loaded' || script.readyState === 'complete') {
          script.onreadystatechange = null;
          callback();
        }
      };
    } else { // Others
      script.onload = () => {
        callback();
      };
    }

    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  // eslint-disable-next-line
  handleEvent = (eventName, metaData) => {
    if (eventName === 'OPEN') {
      document.body.style.overflow = 'auto';
    }
  }

  render() {
    const { isLoading } = this.state;
    return (
      <div className="plaidContainer">
        {
          isLoading &&
            <Loading
              type="puff"
              width={100}
              height={100}
              fill="#f44242"
            />
        }
      </div>
    );
  }
}

Plaid.propTypes = {
  sessionId: PropTypes.string.isRequired,
  exitPlaid: PropTypes.func.isRequired,
  onPlaidSuccess: PropTypes.func.isRequired,
  onPlaidExit: PropTypes.func.isRequired,
};

Plaid.defaultProps = {
};

export default connect(null, { succeedPlaid, exitPlaid })(withPlaidSessionId(Plaid));
