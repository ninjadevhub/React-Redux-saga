import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import dateFns from 'date-fns';
import cn from 'classnames';
import emailMask from 'text-mask-addons/dist/emailMask';
import faker from 'faker';

import Validator from 'components/Validator/Validator';
import PageContent from 'components/Template/PageContent';
import Title from 'components/Title';
import { Header } from 'components/Header';
import Heading from 'components/Heading';
import Footer from 'components/Footer';
import FormGroup from 'components/Form/FormGroup';
import FormGroupLabel from 'components/FormGroupLabel';
import Input from 'components/Form/Input';
import Select from 'components/Form/Select';
import Checkbox from 'components/Form/Checkbox';
import { Button } from 'components/Button';
import SecurityLock from 'components/Icons/SecurityLock';
import CirclePhone from 'components/Icons/CirclePhone';
import CircleMessage from 'components/Icons/CircleMessage';
// import fetch from 'components/Fetch';

import {
  checkinAction,
} from 'actions/workflow';

import digicert from 'assets/images/digicert.png';
import schema from './schema';
import style from './style.scss';

class MerchantApply extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSubmitted: false,
      // eslint-disable-next-line
      response: {},
    };
  }

  componentWillMount() {
    const { validator: { setValues } } = this.props;
    const initialFormData = {
      channel: {
        code: 'dtm',
        name: null,
        program: null,
        attributes: {},
      },
      status: {
        code: 1000,
        name: 'Initiated',
        label: 'Initiated',
      },
      submittedDate: this.getCurrentDate(),
      trainingCompleted: false,
      businessLicences: [],
    };
    setValues(initialFormData);
  }

  getCurrentDate = () => dateFns.format(new Date(), 'MM/DD/YYYY');

  handleSubmitFrom = (data, e) => {
    e.preventDefault();
    const { validator: { validate } } = this.props;
    if (validate(schema).isValid) {
      const formData = {
        ...data,
        channel: {
          code: 'dtm',
          name: null,
          program: null,
          attributes: {},
        },
        businessAddresses: [{
          ...data.businessAddresses,
          country: 'USA',
          isPrimary: true,
        }],
        contacts: [{
          ...data.contacts,
        }],
        principalOwner: {
          ...data.principalOwner,
          address: {
            ...data.principalOwner.address,
            country: 'USA',
          },
        },
      };

      this.props.checkinAction({
        data: formData,
        url: '/workflows/merchant/workflow/merchant-agreement/start',
        success: (response) => {
          // eslint-disable-next-line
          const { history } = this.props;
          this.setState({
            isSubmitted: true,
            // eslint-disable-next-line
            response: response,
          });
          this.props.history.push('/dashboard/congrats');
        },
        fail: (error) => {
          console.log(error);
        },
      });
    } else {
      console.log('api error');
    }
  };

  handleInputChange = (event) => {
    const { validator: { onChangeHandler } } = this.props;
    onChangeHandler(event.target.name, event.target.value);
  };

  handleCheckboxChange = (name, value) => {
    const { validator: { onChangeHandler } } = this.props;
    onChangeHandler(name, value);
  };

  handleSetValues = (e) => {
    e.preventDefault();
    const { validator: { setValues } } = this.props;
    const { firstName, lastName } = {
      firstName: faker.name.lastName(),
      lastName: faker.name.firstName(),
    };

    const formValues = {
      businessName: `${lastName} ${faker.company.companyName()}`.toUpperCase(),
      dba: 'CLASSIC DENTAL ARTS',
      businessAddresses: {
        streetNumber: '123',
        streetName: 'street name',
        address2: '17 CREST CIRCLE DR',
        city: 'Los Angeles',
        state: 'alabama',
        zipCode: '91344',
        country: 'USA',
        type: 'audiology',
      },
      federalTaxIdOrSSN: '766-66-6666',
      productsOrServices: '450',
      status: {
        code: 1000,
        name: 'Initiated',
        label: 'Initiated',
      },
      principalOwner: {
        firstName,
        lastName,
        address: {
          streetNumber: '123',
          streetName: 'street name',
          address2: '17 CREST CIRCLE DR',
          city: 'MILLSTONE TOWNSHIP',
          state: 'new-jersey',
          zipCode: '08510',
          country: 'USA',
          type: 'audiology',
          isPrimary: true,
        },
        dateOfBirth: '01/01/2018',
      },
      contacts: {
        firstName,
        lastName,
        title: 'PRESIDENT',
        phoneNumber: '(122) 222-2222',
        phoneExt: '(234) 232-3233',
        isPrimary: true,
        email: 'SPIROS.KARAS+108@lendingusa.com',
        dateOfBirth: '01/01/2018',
      },
      termsAndConditions: true,
      signatureBy: {
        name: 'John',
      },
      submittedBy: {
        title: 'John',
      },
      trainingCompleted: false,
      submittedDate: '3/28/2018',
    };
    setValues(formValues);
  }

  render() {
    const { className, validator: { values, errors } } = this.props;
    const { isSubmitted } = this.state;

    return (
      <form className={cn(style.App, className)} onSubmit={this.handleSubmitFrom.bind(null, values)}>
        <Header />
        <Button
          className={cn('button small w-50', style.button)}
          onClick={this.handleSetValues}
        >
          Set values
        </Button>
        <section className="container section">
          <div className="grid-container fluid merchants-apply">
            <div className="grid-container">
              <div className="grid-x grid-margin-x max-limited">
                {
                isSubmitted ?
                  <PageContent>
                    <Title>Your application has been successfully applied!</Title>
                  </PageContent>
                :
                  <Fragment>
                    <Heading
                      heading="Merchant Enrollment Application"
                      subHeading="Please complete the following form to get started. Once completed you will have access to our online provider portal."
                    />

                    <div className="cell small-12 medium-12 large-8 main-column">
                      <FormGroup className="form-group">
                        <FormGroupLabel value="Business Information" />
                        <div className="grid-x grid-margin-x">
                          <div className="cell small-12 medium-6">
                            <Input
                              label="Legal Business Name"
                              name="businessName"
                              value={values.businessName}
                              onChange={this.handleInputChange}
                              isRequired
                              hasError={!!errors.businessName}
                            />
                          </div>
                          <div className="cell small-12 medium-6">
                            <Input
                              label="D.B.A."
                              name="dba"
                              value={values.dba}
                              onChange={this.handleInputChange}
                              hasError={!!errors.dba}
                              isRequired
                            />
                          </div>
                          <div className="cell small-12 medium-12">
                            <Input
                              label="Street Address"
                              name="businessAddresses.address2"
                              value={values.businessAddresses && values.businessAddresses.address2}
                              onChange={this.handleInputChange}
                              isRequired
                              hasError={!!errors['businessAddresses.address2']}
                            />
                          </div>
                          <div className="cell small-12 medium-6">
                            <Input
                              label="City"
                              name="businessAddresses.city"
                              value={values.businessAddresses && values.businessAddresses.city}
                              onChange={this.handleInputChange}
                              isRequired
                              hasError={!!errors['businessAddresses.city']}
                            />
                          </div>
                          <div className="cell small-12 medium-6">
                            <div className="grid-x grid-margin-x">
                              <div className="cell small-8">
                                <Select
                                  name="businessAddresses.state"
                                  data={[
                                    { value: 'alabama', title: 'Alabama' },
                                    { value: 'alaska', title: 'Alaska' },
                                    { value: 'arizona', title: 'Arizona' },
                                    { value: 'arkansas', title: 'Arkansas' },
                                    { value: 'california', title: 'California' },
                                    { value: 'colorado', title: 'Colorado' },
                                    { value: 'connecticut', title: 'Connecticut' },
                                    { value: 'delaware', title: 'Delaware' },
                                    { value: 'district-of-columbia', title: 'District of Columbia' },
                                    { value: 'florida', title: 'Florida' },
                                    { value: 'georgia', title: 'Georgia' },
                                    { value: 'hawaii', title: 'Hawaii' },
                                    { value: 'idaho', title: 'Idaho' },
                                    { value: 'illinois', title: 'Illinois' },
                                    { value: 'indiana', title: 'Indiana' },
                                    { value: 'iowa', title: 'Iowa' },
                                    { value: 'kansas', title: 'Kansas' },
                                    { value: 'kentucky', title: 'Kentucky' },
                                    { value: 'louisiana', title: 'Louisiana' },
                                    { value: 'maine', title: 'Maine' },
                                    { value: 'maryland', title: 'Maryland' },
                                    { value: 'massachusetts', title: 'Massachusetts' },
                                    { value: 'michigan', title: 'Michigan' },
                                    { value: 'minnesota', title: 'Minnesota' },
                                    { value: 'mississippi', title: 'Mississippi' },
                                    { value: 'missouri', title: 'Missouri' },
                                    { value: 'montana', title: 'Montana' },
                                    { value: 'nebraska', title: 'Nebraska' },
                                    { value: 'nevada', title: 'Nevada' },
                                    { value: 'new-hampshire', title: 'New Hampshire' },
                                    { value: 'new-jersey', title: 'New Jersey' },
                                    { value: 'new-mexico', title: 'New Mexico' },
                                    { value: 'new-york', title: 'New York' },
                                    { value: 'north-carolina', title: 'North Carolina' },
                                    { value: 'north-dakota', title: 'North Dakota' },
                                    { value: 'ohio', title: 'Ohio' },
                                    { value: 'oklahoma', title: 'Oklahoma' },
                                    { value: 'oregon', title: 'Oregon' },
                                    { value: 'pennsylvania', title: 'Pennsylvania' },
                                    { value: 'rhode-island', title: 'Rhode Island' },
                                    { value: 'south-carolina', title: 'South Carolina' },
                                    { value: 'south-dakota', title: 'South Dakota' },
                                    { value: 'tennessee', title: 'Tennessee' },
                                    { value: 'texas', title: 'Texas' },
                                    { value: 'utah', title: 'Utah' },
                                    { value: 'vermont', title: 'Vermont' },
                                    { value: 'virginia', title: 'Virginia' },
                                    { value: 'washington', title: 'Washington' },
                                    { value: 'west-virginia', title: 'West Virginia' },
                                    { value: 'wisconsin', title: 'Wisconsin' },
                                    { value: 'wyoming', title: 'Wyoming' },
                                  ]}
                                  value={values.businessAddresses && values.businessAddresses.state}
                                  onChange={this.handleInputChange}
                                  label="State"
                                  isRequired
                                  hasError={!!errors['businessAddresses.state']}
                                />
                              </div>
                              <div className="cell small-4">
                                <Input
                                  label="Zip"
                                  isMasked={[/\d/, /\d/, /\d/, /\d/, /\d/]}
                                  name="businessAddresses.zipCode"
                                  placeHolder="_____"
                                  value={values.businessAddresses && values.businessAddresses.zipCode}
                                  onChange={this.handleInputChange}
                                  isRequired
                                  hasError={!!errors['businessAddresses.zipCode']}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="cell small-12 medium-6">
                            <Select
                              name="businessAddresses.type"
                              data={[
                                { value: 'audiology', title: 'Audiology' },
                                { value: 'cosmetic', title: 'Cosmetic' },
                                { value: 'general-healthcare', title: 'General Healthcare' },
                              ]}
                              value={values.businessAddresses && values.businessAddresses.type}
                              onChange={this.handleInputChange}
                              label="Business Product/Service Type"
                              isRequired
                              hasError={!!errors['businessAddresses.type']}
                            />
                          </div>
                          <div className="cell small-12 medium-6">
                            <Input
                              label="Products/Services Sold"
                              name="productsOrServices"
                              value={values.productsOrServices}
                              onChange={this.handleInputChange}
                              isRequired
                              hasError={!!errors.productsOrServices}
                            />
                          </div>
                          <div className="cell small-12 medium-6">
                            <Input
                              label="Federal Tax ID# Or SSN#"
                              name="federalTaxIdOrSSN"
                              // eslint-disable-next-line
                              isMasked={[/\d/,/\d/,/\d/, '-', /\d/,/\d/, '-',/\d/,/\d/,/\d/,/\d/]}
                              placeHolder="___-__-____"
                              value={values.federalTaxIdOrSSN}
                              onChange={this.handleInputChange}
                              isRequired
                              hasError={!!errors.federalTaxIdOrSSN}
                            />
                          </div>
                        </div>
                      </FormGroup>

                      <FormGroup className="form-group">
                        <FormGroupLabel value="Contact Information" />
                        <p>Approval and application status will be sent to the following.</p>
                        <div className="grid-x grid-margin-x">
                          <div className="cell small-12 medium-6 large-4">
                            <Input
                              label="First Name"
                              name="contacts.firstName"
                              value={values.contacts && values.contacts.firstName}
                              onChange={this.handleInputChange}
                              isRequired
                              hasError={!!errors.firstName}
                            />
                          </div>
                          <div className="cell small-12 medium-6 large-4">
                            <Input
                              label="Last Name"
                              name="contacts.lastName"
                              value={values.contacts && values.contacts.lastName}
                              onChange={this.handleInputChange}
                              isRequired
                              hasError={!!errors['contacts.lastName']}
                            />
                          </div>
                          <div className="cell small-12 medium-6 large-4">
                            <Input
                              label="Title/Position"
                              name="contacts.title"
                              value={values.contacts && values.contacts.title}
                              onChange={this.handleInputChange}
                              isRequired
                              hasError={!!errors['contacts.title']}
                            />
                          </div>
                          <div className="cell small-12 medium-6 large-4">
                            <Input
                              label="Email Address"
                              name="contacts.email"
                              isMasked={emailMask}
                              placeHolder="Email address"
                              value={values.contacts && values.contacts.email}
                              onChange={this.handleInputChange}
                              isRequired
                              hasError={!!errors['contacts.email']}
                            />
                          </div>
                          <div className="cell small-12 medium-6 large-4">
                            <Input
                              label="Main Office Phone #"
                              isMasked={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                              placeHolder="(___) ___-____"
                              name="contacts.phoneNumber"
                              value={values.contacts && values.contacts.phoneNumber}
                              onChange={this.handleInputChange}
                              isRequired
                              hasError={!!errors['contacts.phoneNumber']}
                            />
                          </div>
                          <div className="cell small-12 medium-6 large-4">
                            <Input
                              label="Fax Number"
                              isMasked={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                              placeHolder="(___) ___-____"
                              name="contacts.phoneExt"
                              value={values.contacts && values.contacts.phoneExt}
                              onChange={this.handleInputChange}
                              isRequired
                              hasError={!!errors['contacts.phoneExt']}
                            />
                          </div>
                        </div>
                      </FormGroup>

                      <FormGroup className="form-group">
                        <FormGroupLabel value="Owner Information" />
                        <div className="grid-x grid-margin-x">
                          <div className="cell small-12 medium-6">
                            <Input
                              label="Owner First Name"
                              name="principalOwner.firstName"
                              value={values.principalOwner && values.principalOwner.firstName}
                              onChange={this.handleInputChange}
                              isRequired
                              hasError={!!errors['principalOwner.firstName']}
                            />
                          </div>
                          <div className="cell small-12 medium-6">
                            <Input
                              label="Owner Last Name"
                              name="principalOwner.lastName"
                              value={values.principalOwner && values.principalOwner.lastName}
                              onChange={this.handleInputChange}
                              isRequired
                              hasError={!!errors['principalOwner.lastName']}
                            />
                          </div>
                          <div className="cell small-12 medium-6">
                            <Input
                              label="Street Address"
                              name="principalOwner.address.address2"
                              value={values.principalOwner && values.principalOwner.address && values.principalOwner.address.address2}
                              onChange={this.handleInputChange}
                              isRequired
                              hasError={!!errors['principalOwner.address.address2']}
                            />
                          </div>
                          <div className="cell small-12 medium-6">
                            <Input
                              label="City"
                              name="principalOwner.address.city"
                              value={values.principalOwner && values.principalOwner.address && values.principalOwner.address.city}
                              onChange={this.handleInputChange}
                              isRequired
                              hasError={!!errors['principalOwner.address.city']}
                            />
                          </div>
                          <div className="cell small-12 medium-6">
                            <div className="grid-x grid-margin-x">
                              <div className="cell small-8">
                                <Select
                                  name="principalOwner.address.state"
                                  data={[
                                    { value: 'alabama', title: 'Alabama' },
                                    { value: 'alaska', title: 'Alaska' },
                                    { value: 'arizona', title: 'Arizona' },
                                    { value: 'arkansas', title: 'Arkansas' },
                                    { value: 'california', title: 'California' },
                                    { value: 'colorado', title: 'Colorado' },
                                    { value: 'connecticut', title: 'Connecticut' },
                                    { value: 'delaware', title: 'Delaware' },
                                    { value: 'district-of-columbia', title: 'District of Columbia' },
                                    { value: 'florida', title: 'Florida' },
                                    { value: 'georgia', title: 'Georgia' },
                                    { value: 'hawaii', title: 'Hawaii' },
                                    { value: 'idaho', title: 'Idaho' },
                                    { value: 'illinois', title: 'Illinois' },
                                    { value: 'indiana', title: 'Indiana' },
                                    { value: 'iowa', title: 'Iowa' },
                                    { value: 'kansas', title: 'Kansas' },
                                    { value: 'kentucky', title: 'Kentucky' },
                                    { value: 'louisiana', title: 'Louisiana' },
                                    { value: 'maine', title: 'Maine' },
                                    { value: 'maryland', title: 'Maryland' },
                                    { value: 'massachusetts', title: 'Massachusetts' },
                                    { value: 'michigan', title: 'Michigan' },
                                    { value: 'minnesota', title: 'Minnesota' },
                                    { value: 'mississippi', title: 'Mississippi' },
                                    { value: 'missouri', title: 'Missouri' },
                                    { value: 'montana', title: 'Montana' },
                                    { value: 'nebraska', title: 'Nebraska' },
                                    { value: 'nevada', title: 'Nevada' },
                                    { value: 'new-hampshire', title: 'New Hampshire' },
                                    { value: 'new-jersey', title: 'New Jersey' },
                                    { value: 'new-mexico', title: 'New Mexico' },
                                    { value: 'new-york', title: 'New York' },
                                    { value: 'north-carolina', title: 'North Carolina' },
                                    { value: 'north-dakota', title: 'North Dakota' },
                                    { value: 'ohio', title: 'Ohio' },
                                    { value: 'oklahoma', title: 'Oklahoma' },
                                    { value: 'oregon', title: 'Oregon' },
                                    { value: 'pennsylvania', title: 'Pennsylvania' },
                                    { value: 'rhode-island', title: 'Rhode Island' },
                                    { value: 'south-carolina', title: 'South Carolina' },
                                    { value: 'south-dakota', title: 'South Dakota' },
                                    { value: 'tennessee', title: 'Tennessee' },
                                    { value: 'texas', title: 'Texas' },
                                    { value: 'utah', title: 'Utah' },
                                    { value: 'vermont', title: 'Vermont' },
                                    { value: 'virginia', title: 'Virginia' },
                                    { value: 'washington', title: 'Washington' },
                                    { value: 'west-virginia', title: 'West Virginia' },
                                    { value: 'wisconsin', title: 'Wisconsin' },
                                    { value: 'wyoming', title: 'Wyoming' },
                                  ]}
                                  value={values.principalOwner && values.principalOwner.address && values.principalOwner.address.state}
                                  onChange={this.handleInputChange}
                                  label="State"
                                  isRequired
                                  hasError={!!errors['principalOwner.address.state']}
                                />
                              </div>
                              <div className="cell small-4">
                                <Input
                                  label="Zip"
                                  name="principalOwner.address.zipCode"
                                  isMasked={[/\d/, /\d/, /\d/, /\d/, /\d/]}
                                  placeHolder="_____"
                                  value={values.principalOwner && values.principalOwner.address && values.principalOwner.address.zipCode}
                                  onChange={this.handleInputChange}
                                  isRequired
                                  hasError={!!errors['principalOwner.address.zipCode']}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </FormGroup>

                      {/* <FormGroup className="form-group">
                        <h4>Create Your LendingUSA Login</h4>
                        <div className="grid-x grid-margin-x">
                          <div className="cell small-12 medium-6">
                            <Input
                              label="Username"
                              name="username"
                              isMasked={emailMask}
                              placeHolder="Email address"
                              value={values.username}
                              onChange={this.handleInputChange}
                              isRequired
                              hasError={!!errors.username}
                            />
                          </div>
                          <div className="cell small-12 medium-6">
                            <Input
                              label="Password"
                              name="password"
                              value={values.password}
                              onChange={this.handleInputChange}
                              type="password"
                              isRequired
                              hasError={!!errors.password}
                            />
                            <small>8 characters or more, 1 special symbol or one digit</small>
                          </div>
                        </div>
                      </FormGroup> */}

                      <div className="form-group">
                        <h4>Your Signature</h4>
                        <div className="grid-x grid-margin-x">
                          <div className="cell small-12">
                            <textarea rows="3" placeholder="None" readOnly defaultValue="Electronic Signature Agreement. By selecting the “Submit Application” button, you are signing this Agreement electronically. You agree your electronic signature is the legal equivalent of your manual signature on this Agreement. By selecting &quot;I Accept&quot; you consent to be legally bound by this Agreement&apos;s terms and conditions. You further agree that your use of a key pad, mouse or other device to select an item, button, icon or similar act/action, or to otherwise provide LendingUSA.com, or in accessing or making any transaction regarding any agreement, acknowledgement, consent terms, disclosures or conditions constitutes your signature (hereafter referred to as &quot;E-Signature&quot;), acceptance and agreement as if actually signed by you in writing. You also agree that no certification authority or other third party verification is necessary to validate your E-Signature and that the lack of such certification or third party verification will not in any way affect the enforceability of your E-Signature or any resulting contract between you and LendingUSA.com. You also represent that you are authorized to enter into this Agreement for all persons who own or are authorized to access any of your accounts and that such persons will be bound by the terms of this Agreement. You further agree that each use of your E-Signature in obtaining a LendingUSA.com service constitutes your agreement to be bound by the terms and conditions of the LendingUSA.com Disclosures and Agreements as they exist on the date of your E-Signature." />
                          </div>
                          <div className="cell small-12 checkbox-row padded-bottom">
                            <Checkbox
                              label={['Check here to agree to ', <a href="/terms-of-use/">Terms of Use Agreement</a>, ', ', <a href="/privacy-policy/">Policy</a>, ', ', <a href="fef">Platform Access &amp; Use Agreement</a>, ', ', <a href="fdf">Operating Procedures</a>, ' and digitally sign this form.']}
                              name="termsAndConditions"
                              onChange={this.handleCheckboxChange.bind(null, 'termsAndConditions')}
                              isChecked={values.termsAndConditions}
                              id="termsAndConditions"
                              errorMessage={errors.termsAndConditions}
                            />
                          </div>
                          <div className="cell small-12 medium-5 padded-top">
                            <Input
                              label="Owner&apos;s E-Signature"
                              name="signatureBy.name"
                              value={values.signatureBy && values.signatureBy.name}
                              onChange={this.handleInputChange}
                              isRequired
                              hasError={!!errors['signatureBy.name']}
                            />
                          </div>
                          <div className="cell small-8 medium-4 padded-top">
                            <Input
                              label="Title"
                              name="submittedBy.title"
                              value={values.submittedBy && values.submittedBy.title}
                              onChange={this.handleInputChange}
                              isRequired
                              hasError={!!errors['submittedBy.title']}
                            />
                          </div>
                          <div className="cell small-4 medium-3 padded-top">
                            <Input
                              name="submittedDate"
                              value={values.submittedDate}
                              label="Date"
                              className="current-date"
                              isDisabled
                            />
                          </div>
                          <div className="cell small-12 padded-top">
                            <Button
                              className={cn('button large arrow green w-100', style.button)}
                              onClick={this.handleSubmitFrom.bind(null, values)}
                            >Submit Application
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Fragment>
                }

                {/* <!-- Merchanys Apply Sidebar --> */}
                <div id="Sidebar" className="cell small-12 large-4 sidebar-apply show-for-large" data-sticky-container>
                  <div className="sticky" data-sticky data-top-anchor="Sidebar" data-btm-anchor="Footer" data-margin-top="7.5">
                    <div className="card">
                      <div className="card-section">
                        <h5>Need Help?</h5>
                        <ul className={cn('sidebar-help', style['sidebar-help'])}>
                          <li>
                            <a href="tel:18009946177">
                              <CirclePhone className={style.icon} />
                              800-994-6177
                            </a>
                          </li>
                          <li>
                            <a href="/contact/">
                              <CircleMessage className={style.icon} />
                              Message Us
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div className="card-section sidebar-testimonials">
                        <h5>Testimonials</h5>
                        <p className="p-small">&quot;Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.&quot;</p>
                        <small>–  Jamie S, Los Angeles</small>
                      </div>
                    </div>

                    <div className="grid-x security">
                      <div className={cn('cell small-9 ssl', style.encryption)}>
                        <SecurityLock width="28" className={style.securityLock} />
                        <p className={cn('p-small', style.noBottomMargin)}><strong>128-bit SSL</strong> protection and strict encryption</p>
                      </div>
                      <div className="cell small-3 certificate">
                        <img src={digicert} alt="" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* <!-- End Merchanys Apply Sidebar --> */}

              </div>
            </div>
          </div>
        </section>
        <Footer />
      </form>
    );
  }
}

MerchantApply.propTypes = {
  className: PropTypes.string,
  validator: PropTypes.object.isRequired,
  checkinAction: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

MerchantApply.defaultProps = {
  className: '',
};

export default compose(
  Validator(schema),
  connect(
    null,
    {
      checkinAction,
    }
  )
)(MerchantApply);
