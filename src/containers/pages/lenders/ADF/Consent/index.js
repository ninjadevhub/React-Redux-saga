import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import get from 'lodash/get';
import {
  ButtonGroup,
  Col,
  Container,
  Row,
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';
import { Button } from 'components/Button';
import Validator from 'components/Validator/Validator';
import { parseUrlParams } from 'utils/parseUrlParams';
import { nextAction } from 'actions/workflow';
import schema from './schema';

class PersonifyConsent extends Component {
  state = {
    isModalVisible: false,
    isLoading: false,
  }

  componentWillMount() {
    // eslint-disable-next-line
    const { history, workflow, validator: { setValues, validate } } = this.props;
    const params = parseUrlParams(window.location.search);
    if (!params.key) {
      history.push('/dashboard');
    }

    if (get(workflow, 'data') === undefined || get(workflow, 'activity') !== 'Consent') {
      history.push(`/personify/checkin?key=${params.key}`);
    }

    const initialFormData = {
      electronicDisclaimer: false,
      telephoneContact: false,
      creditReportDisclaimer: false,
      activeDutyMilitary: undefined,
      privacyPolicyDisclaimer: false,
      tcpaDisclosure: false,
      modalHeader: '',
      modalContent: '',
    };
    setValues(initialFormData);
    validate(schema);
  }

  onRadioBtnClick = (name, value) => {
    const { validator: { onChangeHandler, validate } } = this.props;
    onChangeHandler(name, value);
    validate(schema);
  }

  handleClickContinue = (e) => {
    e.preventDefault();

    const { validator: { values } } = this.props;
    const params = parseUrlParams(window.location.search);

    this.setState({ isLoading: true });
    this.props.nextAction({
      data: values,
      url: `/workflows/adf/${params.key}/next`,
      success: (response) => {
        this.setState({ isLoading: false });
        this.props.history.push(response.data.url);
      },
      fail: (error) => {
        this.setState({ isLoading: false });
        if (get(error, 'status') === 400) {
          this.props.history.push({
            pathname: '/personify/error',
            search: `key=${params.key}`,
            state: {
              data: get(error, 'data.failure'),
            },
          });
        } else if (get(error, 'status') === 504) {
          this.props.history.push({
            pathname: '/personify/timeout',
            search: `key=${params.key}`,
          });
        } else {
          this.props.history.push({
            pathname: '/personify/error',
            search: `key=${params.key}`,
          });
        }
      },
    });
  }

  displayModal = (type, e) => {
    e.preventDefault();

    let modalHeader = '';
    let modalContent = '';

    switch (type) {
      case 'electronicDisclaimer':
        modalHeader = 'Electronic Communications';
        modalContent = (
          <Fragment>
            <strong>DEFINITIONS: In this section of the agreement, &quot;Communications&quot; means any disclosure, notice, record or other type of information that is provided to you in connection with all transactions with us, including but not limited to, this Application, the Loan Agreement (if one is oﬀered to you), this Consent, Privacy policy, Notices of Adverse Action, federal, state and locally mandated brochures and disclosures, and transaction information.</strong>
            <br /><br />

            <strong>ELECTRONIC RECORDS AND SIGNATURE:</strong> From time to time we may be required by law to provide you certain written notices or disclosures that apply to your loan transaction that you may need to sign electronically. Described below are the terms and conditions for providing to you such notices and disclosures for your electronic signature. Please read the information below carefully and thoroughly, and if you can access this information electronically to your satisfaction and agree to the terms and conditions, please confirm your agreement by clicking the &quot;I Agree&quot; button below.
            <br /><br />

            <strong>CONSENT TO ELECTRONIC COMMUNICATIONS:</strong> The following terms and conditions govern electronic communications in connection with Communications and all transactions and communications evidenced hereby (the &quot;Consent&quot;).
            <br />

            By accepting these terms for electronic communications, you consent to conduct transactions with us electronically, use electronic signatures and Communications, and receive electronic mail (email) and electronic communication with respect to any and all transactions and Communications regarding your account, instead of receiving them in paper or by regular mail. By clicking the &quot;I agree&quot; button and submitting your Application, you are confirming that you have agreed to the terms and conditions of the Consent. Your consent will be eﬀective unless you withdraw it in the manner provided below.
            <br /><br />

            SCOPE OF CONSENT. We may provide information to you electronically by posting it online at the website, myaccount.personifyfinancial.com, or by email, which may include attachments or embedded links.
            <br /><br />

            HARDWARE AND SOFTWARE REQUIREMENTS. In order to receive electronic communications in connection with this transaction, you will need a working connection to the Internet and a working email address. Your browser must support the Transport Layer Security (&quot;TLS&quot;) protocol, version 1.1 or higher. TLS provides a secure channel to send and receive data over the Internet. The current versions of Internet Explorer, Firefox, Chrome, Safari, Opera and Android browsers support this feature. You will need software that allows you to view, save or print PDF files, such as Adobe Reader 6.0 or higher. You will also need either a printer connected to your computer to print disclosures/notices or suﬃcient hard drive space available to save the information (e.g., 1 megabyte or more). You must have your own Internet service provider. If we ever change the hardware and software requirements in a way that creates a material risk that you will not be able to access or retain a Communication that we previously sent you, we will send you a notice of the revised requirements. Please save and print a copy of this &quot;Electronic Communications&quot; section to confirm that you have the required hardware and software to conduct electronic transactions with us.
            <br /><br />

            WITHDRAWING CONSENT. <strong>If you do not consent, or withdraw your consent before you get a loan, you will not be able to obtain a loan from us.</strong> If you decide to receive Communications from us electronically, you may at any time and without charge change your mind and tell us thereafter you want to receive Communications only in paper format. You may withdraw your consent by calling us at (888) 578-9546.
            <br /><br />

            OBTAINING PAPER COPIES. We will not be obligated to provide any Communication to you in paper form unless you specifically request us to do so or we are required to do so. You may obtain a copy of any Communication by calling us at (888) 578-9546. You also can withdraw your consent to ongoing electronic communications in the same manner and ask that they be sent to you in paper or non-electronic form. The request for a paper copy of a Communication will not by itself constitute a withdrawal of your consent to receive Communications electronically. We reserve the right, but are not required, to send a paper copy of any Communication you authorize us to provide electronically.
            <br /><br />

            CONSEQUENCES OF CHANGING YOUR MIND. If you elect to receive Communications only in paper format, or if you withdraw the consent to receive communications electronically that you previously gave us after you have obtained a loan from us, it will significantly slow the speed at which we can complete certain steps in transactions with you and delivering notices to you.
            <br /><br />

            HOW TO UPDATE YOUR CONTACT INFORMATION. You agree to provide us with your current e-mail address and personal contact information. If your e- mail or other contact information changes, you must send us a notice of the new address by writing to us at Personify Financial loan center, PO Box 500650 San Diego, CA 92150, or sending us an e-mail to contact@personifyfinancial.com, using secure messaging, at least five (5) days before the change.
            <br /><br />

            We may amend (add to, delete or change) the terms of this Consent to electronic communication by providing you with advance notice in accordance with applicable law.
            <br /><br />

            By clicking the &quot;I Agree&quot; button below, you are confirming that:
            <br />

            (1) Your system meets the hardware and software requirements set forth above,
            <br />

            (2) You agree that all Communications of any kind delivered in an electronic manner, including but not limited to disclosures, agreements, statements, and notices will be accepted as &quot;written notice&quot; for all purposes, and to the use of electronic signatures,
            <br />

            (3) You are able to receive emails sent to the email address you have provided to us and to access and print or store information presented at this website, and
            <br />

            (4) You consent to having information regarding this transaction, and others you may enter into with us, transmitted via email to the email address you have provided to us, and to having that information communicated with any third party who has or obtains access to emails sent to that address.
            <br /><br />

            Rev 0.001
          </Fragment>
        );
        break;
      case 'creditReportDisclaimer':
        modalHeader = 'Credit Report and Verification';
        modalContent = (
          <Fragment>
            <b>CONSUMER CREDIT REPORT:</b> You authorize us to obtain one or more consumer credit reports on you in connection with your loan application and in connection with any updates, renewals, or extensions of any credit as a result of this loan application. If you ask, you will be informed whether or not such a report was obtained and, if so, the name and address of the agency that furnished the report. You also understand and agree that we may obtain a consumer credit report in connection with the review or collection of any loan made to you as a result of your loan application or for other legitimate purposes related to such loan. Your authorization for us to obtain your consumer credit report from consumer reporting agencies is valid as long as any amounts owed on such loan remain unpaid.
            <br /><br />
            <b>VERIFICATIONS:</b> You understand and authorize us to verify information you provide with third parties, and authorize those parties to provide verification of that information to us, including any and all supporting documentation. You understand that this may include, but is not limited to, verification of your employment, income and identity.
            <br /><br />
            <b>PUBLICLY AVAILABLE AND OTHER INFORMATION:</b> You understand and agree that we may obtain additional information about you from publicly available sources, including the Internet, as well as information about the manner in which you are conducting this transaction, including IP address, type of device used, sequence and timing of interactions with this electronic system, and similar information. You consent to our use of this information for verification or underwriting purposes to the extent permitted by law.
            <br /><br />
            <b>ADDITIONAL STATE NOTICES</b>
            <br /><br />
            <b>CALIFORNIA RESIDENTS:</b> A married applicant may apply for a separate account.
            <br /><br />
            <b>OHIO RESIDENTS:</b> The Ohio law against discrimination require that all creditors make credit equally available to all creditworthy customers, and that credit reporting agencies maintain separate credit histories on each individual upon request. The Ohio Civil Rights Commission administers compliance with this law.
            <br /><br />
            <b>WISCONSIN RESIDENTS:</b> If you are a married Wisconsin resident: (1) Your signature on this loan application confirms that the loan you are requesting is being incurred in the interest of your marriage or family. (2) No provision of any marital property agreement, unilateral statement under § 766.59 of the Wisconsin Statutes or court decree under § 766.70 adversely aﬀects the Holder&apos;s interest unless, prior to the time that the loan is approved, we are furnished with a copy of the marital property agreement, statement, or decree or has actual knowledge of the adverse provision. (3) You agree to cooperate with us so that your spouse receives written notice of, or a copy of the terms of, any loan that is approved.
            <br /><br />
            Rev 0.001
          </Fragment>
        );
        break;
      case 'telephoneContact':
        modalHeader = 'Telephone Contact';
        modalContent = (
          <Fragment>
            <b>EXPRESS CONSENT::</b> You understand and agree that we may need to contact you regarding the terms and conditions of this Agreement, specifically including your obligation to pay any amounts due hereunder and our right to pursue all legally available means to collect what you owe us. By accepting this Agreement, you expressly consent and agree to Lender, its affiliates, agents, service providers or any assignees, using verbal and written means to contact you as described in this &quot;Telephone Contact&quot; section.
            <br /><br />
            <b>SCOPE OF CONSENT:</b> This consent includes, without limitation, contact by manual calling methods, prerecorded or artificial voice calls/messages, text messages and/or automatic telephone dialing systems.
            <br /><br />
            You agree that we may monitor and record telephone calls regarding this Agreement to assure the quality of our service or for other reasons. You agree that we may call you, using an automatic telephone dialing system or otherwise, leave you a voice, prerecorded, or artificial voice message, or send you a text, email, or other electronic message for any purpose related to the servicing and collection of this Agreement (each a &quot;Communication&quot;). You agree that we may send a Communication to any telephone numbers, including cellular telephone numbers, or e-mail addresses you provided to us in connection with the origination of this Agreement. You acknowledge and confirm that you have the authority to provide the consent because you are either the subscriber of the telephone number(s) or you are the non-subscriber customary user who has authority to provide the consent. You also agree that we may include your personal information in a Communication.  You agree that we will not charge you for a Communication, but your service provider may. In addition, you understand and agree that we may always communicate with you in in any manner permissible by law that does not require your prior consent. You further understand and agree that the explicit terms and conditions of this “Telephone Contact” section are a material part of this Agreement without which this transaction would not be consummated.
            <br /><br />
            <b>By clicking the “I Agree” button below, you are confirming that you have expressly consented to receiving telephone contact regarding this Agreement as described in this “Telephone Contact” section.</b>
            <br /><br />
            Rev 0.001
          </Fragment>
        );
        break;
      case 'activeDutyMilitary':
        modalHeader = 'Active Duty Military and Dependents';
        modalContent = (
          <Fragment>
            If you are a member of the active military, or a spouse or dependent of a member of the active military, and your loan is subject to the provisions of the Military Lending Act, 10 U.S.C. § 987 and its implementing regulations, 32 C.F.R. § 232.1, et seq., the following apply to you.
            <br /><br />
            Federal law provides important protections to members of the Armed Forces and their dependents relating to extensions of consumer credit. In general, the cost of consumer credit to a member of the Armed Forces and his or her dependent may not exceed an annual percentage rate of 36 percent. This rate must include, as applicable to the credit transaction or account: The costs associated with credit insurance premiums; fees for ancillary products sold in connection with the credit transaction; any application fee charged (other than certain application fees for specified credit transactions or accounts); and any participation fee charged (other than certain participation fees for a credit card account).
            <br /><br />
            To hear this statement of your rights under the Military Lending Act, 10 U.S.C. § 987 and its implementing regulations, 32 C.F.R § 232.1, et seq., and for a description of your payment obligation, please call (888) 508-0293.
            <br /><br />
            <b>CALIFORNIA RESIDENTS:</b>Service member protections apply to service members called to active duty by the governor or federal service by the President of the United States for a period in excess of 7 days in any 14- day period. Service members include oﬃcers and enlisted members of the National Guard and Reservists of the United States Military Reserve. The spouse or legal dependent, or both, of a service member is also entitled to the benefits provided by California law.
            <br /><br />
            When you click the button below you agree that you have reviewed the explanation above and when you indicated your status as an active duty member of the military or a dependent of such on the application, you did so truthfully and accurately.
            <br /><br />
            Rev 0.001
          </Fragment>
        );
        break;
      case 'privacyPolicyDisclaimer':
        modalHeader = 'Privacy Policy';
        modalContent = (
          <Fragment>
            <div style={{ border: '1px solid #000', display: 'flex' }}>
              <div className="d-flex align-items-center" style={{ backgroundColor: '#000', padding: 5, color: '#fff', minWidth: 150, fontWeight: 'bold' }}>FACTS</div>
              <div className="d-flex align-items-center" style={{ fontWeight: 500, padding: 5 }}>WHAT DOES FIRST ELECTRONIC BANK DO WITH YOUR PERSONAL INFORMATION?</div>
            </div>
            <div style={{ border: '1px solid #000', display: 'flex', borderTop: 'none' }}>
              <div className="d-flex align-items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: 5, color: '#fff', minWidth: 150, fontWeight: 'bold' }}>Why?</div>
              <div className="d-flex align-items-center" style={{ fontWeight: 500, padding: 5 }}>
                Financial companies choose how they share your personal information.<br />
                Federal law gives consumers the right to limit some but not all sharing.<br />
                Federal law also requires us to tell you how we collect, share, and protect your personal information. Please read this notice carefully to understand what we do.
              </div>
            </div>
            <div style={{ border: '1px solid #000', display: 'flex', borderTop: 'none' }}>
              <div className="d-flex align-items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: 5, color: '#fff', minWidth: 150, fontWeight: 'bold' }}>What?</div>
              <div style={{ fontWeight: 500, padding: 5 }}>
                The types of personal information we collect and share depend on the product or service you have with us. This information can include:<br />
                <ul>
                  <li>Social Security number and income</li>
                  <li>account balances and payment history</li>
                  <li>credit history and credit scores</li>
                </ul>
                When you are no longer our customer, we continue to share your information as described in this notice.
              </div>
            </div>
            <div style={{ border: '1px solid #000', display: 'flex', borderTop: 'none' }}>
              <div className="d-flex align-items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: 5, color: '#fff', minWidth: 150, fontWeight: 'bold' }}>How?</div>
              <div style={{ fontWeight: 500, padding: 5 }}>
                All financial companies need to share customers&#39; personal information to run their everyday business. In the section below, we list the reasons  financial  companies  can  share  their  customers&#39; personal information; the reasons First Electronic Bank  chooses to share; and whether you can limit this sharing.
              </div>
            </div>
            <div className="mt-2 d-flex" style={{ border: '1px solid #000', padding: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
              <div style={{ flex: 3, padding: 5, color: '#fff' }}>
                <b>Reasons we can share your personal information</b>
              </div>
              <div style={{ flex: 1, padding: 5, color: '#fff' }}><b>Does First Electronic Bank share?</b></div>
              <div style={{ flex: 1, padding: 5, color: '#fff' }}><b>Can you limit this sharing?</b></div>
            </div>
            <div className="d-flex" style={{ border: '1px solid #000', borderTop: 'none', padding: 0 }}>
              <div style={{ flex: 3, padding: 5 }}>
                <b>For our everyday business purposes</b><br />
                – such as to process your transactions, maintain your account(s), respond to court orders and legal investigations, or report to credit bureaus
              </div>
              <div style={{ flex: 1, borderLeft: '1px solid #000', padding: 5 }}>Yes</div>
              <div style={{ flex: 1, borderLeft: '1px solid #000', padding: 5 }}>No</div>
            </div>
            <div className="d-flex" style={{ border: '1px solid #000', borderTop: 'none', padding: 0 }}>
              <div style={{ flex: 3, padding: 5 }}>
                <b>For our marketing purposes</b> - to offer<br />
                our products and services to you
              </div>
              <div style={{ flex: 1, borderLeft: '1px solid #000', padding: 5 }}>Yes</div>
              <div style={{ flex: 1, borderLeft: '1px solid #000', padding: 5 }}>No</div>
            </div>
            <div className="d-flex" style={{ border: '1px solid #000', borderTop: 'none', padding: 0 }}>
              <div style={{ flex: 3, padding: 5 }}>
                <b>For joint marketing with other financial companies</b>
              </div>
              <div style={{ flex: 1, borderLeft: '1px solid #000', padding: 5 }}>No</div>
              <div style={{ flex: 1, borderLeft: '1px solid #000', padding: 5 }}>We do not share</div>
            </div>
            <div className="d-flex" style={{ border: '1px solid #000', borderTop: 'none', padding: 0 }}>
              <div style={{ flex: 3, padding: 5 }}>
                <b>For our affiliates&#39; everyday business purposes –</b> information about your transactions and experiences
              </div>
              <div style={{ flex: 1, borderLeft: '1px solid #000', padding: 5 }}>No</div>
              <div style={{ flex: 1, borderLeft: '1px solid #000', padding: 5 }}>We do not share</div>
            </div>
            <div className="d-flex" style={{ border: '1px solid #000', borderTop: 'none', padding: 0 }}>
              <div style={{ flex: 3, padding: 5 }}>
                <b>For our affiliates&#39; everyday business purposes –</b> information about your creditworthiness
              </div>
              <div style={{ flex: 1, borderLeft: '1px solid #000', padding: 5 }}>No</div>
              <div style={{ flex: 1, borderLeft: '1px solid #000', padding: 5 }}>We do not share</div>
            </div>
            <div className="d-flex" style={{ border: '1px solid #000', borderTop: 'none', padding: 0 }}>
              <div style={{ flex: 3, padding: 5 }}>
                <b>For our affiliates to market to you</b>
              </div>
              <div style={{ flex: 1, borderLeft: '1px solid #000', padding: 5 }}>No</div>
              <div style={{ flex: 1, borderLeft: '1px solid #000', padding: 5 }}>We do not share</div>
            </div>
            <div className="d-flex" style={{ border: '1px solid #000', borderTop: 'none', padding: 0 }}>
              <div style={{ flex: 3, padding: 5 }}>
                <b>For nonaffiliates to market to you</b>
              </div>
              <div style={{ flex: 1, borderLeft: '1px solid #000', padding: 5 }}>No</div>
              <div style={{ flex: 1, borderLeft: '1px solid #000', padding: 5 }}>We do not share</div>
            </div>
            <div style={{ border: '1px solid #000', display: 'flex' }} className="mt-2">
              <div className="d-flex align-items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: 5, color: '#fff', minWidth: 150 }}>Questions?</div>
              <div className="d-flex align-items-center" style={{ padding: 5 }}>
                Call (888) 578-9546
              </div>
            </div>
            <div style={{ border: '1px solid #000' }} className="mt-2">
              <div className="d-flex align-items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: 5, color: '#fff' }}>Who we are</div>
              <div className="d-flex">
                <div className="d-flex align-items-center flex-grow:1" style={{ padding: 5 }}>
                  Who is providing this notice?
                </div>
                <div className="d-flex align-items-center flex-grow:1" style={{ padding: 5, borderLeft: '1px solid #000' }}>
                  First Electronic Bank
                </div>
              </div>
            </div>
            <div style={{ border: '1px solid #000' }} className="mt-2">
              <div className="d-flex align-items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: 5, color: '#fff' }}>What we do</div>
              <div className="d-flex">
                <div style={{ padding: 5, flex: 1 }}>
                  How does First Electronic Bank protect my personal information?
                </div>
                <div style={{ padding: 5, borderLeft: '1px solid #000', flex: 2 }}>
                  To protect your personal information from unauthorized access and use, we use security measures that comply with federal law. These measures include computer safeguards and secured files and buildings.
                </div>
              </div>
              <div className="d-flex" style={{ borderTop: '1px solid #000' }}>
                <div style={{ padding: 5, flex: 1 }}>
                  How does First Electronic Bank collect my personal information?
                </div>
                <div style={{ padding: 5, borderLeft: '1px solid #000', flex: 2 }}>
                  We collect your personal information, for example, when you:<br />
                  <ul className="mt-1">
                    <li>apply for a loan or open an account</li>
                    <li>give us your contact information or pay your bills</li>
                    <li>use your credit card</li>
                  </ul>
                  We also collect your personal information from others, such as credit bureaus, aﬃliates or other companies.
                </div>
              </div>
              <div className="d-flex" style={{ borderTop: '1px solid #000' }}>
                <div style={{ padding: 5, flex: 1 }}>
                  Why can&apos;t I limit all sharing?
                </div>
                <div style={{ padding: 5, borderLeft: '1px solid #000', flex: 2 }}>
                  Federal law gives you the right to limit only<br />
                  <ul className="mt-1">
                    <li>sharing for affiliates&apos; everyday business purposes – information about your creditworthiness</li>
                    <li>affiliates from using your information to market to you</li>
                    <li>sharing for nonaffiliates to market to you</li>
                  </ul>
                  State laws and individual companies may give you additional rights to limit sharing. See below for more on your rights under state law.
                </div>
              </div>
            </div>
            <div style={{ border: '1px solid #000' }} className="mt-2">
              <div className="d-flex align-items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: 5, color: '#fff' }}>Definitions</div>
              <div className="d-flex">
                <div style={{ padding: 5, flex: 1 }}>
                  Affiliates
                </div>
                <div style={{ padding: 5, borderLeft: '1px solid #000', flex: 2 }}>
                  Companies related by common ownership or control. They can be financial and nonfinancial companies.
                  <ul className="mt-1">
                    <li>First Electronic Bank does not share with our affiliates</li>
                  </ul>
                </div>
              </div>
              <div className="d-flex" style={{ borderTop: '1px solid #000' }}>
                <div style={{ padding: 5, flex: 1 }}>
                  Nonaffiliates
                </div>
                <div style={{ padding: 5, borderLeft: '1px solid #000', flex: 2 }}>
                  Companies not related by common ownership or control. They can be financial and nonfinancial companies.
                  <ul className="mt-1">
                    <li>First Electronic Bank does not share with nonaffiliates so they can market to you</li>
                  </ul>
                </div>
              </div>
              <div className="d-flex" style={{ borderTop: '1px solid #000' }}>
                <div style={{ padding: 5, flex: 1 }}>
                  Joint Marketing
                </div>
                <div style={{ padding: 5, borderLeft: '1px solid #000', flex: 2 }}>
                  A formal agreement between nonaﬃliated financial companies that together market financial products or services to you.
                  <ul className="mt-1">
                    <li>First Electronic Bank does not jointly market.</li>
                  </ul>
                </div>
              </div>
            </div>
            <div style={{ border: '1px solid #000' }}>
              <div className="d-flex align-items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: 5, color: '#fff' }}>Other important information</div>
              <div style={{ padding: 5, flex: 1 }}>
                <strong>For California Customers:</strong> We will limit our sharing of personal information about you with our affiliates to comply with all California privacy laws that apply to us.
                <br /><br />
                <strong>Vermont residents:</strong> We will not share your personal information with nonaffiliates for their marketing purposes without your consent. We will not share customer report information about you with our affiliates or with joint marketing partners, except with your consent or as otherwise permitted by law.
              </div>
            </div>
            <br /><br />
            Rev 0.001
          </Fragment>
        );
        break;
      default:
        break;
    }
    this.setState({
      isModalVisible: true,
      modalHeader,
      modalContent,
    });
  }

  handleModal = () => {
    this.setState(prevState => ({
      isModalVisible: !prevState.isModalVisible,
      modalHeader: '',
      modalContent: '',
    }));
  }

  render() {
    const { validator: { values, isValid } } = this.props;
    const { isModalVisible, modalHeader, modalContent, isLoading } = this.state;

    return (
      <div className="page-personify narrow">
        <Container className="consent-form">
          <Row>
            <Col className="text-center mb-2 mt-2">
              <h3>Please review the below and click &#34;Continue&#34; to apply with Personify</h3>
            </Col>
          </Row>
          <Row className="justify-content-between">
            <Col md={8}>
              <p>Personify Financial may use electronic signatures, communications, records, and may contact me in accordance with the <Button className="btn button-link" onClick={this.displayModal.bind(null, 'electronicDisclaimer')}>electronic communications</Button> section.</p>
            </Col>
            <Col md={2} className="text-right">
              <ButtonGroup className="w-100">
                <Button color="primary" onClick={() => this.onRadioBtnClick('electronicDisclaimer', !values.electronicDisclaimer)} active={values.electronicDisclaimer}>I Agree</Button>
              </ButtonGroup>
            </Col>
            <Col md={2} className="text-right" />
          </Row>
          <Row className="justify-content-between">
            <Col md={8}>
              <p>By accepting this agreement, I expressly consent and agree to Personify Financial, its affiliates, agents, service providers or any assignees to contact me, using verbal and written means, such as text, email, or other electronic messages, as described in the <Button className="btn button-link" onClick={this.displayModal.bind(null, 'telephoneContact')}>Telephone Contact</Button> section.</p>
            </Col>
            <Col md={2} className="text-right">
              <ButtonGroup className="w-100">
                <Button color="primary" onClick={() => this.onRadioBtnClick('telephoneContact', !values.telephoneContact)} active={values.telephoneContact}>I Agree</Button>
              </ButtonGroup>
            </Col>
            <Col md={2} className="text-right" />
          </Row>
          <Row className="justify-content-between">
            <Col md={8}>
              <p>Personify Financial may obtain and use my credit report in the connection with or as a result of extensions or credit related to my loan application, and for other legitimate purposes related to any loan made, in accordance with the <Button className="btn button-link" onClick={this.displayModal.bind(null, 'creditReportDisclaimer')}>credit report and verification</Button> section.</p>
            </Col>
            <Col md={2} className="text-right">
              <ButtonGroup className="w-100">
                <Button color="primary" onClick={() => this.onRadioBtnClick('creditReportDisclaimer', !values.creditReportDisclaimer)} active={values.creditReportDisclaimer}>I Agree</Button>
              </ButtonGroup>
            </Col>
            <Col md={2} className="text-right" />
          </Row>
          <Row className="justify-content-between">
            <Col md={8}>
              <p>I am not an active member of the military, a spouse, or a dependent of one, as defined by the <Button className="btn button-link" onClick={this.displayModal.bind(null, 'activeDutyMilitary')}>active duty military and dependents</Button> section.</p>
            </Col>
            <Col md={4} className="text-right">
              <ButtonGroup className="w-100">
                <Button color="primary" onClick={() => this.onRadioBtnClick('activeDutyMilitary', true)} active={values.activeDutyMilitary} style={{ zIndex: 10 }}>I Agree</Button>
                <Button color="disagree" onClick={() => this.onRadioBtnClick('activeDutyMilitary', false)} active={values.activeDutyMilitary === false}>I Disagree</Button>
              </ButtonGroup>
            </Col>
          </Row>
          <Row className="justify-content-between">
            <Col md={8}>
              <p>I have received delivery of and reviewed the <Button className="btn button-link" onClick={this.displayModal.bind(null, 'privacyPolicyDisclaimer')}>privacy policy</Button>.</p>
            </Col>
            <Col md={2} className="text-right">
              <ButtonGroup className="w-100">
                <Button color="primary" onClick={() => this.onRadioBtnClick('privacyPolicyDisclaimer', !values.privacyPolicyDisclaimer)} active={values.privacyPolicyDisclaimer}>I Agree</Button>
              </ButtonGroup>
            </Col>
            <Col md={2} className="text-right" />
          </Row>
          <Row className="justify-content-between">
            <Col md={8}>
              <p>By providing your phone number(s) to us, you are expressly consenting to receiving communications, including, but not limited to, prerecorded or artificial voice message calls, text messages, and calls made by an automatic telephone dialing system, from your lender, or any of its affiliates, service providers, assignees, or agents, at the phone number(s) you provided for servicing and collection purposes related to any loan that you may obtain from the lender.</p>
            </Col>
            <Col md={2} className="text-right">
              <ButtonGroup className="w-100">
                <Button color="primary" onClick={() => this.onRadioBtnClick('tcpaDisclosure', !values.tcpaDisclosure)} active={values.tcpaDisclosure}>I Agree</Button>
              </ButtonGroup>
            </Col>
            <Col md={2} className="text-right" />
          </Row>
          <div className="text-center align-item-center">
            <div><b>Seeing your offers won&#39;t hurt your FICO® Score&dagger;</b></div>
            <Button
              color="personify"
              size="lg"
              className="mb-2 mt-1 btn-custom"
              onClick={this.handleClickContinue}
              disabled={!isValid || isLoading}
              isLoading={isLoading}
            >
              Continue to next step
            </Button>
            <div className="mt-2">&dagger;We may perform a &quot;soft&quot; inquiry to show you available offers for which you may be qualified. Soft inquiries do not affect your FICO Score. If you choose to submit an application for credit, we will perform &quot;hard&quot; inquiries which may affect your credit score.</div>
          </div>
        </Container>

        <Modal isOpen={isModalVisible} toggle={this.handleModal} size="lg" className="modal-personify">
          <ModalHeader toggle={this.handleModal}>{modalHeader}</ModalHeader>
          <ModalBody className="pt-3 pb-4" style={{ maxHeight: 600, overflowY: 'auto', fontSize: 12 }}>
            {modalContent}
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

PersonifyConsent.propTypes = {
  nextAction: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  workflow: PropTypes.object.isRequired,
  validator: PropTypes.object.isRequired,
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
)(PersonifyConsent);
