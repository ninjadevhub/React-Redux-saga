import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Validator from 'components/Validator/Validator';
import ReactLoading from 'react-loading-components';

import { parseUrlParams } from 'utils/parseUrlParams';
import get from 'lodash/get';

import {
  checkinAction,
  checkPreviousAction,
} from 'actions/workflow';

import schema from './schema';

class DirectSignLoanDocument extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // eslint-disable-next-line
      response: {},
    };
  }

  componentWillMount() {
    const params = parseUrlParams(window.location.search);
    if (!params.applicationId) {
      this.props.history.push('/');
    } else {
      this.props.checkPreviousAction({
        data: {},
        url: `/workflows/application/${params.applicationId}/workflow/${this.props.match.params.workflowtype}/step/${this.props.match.params.stepname}`,
        fail: (error) => {
          if (get(error, 'data.message')) {
            this.props.history.push({
              pathname: `/applications/${this.props.match.params.workflowtype}/error`,
              search: `?applicationId=${params.applicationId}`,
              state: { message: get(error, 'data.message') },
            });
          } else if (get(error, 'data.errorMessages.0')) {
            this.props.history.push({
              pathname: `/applications/${this.props.match.params.workflowtype}/error`,
              search: `?applicationId=${params.applicationId}`,
              state: { message: get(error, 'data.errorMessages.0') },
            });
          } else {
            this.props.history.push({
              pathname: `/applications/${this.props.match.params.workflowtype}/error`,
              search: `?applicationId=${params.applicationId}`,
              state: { message: 'Sorry, an error occurred' },
            });
          }
        },
      });
    }
  }

  render() {
    const { workflow } = this.props;
    const state = get(workflow, 'state');
    if (state) {
      const routeUrl = state.url;
      this.props.history.push(routeUrl);
    }
    return (
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
        <ReactLoading color="#3989E3" width={100} height={100} />
      </div>
    );
  }
}

DirectSignLoanDocument.propTypes = {
  history: PropTypes.object.isRequired,
  checkPreviousAction: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  workflow: PropTypes.object.isRequired,
};

DirectSignLoanDocument.defaultProps = {
};

export default compose(
  Validator(schema),
  connect(
    state => ({
      auth: state.auth,
      workflow: state.workflow,
    }),
    {
      checkinAction,
      checkPreviousAction,
    }
  )
)(DirectSignLoanDocument);
