import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  nextAction,
} from 'actions/workflow';
import { parseUrlParams } from 'utils/parseUrlParams';

class WorkflowComplete extends Component {
  componentDidMount() {
    // $('#workflowComplete').click();
    const params = parseUrlParams(window.location.search);
    window.top.postMessage(
      {
        error: false,
        docuSignComplete: true,
        ...params,
      },
      '*'
    );
  }

  render() {
    return (
      <div>
        <h3>Your request is still loading. Please do not close the browser.</h3>
      </div>
    );
  }
}

WorkflowComplete.propTypes = {
  // nextAction: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    auth: state.auth,
  }),
  {
    nextAction,
  }
)(WorkflowComplete);
