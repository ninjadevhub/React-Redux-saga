import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Col,
  Container,
  Row,
} from 'reactstrap';

import {
  nextAction,
} from 'actions/workflow';
import { parseUrlParams } from 'utils/parseUrlParams';

import Heading from 'components/Heading';
import get from 'lodash/get';
import './style.scss';

class CreditAppDoc extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // eslint-disable-next-line
      response: {},
      isNextActionCalled: false,
      height: 0,
    };
    window.addEventListener('message', this.onMessageReceived, false);
  }

  componentWillMount() {
    const params = parseUrlParams(window.location.search);
    const { history, workflow } = this.props;
    if (get(workflow, ['state', 'data']) === undefined) {
      history.push(`/applications/${this.props.match.params.workflowtype}/checkin?applicationId=${params.applicationId || ''}`);
    }
    if (!params.applicationId) {
      this.props.history.push(`/applications/${this.props.match.params.workflowtype}/application`);
    }
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.addEventListener('message', this.onMessageReceived, false);
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  onMessageReceived = (event) => {
    const { data } = event;
    const { isNextActionCalled } = this.state;
    const params = parseUrlParams(window.location.search);
    const dataJson = JSON.parse(data);

    if (params.applicationId && dataJson.event === 'session_view.document.completed' && !isNextActionCalled) {
      this.setState({
        isNextActionCalled: true,
      });
      this.props.nextAction({
        data: {
          event: dataJson.event,
          eid: dataJson.data.uuid,
          id: params.applicationId,
          error: null,
        },
        url: `/workflows/application/${params.applicationId}/workflow/${this.props.match.params.workflowtype}/next`,
        // eslint-disable-next-line
        success: (response) => {
          this.props.history.push({
            pathname: response.state.url,
            search: '',
            state: {
              data: response.state.data,
            },
          });
        },
        fail: (error) => {
          console.log(error);
        },
      });
    }
  }

  updateWindowDimensions = () => {
    this.setState({ height: window.innerHeight });
  }

  toggleModal = () => {
    this.setState(({ isModalShown }) => ({ isModalShown: !isModalShown }));
  }

  handleCheckboxChange = (name, value) => {
    this.setState({
      [name]: value,
    });
  }

  handleButtonClick = (e) => {
    e.preventDefault();

    const params = parseUrlParams(window.location.search);
    if (params.applicationId) {
      this.props.nextAction({
        data: {},
        url: `/workflows/application/${params.applicationId}/workflow/${this.props.match.params.workflowtype}/next`,
        success: (response) => {
          const routeUrl = response.state && response.state.url;
          this.props.history.push(routeUrl);
        },
        fail: (error) => {
          this.props.history.push({
            pathname: `/applications/${this.props.match.params.workflowtype}/general-error-page`,
            search: '',
            state: {
              data: error.data,
            },
          });
        },
      });
    }
  }

  render() {
    // eslint-disable-next-line
    const { className, history, workflow } = this.props;
    return (
      <Fragment>
        <Container fluid>
          <Heading
            heading="Sign Credit Loan Document"
            isCardVisible={false}
          />
          <Row>
            <Col sm={12} md={9}>
              <iframe
                src={get(workflow, ['state', 'data', 'url'])}
                // src="http://localhost:3000/dashboard/borrowers-merchant/complete"
                width="100%"
                height={this.state.height - 150}
                title="docusign"
                id="docusign"
                frameBorder="0"
              />
            </Col>
            <Col sm={12} md={3}>
              <div className="doc-info">
                <p>
                  <strong>No Interest on Principal Option Promotion -</strong> Your loan may have a No Interest on Principal Option Promotion included. This promotion can save you money if you pay off the principal amount of the loan in full within the Promotional Period (&quot;Promotional Period&quot;). During the Promotional Period you will be responsible for making all of your monthly payments and your loan will accrue interest on a monthly basis. If you pay off your loan within the Promotional Period, the monthly payments that you have made during this period, which includes accrued interest, will be deducted from the principal amount of the loan. Length of Promotional Periods vary, please review your loan agreement for full details.
                </p>
                <p>
                  <strong>APR - An Annual Percentage Rate (APR)</strong> is the annual rate charged to borrow funds, inclusive of all fees and charges. LendingUSA calculates APR by combining the Interest Rate and Origination Fees to provide a simple annual rate.
                </p>
                <p>
                  <strong>Origination Fee -</strong> An origination fee of up to 8% may be included in your loan, please review your Loan Agreement for full details.
                </p>
                <p>
                  <strong>Interest Rate -</strong> The interest Rate is the percent of principal charged by the Lender for the use of its funds.
                </p>
                <p>
                  <strong>Late Fee -</strong> We believe that borrowers should not be penalized for simple mistakes or oversights, as such, our Late Fee is only $5.00 and will be assessed if you fail to make a payment within 16 days of its scheduled due date.
                </p>
                <p>Please call LendingUSA directly with any questions regarding the loan or its terms at <strong>800-944-6177</strong></p>
              </div>
            </Col>
          </Row>
        </Container>
      </Fragment>
    );
  }
}

CreditAppDoc.propTypes = {
  className: PropTypes.string,
  history: PropTypes.object.isRequired,
  nextAction: PropTypes.func.isRequired,
  workflow: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

CreditAppDoc.defaultProps = {
  className: '',
};

export default connect(
  state => ({
    workflow: state.workflow,
  }),
  {
    nextAction,
  }
)(CreditAppDoc);
