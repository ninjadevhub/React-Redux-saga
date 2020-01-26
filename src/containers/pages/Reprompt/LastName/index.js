import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import { nextAction } from 'actions/workflow';
import { parseUrlParams } from 'utils/parseUrlParams';
import Validator from 'components/Validator/Validator';
import { toTitleCase } from 'utils/toTitleCase';

import {
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Row,
} from 'reactstrap';
import { Button } from 'components/Button';
import Input from 'components/Form/Input';
import schema from './schema';

class LastName extends Component {
  state = {
    // eslint-disable-next-line
    response: {},
    isLoading: false,
    prevLastname: null,
  };

  componentWillMount() {
    const params = parseUrlParams(window.location.search);
    const { history, workflow } = this.props;

    if (get(workflow, 'state.data') === undefined) {
      history.push(`/applications/${this.props.match.params.workflowtype}/checkin?applicationId=${params.applicationId || ''}`);
    } else {
      this.setState({
        prevLastname: get(workflow, 'state.data.lastName'),
      });
    }

    if (!params.applicationId) {
      history.push(`/applications/${this.props.match.params.workflowtype}/application`);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.workflow, this.props.workflow)) {
      this.setState({
        prevLastname: get(nextProps.workflow, 'state.data.lastName'),
      });
    }
  }

  handleButtonClick = (e) => {
    e.preventDefault();
    const { validator: { validate, errors, values } } = this.props;

    if (validate(schema).isValid) {
      const params = parseUrlParams(window.location.search);
      this.setState({ isLoading: true });
      if (params.applicationId) {
        this.props.nextAction({
          data: {
            LastName: values.lastName,
          },
          url: `/workflows/application/${params.applicationId}/workflow/dtm/next`,
          success: (response) => {
            this.setState({ isLoading: false });
            const routeUrl = response.state && response.state.url;
            this.props.history.push(routeUrl);
          },
          fail: (error) => {
            this.props.history.push({
              pathname: '/applications/dtm/general-error-page',
              search: '',
              state: {
                data: error.data,
              },
            });
          },
        });
      }
    } else {
      console.log('api error', errors, !this.state.isVerified && 'address is not verified');
    }
  }

  handleInputChange = (event) => {
    const { validator: { onChangeHandler } } = this.props;
    onChangeHandler(event.target.name, (event.target.value).replace(/[^a-zA-Z '-]/g, ''));
  };

  handleBlur = (event) => {
    event.preventDefault();

    const { validator: { onChangeHandler } } = this.props;
    onChangeHandler(event.target.name, toTitleCase(event.target.value));
  }

  render() {
    const { isLoading, prevLastname } = this.state;
    const { validator: { values, errors } } = this.props;

    return (
      <div className="page-preapproved narrow">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} lg={6} className="text-center mb-2 mt-2 mt-md-4">
              <img src="/icons/declined.svg" alt="Pro-Approved" className="mb-3" />
              <h1 className="mb-4">We had a difficult time verifying you</h1>
              <Row>
                <Col sm={{ size: 8, offset: 2 }} md={{ size: 10, offset: 1 }} lg={{ size: 8, offset: 2 }}>
                  <Card className="dark-shadow">
                    <CardBody>
                      <h4 className="mb-3">Please Re-enter Your Last Name</h4>
                      {
                        prevLastname &&
                          <p>You entered {prevLastname}</p>
                      }
                      <Form>
                        <FormGroup className="input-inline pb-0">
                          <Input
                            label="Last Name"
                            name="lastName"
                            value={values.lastName}
                            onChange={this.handleInputChange}
                            isRequired
                            hasError={!!errors.lastName}
                            errorMessage={errors.lastName}
                            onBlur={this.handleBlur}
                          />
                        </FormGroup>
                        <Button
                          color="primary"
                          size="lg"
                          className="w-100"
                          isLoading={isLoading}
                          onClick={this.handleButtonClick}
                        >
                          Submit
                        </Button>
                      </Form>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

LastName.propTypes = {
  history: PropTypes.object.isRequired,
  nextAction: PropTypes.func.isRequired,
  validator: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  workflow: PropTypes.object.isRequired,
};

LastName.defaultProps = {

};

export default compose(
  Validator(schema),
  connect(
    state => ({
      workflow: state.workflow,
    }),
    {
      nextAction,
    }
  )
)(LastName);
