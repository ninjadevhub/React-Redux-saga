import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  // Col,
  Container,
  Row,
} from 'reactstrap';
import get from 'lodash/get';
import forEach from 'lodash/forEach';

import { nextAction, checkPreviousAction } from 'actions/workflow';
import { parseUrlParams } from 'utils/parseUrlParams';
import ReactLoading from 'react-loading-components';

class PersonifySignAgreement extends Component {
  componentWillMount() {
    const { history, workflow } = this.props;
    const params = parseUrlParams(window.location.search);

    if (!params.key) {
      history.push('/dashboard');
    }

    if (get(workflow, 'data') === undefined) {
      this.props.checkPreviousAction({
        data: {},
        url: `/workflows/adf/${params.key}/step/LoanAgreementSignature`,
        // eslint-disable-next-line
        fail: (error) => {
          this.props.history.push(`/personify/decline?key=${params.key}`);
        },
      });
    }
  }

  handleClick = (e) => {
    e.preventDefault();

    const params = parseUrlParams(window.location.search);
    this.props.nextAction({
      data: {},
      url: `/workflows/adf/${params.key}/next`,
      success: (response) => {
        this.props.history.push(response.data.url);
      },
      fail: (error) => { // eslint-disable-line
        this.props.history.push({
          pathname: `/personify/decline?key=${params.key}`,
          search: '',
          state: {
            data: error.data,
          },
        });
      },
    });
  }

  render() {
    const { workflow } = this.props;
    const params = parseUrlParams(window.location.search);

    let queryParam = '';
    forEach(params, (value, key) => {
      if (key !== 'key') {
        queryParam += `&${key}=${value}`;
      }
    });

    return (
      <div className="page-personify">
        <Container fluid>
          <Row>
            {
              get(workflow, 'data.iframeUrl') !== undefined ?
                <iframe
                  title="sign-agreement"
                  src={`${get(workflow, 'data.iframeUrl')}${queryParam}`}
                  width="100%"
                  height="1260"
                  id="docusign"
                  frameBorder="0"
                  style={{ overflow: 'hidden' }}
                />
              :
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 500, width: '100%' }}>
                  <ReactLoading type="puff" fill="#3989E3" width={100} height={100} />
                </div>
            }
          </Row>
        </Container>
      </div>
    );
  }
}

PersonifySignAgreement.propTypes = {
  nextAction: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  workflow: PropTypes.object.isRequired,
  checkPreviousAction: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    workflow: state.workflow,
  }),
  {
    nextAction,
    checkPreviousAction,
  }
)(PersonifySignAgreement);
