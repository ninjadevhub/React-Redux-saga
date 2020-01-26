import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import cn from 'classnames';
import {
  Route,
  Redirect,
  Switch,
  withRouter,
} from 'react-router-dom';
import IdleTimer from 'react-idle-timer';

import { Header } from 'components/Header';
import Footer from 'components/Footer';
import PersonifyFooter from 'components/Footer/PersonifyFooter';
import { signOut } from 'actions/auth';
import Login from './pages/Auth/Login';
import SetNewPassword from './pages/Auth/SetNewPassword';
import Forgot from './pages/Auth/Forgot';
import ChangePassword from './pages/Auth/ChangePassword';
import PlanMenu from './pages/PlanMenu';
import Merchant from './pages/MerchantApply/';
import Dashboard from './pages/Dashboard';
import ADFDashboard from './pages/Dashboard/ADFDashboard';
import ApplicationReview from './pages/ApplicationReview';
import ApplicationDetail from './pages/ApplicationDetail';
import TextApplyFrontend from './pages/TextApplyFrontend';
import Profile from './pages/Profile';
import FundingInformation from './pages/FundingInformation';
import RequestBrochures from './pages/RequestBrochures';
import WebBanners from './pages/WebBanners';
import Congrats from './pages/Congrats';
import RefundReview from './pages/Refunds';

// Internal pages
import Application from './pages/BorrowerMerchantApply/InternalPages/Application';
import CheckingApplication from './pages/BorrowerMerchantApply/InternalPages/CheckingApplication';
import Congratulations from './pages/BorrowerMerchantApply/InternalPages/Congratulations';
import Declined from './pages/BorrowerMerchantApply/InternalPages/Declined';
import ManualVerification from './pages/BorrowerMerchantApply/InternalPages/ManualVerification';
import Timeout from './pages/BorrowerMerchantApply/InternalPages/Timeout';
import Blocked from './pages/BorrowerMerchantApply/InternalPages/Blocked';
import DuplicationDeclined from './pages/BorrowerMerchantApply/InternalPages/DuplicationDeclined';
import Pending from './pages/BorrowerMerchantApply/InternalPages/Pending';
import HardPullCounterOffer from './pages/BorrowerMerchantApply/InternalPages/CounterOffer';
import UgaDeclined from './pages/BorrowerMerchantApply/InternalPages/UgaDeclined';
import CreditAppDecision from './pages/BorrowerMerchantApply/InternalPages/CreditAppDecision';
import AutoPayElection from './pages/BorrowerMerchantApply/InternalPages/AutoPayElection';
import CreditOfferConfirmation from './pages/BorrowerMerchantApply/InternalPages/CreditOfferConfirmation';
import CreditAppDoc from './pages/BorrowerMerchantApply/InternalPages/CreditAppDoc';
import IdCheckPersonalInfo from './pages/BorrowerMerchantApply/InternalPages/IdCheckPersonalInfo';
import IdCheckQuestions from './pages/BorrowerMerchantApply/InternalPages/IdCheckQuestions';
import WorkflowComplete from './pages/BorrowerMerchantApply/InternalPages/WorkflowComplete';
import SignLoanDocument from './pages/BorrowerMerchantApply/InternalPages/SignLoanDocument';
import NeedVoiceCall from './pages/BorrowerMerchantApply/InternalPages/NeedVoiceCall';
import DirectSignLoanDocument from './pages/BorrowerMerchantApply/InternalPages/DirectSignLoanDocument';
import DocusignTimeout from './pages/BorrowerMerchantApply/InternalPages/DocusignTimeout';
import DocusignDeclined from './pages/BorrowerMerchantApply/InternalPages/DocusignDeclined';
import Error from './pages/BorrowerMerchantApply/InternalPages/Error';
import GeneralErrorPage from './pages/BorrowerMerchantApply/InternalPages/GeneralErrorPage';
import withIPAddress from './withIPAddress';
import isApplicationFiltersLoaded from 'components/Hoc/isApplicationFiltersLoaded';

