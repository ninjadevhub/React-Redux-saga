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

class ADFApplication extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // eslint-disable-next-line
      response: {},
    };
  }

  componentWillMount() {
    const params = parseUrlParams(window.location.search);
    if (!params.key) {
      this.props.history.push('/');
    } else {
      this.props.checkPreviousAction({
        data: {},
        url: `/workflows/adf/${params.key}/checkin`,
        // eslint-disable-next-line
        fail: (error) => {
          this.props.history.push(`/personify/decline?key=${params.key}`);
        },
      });
    }
  }

  render() {
    const { workflow } = this.props;
    const state = get(workflow, 'data');
    if (state) {
      const routeUrl = state.url;
      this.props.history.push(routeUrl);
    }
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 500 }}>
        <ReactLoading type="puff" fill="#3989E3" width={100} height={100} />
      </div>
    );
  }
}

ADFApplication.propTypes = {
  history: PropTypes.object.isRequired,
  checkPreviousAction: PropTypes.func.isRequired,
  workflow: PropTypes.object.isRequired,
};

ADFApplication.defaultProps = {
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
)(ADFApplication);
