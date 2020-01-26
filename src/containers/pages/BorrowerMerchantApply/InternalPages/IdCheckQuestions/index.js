import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import { Radio } from 'react-bootstrap';
import Loading from 'react-loading-components';
import _ from 'lodash';
import get from 'lodash/get';
import {
  nextAction,
} from 'actions/workflow';
import { Button } from 'components/Button';
import { parseUrlParams } from 'utils/parseUrlParams';
import User from 'assets/images/pending.svg';
import './style.scss';

class IdCheckQuestions extends Component {
  state = {
    // eslint-disable-next-line
    response: {},
    request: {},
    isAllFilled: false,
    isLoading: false,
    isQuestionsLoading: false,
    isValid: true,
  };

  componentWillMount() {
    const params = parseUrlParams(window.location.search);
    const { workflow } = this.props;
    if (!params.applicationId) {
      this.props.history.push(`/applications/${this.props.match.params.workflowtype}/application`);
    }
    if (get(workflow, 'state.applicantFirstName') === undefined) {
      this.props.history.push(`/applications/${this.props.match.params.workflowtype}/checkin?applicationId=${params.applicationId || ''}`);
    }
    if (get(workflow, 'state.questions')) {
      this.initializeRequest(workflow);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  initializeRequest(workflow) {
    const { questions, conversationId, questionSetId } = get(workflow, 'state');
    const request = {
      ConversationId: conversationId,
      QuestionSetId: questionSetId,
    };
    const answers = questions.map((q) => {
      const { questionId } = q;
      return {
        QuestionId: questionId,
        ChoiceId: null,
      };
    });
    request.Answers = answers;
    this.setState({ request });
  }

  handleMerchantReturnClick = (e) => {
    e.preventDefault();
    const params = parseUrlParams(window.location.search);
    if (params.applicationId) {
      this.props.history.push('/dashboard');
    }
  }

  handleChange = (event, choiceId) => {
    const { request: { Answers } } = this.state;
    let answersToUpdate = _.map(Answers, answer => answer);
    answersToUpdate = answersToUpdate.map((answer) => {
      if (answer.QuestionId === event.target.name) {
        return {
          ...answer,
          ChoiceId: choiceId,
        };
      }
      return answer;
    });
    const emptyAnswers = answersToUpdate.filter(answer => answer.ChoiceId === null) || [];
    if (Array.isArray(emptyAnswers) && emptyAnswers.length === 0) {
      this.setState({ isAllFilled: true });
    }
    this.setState({
      request: {
        ...this.state.request,
        Answers: answersToUpdate,
      },
    });
  }

  handleSubmitForm = (e) => {
    e.preventDefault();
    const { isAllFilled } = this.state;
    if (!isAllFilled) this.setState({ isValid: false });
    else this.setState({ isValid: true });

    const params = parseUrlParams(window.location.search);
    if (params.applicationId && isAllFilled) {
      const { request } = this.state;
      this.setState({
        isLoading: true,
      });
      this.props.nextAction({
        data: request,
        url: `/workflows/application/${params.applicationId}/workflow/${this.props.match.params.workflowtype}/next`,
        success: (response) => {
          const routeUrl = response.state && response.state.url;
          this.setState({
            isAllFilled: false,
            isLoading: false,
          });
          const workflow = response.state.questions && response;
          if (workflow) this.initializeRequest(workflow);
          this.props.history.push(routeUrl);
        },
        // eslint-disable-next-line
        fail: (error) => {
          this.setState({
            isAllFilled: false,
            isLoading: false,
          });
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
    const { isLoading, isValid, isQuestionsLoading } = this.state;
    const { workflow } = this.props;
    const questions = get(workflow, 'state.questions');
    const attempt = get(workflow, 'state.attempt');
    return (
      <Container fluid>
        <Row>
          <Col sm={{ size: 8, offset: 2 }} className="d-flex flex-column justify-content-center">
            <h2>Identity Verification</h2>
            <div className="d-flex align-items-center">
              <img src={User} alt="User Icon" />
              <Col className="pl-30">
                <Row>LendingUSA</Row>
              </Col>
            </div>
          </Col>
        </Row>
        <Row>
          <Col sm={{ size: 8, offset: 2 }} className="d-flex flex-column justify-content-center pt-20">
            {!isLoading &&
              attempt === 2 && (
                <div>
                  <p className="form-note">Sorry, we were unable to confirm your identity. Please try again.</p>
                </div>
              )}
            <h4>ID Check - Identification Questions</h4>
            <p>Please respond to the questions below so that we may verify your identity. Once your identity has been verified, you&#39;ll be able to sign your loan documents.</p>
          </Col>
        </Row>
        <Row>
          {isQuestionsLoading && (
            <div className="loadingContainer">
              <Loading
                type="puff"
                width={100}
                height={100}
                fill="#f44242"
              />
            </div>
          )}
          {!isQuestionsLoading && (
            <Col sm={{ size: 8, offset: 2 }} className="d-flex flex-column justify-content-center">
              {questions &&
                questions.map((q) => {
                  const { choices, question, questionId } = q;
                  return (
                    <div className="pt-05" key={questionId}>
                      <Col sm={12}>
                        <Row>
                          <strong>{question}</strong>
                        </Row>
                        <Row>
                          {
                            choices.map(c => (
                              <Col sm={12} md={6} key={c.choiceId}>
                                <Radio value="Answer1" name={questionId} onChange={e => this.handleChange(e, c.choiceId)}>{c.choice}</Radio>
                              </Col>
                            ))
                          }
                        </Row>
                      </Col>
                    </div>
                  );
                })}
              {!isValid && (
                <div className="pt-10">
                  <p className="form-note">Please answer all of the questions provided.</p>
                </div>
              )}
            </Col>
          )}
        </Row>
        <Row>
          <Col className="d-flex justify-content-center pt-20">
            <Button
              color="primary"
              className="w-80"
              disabled={isLoading}
              isLoading={isLoading}
              onClick={this.handleSubmitForm}
            >
              Submit
            </Button>
            <Button
              className="large arrow buttonStyle ml-30"
              onClick={this.handleMerchantReturnClick}
              color="primary"
            >
              Cancel
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

IdCheckQuestions.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  nextAction: PropTypes.func.isRequired,
  workflow: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

IdCheckQuestions.defaultProps = {
};

const mapStateToProps = state => ({
  workflow: state.workflow,
});

const mapDispatchToProps = {
  nextAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(IdCheckQuestions);