// PersonifyDeclineStart
import PersonifyDeclineStart from './pages/lenders/ADF/PersonifyDeclineStart';
import PersonifyDecline from './pages/lenders/ADF/Decline';
import PersonifyApproved from './pages/lenders/ADF/Approved';
import PersonifyConsent from './pages/lenders/ADF/Consent';
import PersonifyIncome from './pages/lenders/ADF/Income';
import PersonifySignaturePending from './pages/lenders/ADF/SignaturePending';
import PersonifySignAgreement from './pages/lenders/ADF/SignAgreement';
import PersonifySelectOffer from './pages/lenders/ADF/SelectOffer';
import PersonifyAch from './pages/lenders/ADF/Ach';
import PersonifyConfirm from './pages/lenders/ADF/Confirm';
import PersonifySecurity from './pages/lenders/ADF/Security';
import PersonifyKba from './pages/lenders/ADF/Kba';
import PersonifyEmailSent from './pages/lenders/ADF/EmailSent';
import PersonifyError from './pages/lenders/ADF/Error';
import CheckingPersonifyApplication from './pages/lenders/ADF/CheckingApplication';
import PersonifyTimeoutError from './pages/lenders/ADF/TimeoutError';

// Reprompt Pages
import RepromptLastName from './pages/Reprompt/LastName';
import SocialSecurityNumber from './pages/Reprompt/SocialSecurityNumber';
import AddressMismatch from './pages/Reprompt/AddressMismatch';
import TextLink from './pages/Reprompt/TextLink';
import IDUpload from './pages/Reprompt/IDUpload';
import IncomeVerification from './pages/Reprompt/IncomeVerification';

import { appConfig } from 'config/appConfig';
import { parseUrlParams } from 'utils/parseUrlParams';
import styles from './App.scss'; // eslint-disable-line
import { PartnerHeader } from '../components/Header';

const params = parseUrlParams(window.location.search);
const PrivateRoute = ({ component: InternalComponent, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
        const token = localStorage.getItem('idToken');
        const isADFMerchant = appConfig.adfMerchantId === localStorage.getItem('merchantId');
        // eslint-disable-next-line react/prop-types
        const { pathname } = props.location;
        if (isADFMerchant && token) {
          if (
            pathname !== '/dashboard' &&
            pathname !== '/dashboard/application-review/action/AllApplications' &&
            pathname !== '/dashboard/application-detail' &&
            pathname.indexOf('/personify') === -1
          ) {
            return (<Redirect
              to={{
                pathname: '/',
                // eslint-disable-next-line
                state: { from: props.location },
              }}
            />);
          }
        }
        return token ?
          <InternalComponent {...props} />
        :
          <Redirect
            to={{
              pathname: '/',
              // eslint-disable-next-line
              state: { from: props.location },
            }}
          />;
      }
    }
  />
);

const PublicRoute = ({ component: InternalComponent, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
        const token = localStorage.getItem('idToken');
        return !token ?
          <InternalComponent {...props} />
        :
          <Redirect
            to={{
              pathname: '/dashboard',
              // eslint-disable-next-line
              state: { from: props.location },
            }}
          />;
      }
    }
  />
);

const MultiRoute = ({ component: InternalComponent, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const isADFMerchant = appConfig.adfMerchantId === localStorage.getItem('merchantId');
      if (isADFMerchant) {
        // console.log('location', props.location);
        // eslint-disable-next-line react/prop-types
        const { pathname } = props.location;
        if (
          pathname !== '/dashboard' &&
          pathname !== '/applications/dtm/application' &&
          pathname !== '/applications/dtm/congratulations' &&
          pathname !== '/applications/dtm/declined' &&
          pathname !== '/applications/dtm/uga-declined' &&
          pathname !== '/applications/dtm/error' &&
          pathname !== '/applications/dtm/general-error-page' &&
          pathname !== '/applications/dtm/duplicate-declined' &&
          pathname !== '/applications/dtm/pending' &&
          pathname.indexOf('/personify') === -1
        ) {
          // eslint-disable-next-line react/prop-types
          return (<Redirect
            to={{
              pathname: '/dashboard',
              // eslint-disable-next-line
              state: { from: props.location },
            }}
          />);
        }
      }
      return <InternalComponent {...props} />;
    }
  }
  />
);

