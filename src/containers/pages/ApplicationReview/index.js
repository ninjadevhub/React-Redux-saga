import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { format } from 'date-fns';
import { map, findIndex, get } from 'lodash';
import {
  Col,
  Container,
  FormGroup,
  Row,
} from 'reactstrap';

import LargeDataTable from 'components/Tables/LargeDataTable';
import Input from 'components/Form/Input';
import Select from 'components/Form/Select';

import {
  getApplications,
} from 'actions/application';
import { appConfig } from 'config/appConfig';
import { formatCurrency } from 'utils/formatCurrency';

// eslint-disable-next-line
const initialFilter = {
  applicationId: '',
  applicationName: '',
  applicationDate: '',
  lender: '',
  status: '',
  requestedAmount: '',
  purpose: '',
  merchant: '',
  assignedId: '',
  query: '',
  offset: 0,
  limit: appConfig.limit,
};

class ApplicationReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { name: 'applicationId', title: 'Application ID', type: 'link', width: 130, isFilterVisible: true },
        { name: 'applicantName', title: 'Applicant', type: 'name', isFilterVisible: true },
        { name: 'applicationDate', title: 'Submitted', type: 'date', width: 135, isFilterVisible: false },
        { name: 'lenderLabel', title: 'Lender', type: 'text', width: 150, isFilterVisible: false },
        { name: 'statusLabel', title: 'Status', type: 'status', width: 150, isFilterVisible: false },
        { name: 'approvalAmount', title: 'Approval Amt', type: 'text', width: 150, isFilterVisible: false },
        { name: 'amountFinanced', title: 'Amt Financed', type: 'text', width: 150, isFilterVisible: false },
        { name: 'payoutPercentage', title: 'Payout %', type: 'text', width: 120, isFilterVisible: false },
        { name: 'payoutAmount', title: 'Payout Amt', type: 'text', width: 150, isFilterVisible: false },
        { name: 'fundedDate', title: 'Funded Date', type: 'date', width: 150, isFilterVisible: false },
        { name: 'interestRate', title: 'Int Rate', type: 'text', width: 110, isFilterVisible: false },
        { name: 'monthlyPayment', title: 'Monthly Payment', type: 'text', width: 150, isFilterVisible: false },
      ],
      loading: true,
      rowCount: 1,
      rows: [],
      tableKey: 'filterTable_default',
      selectedValue: null,
      searchValue: props.match.params.searchQuery,
      query: {
        sortBy: 'applicationDate',
        sortOrder: 'desc',
      },
      filterObj: {
        applicationId: '',
        applicationName: '',
        applicationDate: '',
        lender: '',
        status: '',
        requestedAmount: '',
        purpose: '',
        merchant: '',
        assignedId: '',
        query: '',
        offset: 0,
        limit: appConfig.limit,
      },
    };
    this.filters = JSON.parse(localStorage.getItem('filters'));
  }

  componentWillMount() {
    const selectedValueIndex = findIndex(get(this.filters, '0.filters'), item => item.name === this.props.match.params.statusCode);
    this.setState({
      selectedValue: JSON.stringify(get(get(this.filters, '0.filters'), `${selectedValueIndex}`)),
    });
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeydown, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeydown, false);
  }

  getParameter = (selectedValue, filterObj, searchValue, query = {}) => {
    const selectedQuery = get(selectedValue, 'attributes.query');
    const newQuery = { ...selectedQuery, ...query };
    const urlEncode = (obj) => {
      Object.keys(obj).forEach((key) => {
        const str = (typeof obj[key] === 'object') ? JSON.stringify(obj[key]) : obj[key];
        // eslint-disable-next-line no-param-reassign
        obj[key] = encodeURIComponent(str);
      });
      return obj;
    };
    const ret = {
      filterObj,
      search: searchValue,
      query: urlEncode(newQuery),
    };
    return ret;
  }

  // eslint-disable-next-line
  getApplications({
    filterObj = initialFilter,
    search = '',
    query = { sortBy: 'applicationDate', sortOrder: 'desc' },
  }) {
    const filters = [];
    filters[0] = (filterObj.applicationId !== '') ? `ApplicationId=${filterObj.applicationId}&` : '';
    filters[1] = (filterObj.applicationName !== '') ? `ApplicantName=${filterObj.applicationName}&` : '';
    filters[2] = (filterObj.applicationDate !== '') ? `ApplicationDate=${filterObj.applicationDate}&` : '';
    filters[3] = (filterObj.lenderLabel !== '') ? `LenderLabel=${filterObj.lenderLabel}&` : '';
    filters[4] = (filterObj.status !== '') ? `StatusLabel=${filterObj.status}&` : '';
    filters[5] = (filterObj.approvalAmount !== '') ? `ApprovalAmount=${filterObj.approvalAmount}&` : '';
    filters[6] = (filterObj.amountFinanced !== '') ? `AmountFinanced=${filterObj.amountFinanced}&` : '';
    filters[7] = (filterObj.payoutPercentage !== '') ? `PayoutPercentage=${filterObj.payoutPercentage}&` : '';
    filters[8] = (filterObj.payoutAmount !== '') ? `PayoutAmount=${filterObj.payoutAmount}&` : '';
    filters[9] = (filterObj.fundedDate !== '') ? `FundedDate=${filterObj.fundedDate}&` : '';
    filters[10] = (filterObj.interestRate !== '') ? `InterestRate=${filterObj.interestRate}&` : '';
    filters[11] = (filterObj.monthlyPayment !== '') ? `MonthlyPayment=${filterObj.monthlyPayment}&` : '';
    filters[12] = localStorage.getItem('merchantId') ? `merchantId=${localStorage.getItem('merchantId')}&` : `merchantId=${null}`;
    filters[13] = query !== '' ? `${map(query, (value, key) => `${key}=${value}`).join('&')}&` : '';
    let terms = '';
    if (search !== '') { terms = `Terms=${search}&`; }
    const url = `/applications-view/search?${filters.join('')}${terms}offset=${filterObj.offset}&limit=${filterObj.limit}&fields=data.lenderLabel,data.lenderStatusLabel,data.lenderStatusCode,data.applicationId,data.applicantName,data.applicationDate,data.statusAliases.merchantPortal,data.statusCode.merchantPortal,data.approvalAmount,data.amountFinanced,data.payoutPercentage,data.payoutAmount,data.interestRate,data.monthlyPayment,data.merchantId,data.fundedDate,pagination.*`;

    this.setState({ loading: true });
    this.props.getApplications({
      url,
      success: (res) => {
        const rows = res.data.map((item) => {
          const { applicationId, applicantName, applicationDate, statusAliases, statusCode, approvalAmount, amountFinanced, payoutPercentage, fundedDate, interestRate, payoutAmount, monthlyPayment, lenderLabel, lenderStatusLabel, lenderStatusCode } = item;

          return {
            applicationId,
            applicantName,
            applicationDate: applicationDate ? format(new Date(applicationDate).toISOString(), 'M/DD/YYYY') : '-',
            lenderLabel: lenderLabel || 'LUSA',
            statusLabel: (lenderLabel || 'LUSA').toLowerCase() === 'personify' ? (lenderStatusLabel || statusAliases.merchantPortal) : (statusAliases.merchantPortal || ''),
            approvalAmount: approvalAmount ? `$${formatCurrency(approvalAmount, 2)}` : '-',
            amountFinanced: amountFinanced ? `$${formatCurrency(amountFinanced, 2)}` : '-',
            payoutPercentage: payoutPercentage ? `${formatCurrency(payoutPercentage, 2)}%` : '-',
            payoutAmount: payoutAmount ? `$${formatCurrency(payoutAmount, 2)}` : '-',
            fundedDate: fundedDate ? format(new Date(fundedDate).toISOString(), 'M/DD/YYYY') : '-',
            interestRate: interestRate ? `${interestRate}%` : '-',
            monthlyPayment: monthlyPayment ? `$${formatCurrency(monthlyPayment, 2)}` : '-',
            statusCode: (lenderLabel || 'LUSA').toLowerCase() === 'personify' ? lenderStatusCode : statusCode,
            item,
          };
        });

        this.setState({
          rows,
          rowCount: res.pagination.total,
          loading: false,
        });
      },
      fail: (err) => {
        this.setState({ loading: false });

        if (err.response) {
          this.notificationSystem.addNotification({
            message: err.response.data.message,
            level: 'error',
            position: 'tc',
          });
        } else {
          console.log('Error', err);
        }
      },
    });
  }

  filterHandler = (queries) => {
    const { query, searchValue, selectedValue } = this.state;
    const filterObj = {
      applicationId: queries.keys[0].data,
      applicationName: queries.keys[1].data,
      applicationDate: queries.keys[2].data !== '' ? format(queries.keys[2].data.toISOString(), 'YYYY-MM-DD') : '',
      lenderLabel: queries.keys[3].data,
      status: queries.keys[4].data,
      approvalAmount: queries.keys[5].data,
      amountFinanced: queries.keys[6].data,
      payoutPercentage: queries.keys[7].data,
      payoutAmount: queries.keys[8].data,
      fundedDate: queries.keys[9].data !== '' ? format(queries.keys[9].data.toISOString(), 'YYYY-MM-DD') : '',
      interestRate: queries.keys[10].data,
      monthlyPayment: queries.keys[11].data,
      offset: queries.pageOffset,
      limit: queries.pageLength,
    };
    const { sorting } = queries;

    query.sortBy = sorting.columnName;
    query.sortOrder = sorting.direction;

    const param = this.getParameter(JSON.parse(selectedValue), filterObj, searchValue, query);
    this.getApplications(param);
    this.setState({ filterObj });
  }

  handleKeydown = (event) => {
    if (event.keyCode === 13 && event.target.name === 'searchInput') {
      this.handleSearchClick(event);
    }
  }

  handleSearchClick = (e) => {
    e.preventDefault();
    const { searchValue, selectedValue } = this.state;
    this.setState(state => ({
      filterObj: {
        ...state.filterObj,
        offset: 0,
      },
    }), () => {
      const param = this.getParameter(JSON.parse(selectedValue), this.state.filterObj, searchValue);
      this.getApplications(param);
    });
  }

  handleFilterChange = (e) => {
    const { searchValue } = this.state;
    const selectedValue = e.target.value;
    this.setState(state => ({
      selectedValue,
      filterObj: {
        ...state.filterObj,
        offset: 0,
      },
    }), () => {
      const param = this.getParameter(JSON.parse(selectedValue), this.state.filterObj, searchValue);
      this.getApplications(param);
    });
  }

  handleReset = (e) => {
    e.preventDefault();

    this.setState({ selectedValue: null, searchValue: '' }, () => {
      this.handleSearchClick(e);
    });
  }

  handleChange = (e) => {
    e.preventDefault();

    this.setState({
      searchValue: e.target.value,
    });
  }

  // eslint-disable-next-line
  cellButtonHandler = (index, row) => {
    this.props.history.push(`/dashboard/application-detail?applicationId=${row.applicationId}`);
  }

  render() {
    // eslint-disable-next-line
    const { columns, loading, rows, rowCount, tableKey, selectedValue, query, searchValue, filterObj } = this.state;
    return (
      <div className="page-applications">
        <Container fluid>

          <Row className="mb-3 align-items-center">
            <Col md={6}>
              <h3 className="mb-3 mb-md-0 text-center text-md-left">Application Review</h3>
            </Col>

            <Col md={6}>
              <Row form>
                <Col md={6} className="mb-1 mb-md-0">
                  <FormGroup className="dropdown-toggle mb-0">
                    <Select
                      name="form-field-name"
                      value={selectedValue}
                      onChange={this.handleFilterChange}
                      placeHolder="All Applications"
                      data={get(this.filters, '0.filters').map(item => ({
                        value: JSON.stringify(item),
                        title: item.label,
                      }))}
                      hasDefault={false}
                      isErrorVisible={false}
                    />
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FormGroup className="mb-0">
                    <Input
                      type="text"
                      name="searchInput"
                      id="searchField"
                      placeholder="Search"
                      value={searchValue}
                      onChange={this.handleChange}
                      isErrorVisible={false}
                    />
                  </FormGroup>
                </Col>

              </Row>
            </Col>
          </Row>
          <LargeDataTable
            key={tableKey}
            columns={columns}
            defaultSorting={[{ columnName: query.sortBy, direction: query.sortOrder }]}
            pageOffset={{ offset: filterObj.offset, limit: filterObj.limit }}
            hasGrouping
            hasSorting
            loading={loading}
            rows={rows}
            rowCount={rowCount}
            onFilter={(queries, isInitial, isHeaderTag) => { this.filterHandler(queries, isInitial, isHeaderTag); }}
          />
        </Container>
      </div>
    );
  }
}

ApplicationReview.propTypes = {
  getApplications: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

ApplicationReview.defaultProps = {

};

const mapStateToProps = state => ({
  navigation: state.navigation,
});

const mapDispatchToProps = dispatch => ({
  getApplications: data => dispatch(getApplications(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ApplicationReview));