const routes = [
  {
    name: 'Login',
    pathname: '/',
    component: Login,
    exact: true,
    wrapper: PublicRoute,
  },
  {
    name: 'Forgot',
    pathname: '/forgot',
    component: Forgot,
    exact: true,
    wrapper: PublicRoute,
  },
  {
    name: 'New Password',
    pathname: '/set-new-password',
    component: SetNewPassword,
    exact: true,
    wrapper: PublicRoute,
  },
  {
    name: 'Application',
    pathname: '/applications/:workflowtype/application',
    component: withIPAddress(Application),
    exact: true,
    wrapper: MultiRoute,
  },
  {
    name: 'Congratulations',
    pathname: '/applications/:workflowtype/congratulations',
    component: Congratulations,
    exact: true,
    wrapper: MultiRoute,
  },
  {
    name: 'Declined',
    pathname: '/applications/:workflowtype/declined',
    component: Declined,
    exact: true,
    wrapper: MultiRoute,
  },
  {
    name: 'QuestionsFailed',
    pathname: '/applications/:workflowtype/identity/manual-verification',
    component: ManualVerification,
    exact: true,
    wrapper: MultiRoute,
  },
  {
    name: 'Timeout',
    pathname: '/applications/:workflowtype/identity/timeout',
    component: Timeout,
    exact: true,
    wrapper: MultiRoute,
  },
  {
    name: 'Blocked',
    pathname: '/applications/:workflowtype/declined2',
    component: Blocked,
    exact: true,
    wrapper: MultiRoute,
  },
  {
    name: 'Duplication Declined',
    pathname: '/applications/:workflowtype/duplicate-declined',
    component: DuplicationDeclined,
    exact: true,
    wrapper: MultiRoute,
  },
  {
    name: 'Pending',
    pathname: '/applications/:workflowtype/pending',
    component: Pending,
    exact: true,
    wrapper: MultiRoute,
  },
  {
    name: 'CounterOffer',
    pathname: '/applications/:workflowtype/counter-offer',
    component: HardPullCounterOffer,
    exact: true,
    wrapper: MultiRoute,
  },
  {
    name: 'UGA Declined',
    pathname: '/applications/:workflowtype/uga-declined',
    component: UgaDeclined,
    exact: true,
    wrapper: MultiRoute,
  },
  {
    name: 'Docusign Declined',
    pathname: '/applications/:workflowtype/docusign/declined?applicationId=:applicationId',
    component: DocusignDeclined,
    exact: true,
    wrapper: MultiRoute,
  },

  // start Internal pages
  {
    name: 'Checking Application',
    pathname: '/applications/:workflowtype/checkin',
    component: CheckingApplication,
    exact: true,
    wrapper: MultiRoute,
  },
  {
    name: 'Credit Offer',
    pathname: '/applications/:workflowtype/creditoffer',
    component: CreditAppDecision,
    exact: true,
    wrapper: MultiRoute,
  },
  {
    name: 'Auto-Pay Election',
    pathname: '/applications/:workflowtype/autopayelection',
    component: AutoPayElection,
    exact: true,
    wrapper: MultiRoute,
  },
  {
    name: 'Credit Offer Confirmation',
    pathname: '/applications/:workflowtype/creditofferconfirmation',
    component: CreditOfferConfirmation,
    exact: true,
    wrapper: MultiRoute,
  },
  {
    name: 'Credit App Docusign',
    pathname: '/applications/:workflowtype/creditappdoc',
    component: CreditAppDoc,
    exact: true,
    wrapper: MultiRoute,
  },
  {
    name: 'ID Check Personal Information',
    pathname: '/applications/:workflowtype/identity/confirmation',
    component: IdCheckPersonalInfo,
    exact: true,
    wrapper: MultiRoute,
  },
  {
    name: 'ID Check Questions',
    pathname: '/applications/:workflowtype/identity/questions',
    component: IdCheckQuestions,
    exact: true,
    wrapper: MultiRoute,
  },
  {
    name: 'Workflow Complete',
    pathname: '/applications/:workflowtype/complete',
    component: WorkflowComplete,
    exact: true,
    wrapper: MultiRoute,
  },
  {
    name: 'Sign Loan Document',
    pathname: '/applications/:workflowtype/step/:stepname',
    component: DirectSignLoanDocument,
    exact: true,
    wrapper: MultiRoute,
  },
  {
    name: 'Sign Loan Document',
    pathname: '/applications/:workflowtype/signloandocument?applicationId=:applicationId',
    component: SignLoanDocument,
    exact: true,
    wrapper: MultiRoute,
  },
  {
    name: 'Need Voice Call',
    pathname: '/applications/:workflowtype/needvoicecall?applicationId=:applicationId',
    component: NeedVoiceCall,
    exact: true,
    wrapper: MultiRoute,
  },
  {
    name: 'Signing document timed out',
    pathname: '/applications/:workflowtype/docusign/timeout',
    component: DocusignTimeout,
    exact: true,
    wrapper: MultiRoute,
  },
  {
    name: 'Error Page',
    pathname: '/applications/:workflowtype/error',
    component: Error,
    exact: true,
    wrapper: MultiRoute,
  },
  {
    name: 'General Error Page',
    pathname: '/applications/:workflowtype/general-error-page',
    component: GeneralErrorPage,
    exact: true,
    wrapper: MultiRoute,
  },
  // end Internal pages
  {
    name: 'Merchant',
    pathname: '/dashboard/merchants',
    component: Merchant,
    exact: true,
    wrapper: PrivateRoute,
  },
  {
    name: 'Reset Password',
    pathname: '/dashboard/reset-password',
    component: ChangePassword,
    exact: true,
    wrapper: PrivateRoute,
  },
  {
    name: 'Plan Menu',
    pathname: '/dashboard/plan-menu',
    component: PlanMenu,
    exact: true,
    wrapper: PrivateRoute,
  },
  {
    name: 'Application Review',
    pathname: '/dashboard/application-review/action/:statusCode/:searchQuery',
    component: ApplicationReview,
    wrapper: PrivateRoute,
  },
  {
    name: 'Application Review',
    pathname: '/dashboard/application-review/action/:statusCode',
    component: ApplicationReview,
    wrapper: PrivateRoute,
  },
  {
    name: 'Application Detail',
    pathname: '/dashboard/application-detail',
    component: ApplicationDetail,
    wrapper: PrivateRoute,
  },
  {
    name: 'Text Apply',
    pathname: '/dashboard/text-apply',
    component: TextApplyFrontend,
    wrapper: PrivateRoute,
  },
  {
    name: 'Profile Settings',
    pathname: '/dashboard/profile',
    component: Profile,
    wrapper: PrivateRoute,
  },
  {
    name: 'Funding Information',
    pathname: '/dashboard/funding-information',
    component: FundingInformation,
    wrapper: PrivateRoute,
  },
  {
    name: 'Request Brochures',
    pathname: '/dashboard/request-brochures',
    component: RequestBrochures,
    wrapper: PrivateRoute,
  },
  {
    name: 'Get Website Banners',
    pathname: '/dashboard/web-banners',
    component: WebBanners,
    wrapper: PrivateRoute,
  },
  {
    name: 'Refunds',
    pathname: '/dashboard/refunds/:statusCode',
    component: RefundReview,
    wrapper: PrivateRoute,
  },
  {
    name: 'Congratulations',
    pathname: '/dashboard/congrats',
    component: Congrats,
    wrapper: PrivateRoute,
  },
  {
    name: 'Dashboard',
    pathname: '/dashboard',
    component: isApplicationFiltersLoaded(Dashboard),
    wrapper: PrivateRoute,
  },
  {
    name: 'Personify Decline Start',
    pathname: '/personify/decline-start',
    component: PersonifyDeclineStart,
    wrapper: PrivateRoute,
  },
  {
    name: 'Personify Decline',
    pathname: '/personify/decline',
    component: PersonifyDecline,
    wrapper: PrivateRoute,
  },
  {
    name: 'Personify Pre Approved',
    pathname: '/personify/approved',
    component: PersonifyApproved,
    wrapper: PrivateRoute,
  },
  {
    name: 'Personify Consent',
    pathname: '/personify/consent',
    component: PersonifyConsent,
    wrapper: PrivateRoute,
  },
  {
    name: 'Personify Income',
    pathname: '/personify/income',
    component: PersonifyIncome,
    wrapper: PrivateRoute,
  },
  {
    name: 'Personify Signature Pending',
    pathname: '/personify/pending',
    component: PersonifySignaturePending,
    wrapper: PrivateRoute,
  },
  {
    name: 'Personify Sign Loan Agreement',
    pathname: '/personify/sign',
    component: PersonifySignAgreement,
    wrapper: MultiRoute,
  },
  {
    name: 'Personify Select Offer',
    pathname: '/personify/select-offer',
    component: PersonifySelectOffer,
    wrapper: PrivateRoute,
  },
  {
    name: 'Personify Ach Page',
    pathname: '/personify/ach',
    component: PersonifyAch,
    wrapper: PrivateRoute,
  },
  {
    name: 'Personify Confirm Page',
    pathname: '/personify/confirm',
    component: PersonifyConfirm,
    wrapper: PrivateRoute,
  },
  {
    name: 'Personify Security Page',
    pathname: '/personify/security',
    component: PersonifySecurity,
    wrapper: PrivateRoute,
  },
  {
    name: 'Personify Security Page',
    pathname: '/personify/kba',
    component: PersonifyKba,
    wrapper: PrivateRoute,
  },
  {
    name: 'Personify Email Sent Page',
    pathname: '/personify/email-sent',
    component: PersonifyEmailSent,
    wrapper: PrivateRoute,
  },
  {
    name: 'Personify Checking Application',
    pathname: '/personify/checkin',
    component: CheckingPersonifyApplication,
    wrapper: PrivateRoute,
  },
  {
    name: 'Personify Error Page',
    pathname: '/personify/error',
    component: PersonifyError,
    wrapper: PrivateRoute,
  },
  {
    name: 'Personify Error Page',
    pathname: '/personify/timeout',
    component: PersonifyTimeoutError,
    wrapper: PrivateRoute,
  },
  // Reprompting routs
  {
    name: 'Reprompt last name',
    pathname: '/applications/:workflowtype/lastname',
    component: RepromptLastName,
    wrapper: PrivateRoute,
  },
  {
    name: 'Reprompt social security number',
    pathname: '/applications/:workflowtype/ssn',
    component: SocialSecurityNumber,
    wrapper: PrivateRoute,
  },
  {
    name: 'Reprompt address mismatch',
    pathname: '/applications/:workflowtype/address-mismatch',
    component: AddressMismatch,
    wrapper: PrivateRoute,
  },
  {
    name: 'Text Link',
    pathname: '/applications/:workflowtype/text-link',
    component: TextLink,
    wrapper: PrivateRoute,
  },
  {
    name: 'ID Upload',
    pathname: '/applications/:workflowtype/id-upload',
    component: IDUpload,
    wrapper: PrivateRoute,
  },
  {
    name: 'Income Verification',
    pathname: '/applications/:workflowtype/income-verification',
    component: IncomeVerification,
    wrapper: PrivateRoute,
  },
];

const extendedFooters = [
  '/dashboard/text-apply',
  '/applications/dtm/application',
];

export class ParentRoute extends Component {
  constructor(props) {
    super(props);
    this.idleTimer = null;

    this.state = {
      isHeaderHidden: !localStorage.getItem('idToken') && (params.iframe === '1' || params.iframe === 'true'),
    };
  }

  // eslint-disable-next-line
  onIdle = (e) => {
    localStorage.getItem('idToken') && this.props.signOut();
  }

  componentDidMount() {
    const { location } = this.props;
    if (appConfig.enableIntercom && location.pathname.indexOf('/personify') === -1) {
      window.intercomInit && window.intercomInit(appConfig.intercomId);
      window.intercomInit && window.upscope(appConfig.upscopeId);
    }
  }

  loadIntercom = () => {
    if (appConfig.enableIntercom) {
      window.intercomInit && window.intercomInit(appConfig.intercomId);
    }
  }

  stopIntercom = () => {
    if (appConfig.enableIntercom) {
      window.intercomReset(appConfig.intercomId);
    }
  }

  renderFooter = () => {
    const { location: { pathname } } = this.props;
    let footer = <div />;
    switch (pathname) {
      case '/applications/dtm/autoPayElection':
        footer = <Footer pageName="autoPay" />;
        break;
      case '/applications/dtm/congratulations':
        footer = <Footer pageName="congratulation" />;
        break;
      case '/applications/dtm/creditoffer':
        footer = <Footer pageName="crerditOffer" />;
        break;
      case 'applications/dtm/creditofferconfirmation':
        footer = <Footer pageName="creditOfferConfirmation" />;
        break;
      case '/personify/decline-start':
      case '/personify/decline':
      case '/personify/approved':
      case '/personify/consent':
      case '/personify/income':
      case '/personify/pending':
      case '/personify/sign':
      case '/personify/select-offer':
      case '/personify/ach':
      case '/personify/confirm':
      case '/personify/email-sent':
      case '/personify/error':
      case '/personify/timeout':
        footer = <PersonifyFooter />;
        break;
      default:
        footer = <Footer isContentVisible={extendedFooters.indexOf(pathname) !== -1} />;
    }

    return footer;
  }

  renderHeader = () => {
    const { location: { pathname } } = this.props;
    let header = <div />;
    switch (pathname) {
      case '/personify/decline':
      case '/personify/approved':
      case '/personify/consent':
      case '/personify/income':
      case '/personify/pending':
      case '/personify/sign':
      case '/personify/select-offer':
      case '/personify/ach':
      case '/personify/confirm':
      case '/personify/email-sent':
      case '/personify/error':
      case '/personify/timeout':
        header = <PartnerHeader />;
        break;
      default:
        header = <Header />;
    }

    return header;
  }

  render() {
    const { location } = this.props;
    const { isHeaderHidden } = this.state;

    if (location.pathname.indexOf('/personify') !== -1) {
      if (window.Intercom) {
        this.stopIntercom();
      }
    } else {
      this.loadIntercom();
    }

    return (
      <IdleTimer
        ref={(ref) => { this.idleTimer = ref; }}
        element={document}
        onActive={this.onActive}
        onIdle={this.onIdle}
        timeout={1000 * 60 * 60}
      >
        <div className="App bg-light">
          {
            !isHeaderHidden && this.renderHeader()
          }
          {
            (location.pathname === '/applications/dtm/autoPayElection') &&
              <div className="autoPayHeader" />
          }
          <div className={cn('container-body', (location.pathname === '/applications/dtm/uga-declined') && 'px-0')}>
            <Switch>
              {routes.map((route, index) => (
                <route.wrapper
                  component={(route.pathname === '/dashboard' && appConfig.adfMerchantId === localStorage.getItem('merchantId')) ? isApplicationFiltersLoaded(ADFDashboard) : route.component}
                  key={index}
                  path={route.pathname}
                  exact={route.exact || false}
                />))
              }
              <Redirect to="/" />
            </Switch>
          </div>
          {this.renderFooter()}
        </div>
      </IdleTimer>
    );
  }
}

PublicRoute.propTypes = {
  component: PropTypes.any.isRequired,
};

PrivateRoute.propTypes = {
  component: PropTypes.any.isRequired,
};

MultiRoute.propTypes = {
  component: PropTypes.any.isRequired,
};

ParentRoute.propTypes = {
  signOut: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
};

export default compose(
  withRouter,
  connect(
    state => ({
      auth: state.auth,
    }),
    {
      signOut,
    }
  )
)(ParentRoute);
