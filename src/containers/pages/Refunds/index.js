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
  getRefunds,
} from 'actions/application';
import { appConfig } from 'config/appConfig';
import { formatCurrency } from 'utils/formatCurrency';

// eslint-disable-next-line
const initialFilter = {
  refundId: '',
  applicationId: '',
  applicantName: '',
  currentAmountFinanced: '',
  refundAmount: '',
  newAmountFinanced: '',
  refundStatus: '',
  createdOn: '',
  refundCompletedDate: '',
  query: '',
  offset: 0,
  limit: appConfig.limit,
};

class RefundReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { name: 'refundId', title: 'Refund ID', type: 'text', width: 100, isFilterVisible: true },
        { name: 'createdOn', title: 'Requested Date', type: 'date', width: 200, isFilterVisible: false },
        { name: 'applicationId', title: 'Application ID', type: 'text', width: 120, isFilterVisible: true },
        { name: 'applicantName', title: 'Applicant', type: 'text', width: 240, isFilterVisible: true },
        { name: 'amountFinanced', title: 'Current Amt Financed', type: 'number', width: 180, align: 'right' },
        { name: 'refundRequestedAmount', title: 'Refund Amt', type: 'number', width: 120, align: 'right' },
        { name: 'newAmountFinanced', title: 'New Amt Financed', type: 'number', width: 150, align: 'right' },
        { name: 'merchantDebitAmount', title: 'Debit Amt', type: 'number', width: 100, align: 'right' },
        { name: 'refundStatus', title: 'Refund Status', type: 'text', width: 140, isFilterVisible: true },
        { name: 'refundCompletedOn', title: 'Refund Completed Date', type: 'date', width: 230 },
      ],
      loading: true,
      query: {
        sortBy: 'createdOn',
        sortOrder: 'desc',
      },
      rowCount: 1,
      rows: [],
      tableKey: 'filterTable_default',
      selectedValue: null,
      searchValue: props.match.params.searchQuery,
      filterObj: {
        refundId: '',
        createdOn: '',
        applicationId: '',
        applicantName: '',
        amountFinanced: '',
        refundRequestedAmount: '',
        newAmountFinanced: '',
        refundStatus: '',
        refundCompletedOn: '',
        query: '',
        offset: 0,
        limit: appConfig.limit,
      },
    };
    this.filters = JSON.parse(localStorage.getItem('filters'));
  }

  componentWillMount() {
    const selectedValueIndex = findIndex(get(this.filters, '2.filters'), item => item.name === this.props.match.params.statusCode);
    console.log('selectedValueIndex', selectedValueIndex);
    this.setState({
      selectedValue: JSON.stringify(get(get(this.filters, '2.filters'), `${selectedValueIndex}`)),
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
    delete newQuery.statusCode;
    const ret = {
      filter: get(selectedValue, 'attributes.query.statusCode'),
      filterObj,
      search: searchValue,
      query: newQuery,
    };
    return ret;
  }

  getRefunds({
    filterObj = initialFilter,
    search = '',
    filter = null,
    query = { sortBy: 'createdOn', sortOrder: 'desc' },
  }) {
    const filters = [];
    filters[0] = (filterObj.refundId !== '') ? `RefundId=${filterObj.refundId}&` : '';
    filters[1] = (filterObj.createdOn !== '') ? `CreatedOn=${filterObj.createdOn}&` : '';
    filters[2] = (filterObj.applicationId !== '') ? `ApplicationId=${filterObj.applicationId}&` : '';
    filters[3] = (filterObj.applicantName !== '') ? `ApplicantName=${filterObj.applicantName}&` : '';
    filters[4] = (filterObj.amountFinanced !== '') ? `AmountFinanced=${filterObj.amountFinanced}&` : '';
    filters[5] = (filterObj.refundRequestedAmount !== '') ? `RefundRequestedAmount=${filterObj.refundRequestedAmount}&` : '';
    filters[6] = (filterObj.newAmountFinanced !== '') ? `NewAmountFinanced=${filterObj.newAmountFinanced}&` : '';
    filters[7] = (filterObj.merchantDebitAmount !== '') ? `MerchantDebitAmount=${filterObj.merchantDebitAmount}&` : '';
    filters[8] = (filterObj.refundStatus !== '') ? `RefundStatus=${filterObj.refundStatus}&` : '';
    filters[9] = (filterObj.refundCompletedOn !== '') ? `RefundCompletedOn=${filterObj.refundCompletedOn}&` : '';
    filters[10] = query !== '' ? `${map(query, (value, key) => `${key}=${value}`).join('&')}&` : '';
    if (filter) {
      filters[11] = `statusCode=${filter}&`;
    }
    filters[12] = query !== '' ? `${map(query, (value, key) => `${key}=${value}`).join('&')}&` : '';
    let terms = '';
    if (search !== '') { terms = `Terms=${search}&`; }

    const merchantId = localStorage.getItem('merchantId');

    const searchUrl = `/refunds/search?merchantId=${merchantId}&${filters.join('')}${terms}offset=${filterObj.offset}&limit=${filterObj.limit}`;

    this.setState({ loading: true });
    this.props.getRefunds({
      url: searchUrl,
      success: (res) => {
        const rows = res.data.map((item) => {
          const { refundId, applicationId, applicantName, amountFinanced, refundRequestedAmount, newAmountFinanced, refundStatus, createdOn, refundCompletedOn, merchantDebitAmount } = item;
          return {
            refundId,
            applicationId,
            applicantName,
            amountFinanced: amountFinanced ? `$${formatCurrency(amountFinanced, 2)}` : `$${formatCurrency(0, 2)}`,
            refundRequestedAmount: refundRequestedAmount ? `$${formatCurrency(refundRequestedAmount, 2)}` : `$${formatCurrency(0, 2)}`,
            newAmountFinanced: newAmountFinanced ? `$${formatCurrency(newAmountFinanced, 2)}` : `$${formatCurrency(0, 2)}`,
            merchantDebitAmount: merchantDebitAmount ? `$${formatCurrency(merchantDebitAmount, 2)}` : `$${formatCurrency(0, 2)}`,
            refundStatus: refundStatus ? refundStatus.label || '' : '',
            createdOn: createdOn ? format(new Date(createdOn), 'MMM DD, YYYY hh:mm a') : '-',
            refundCompletedOn: refundCompletedOn ? format(new Date(refundCompletedOn), 'MMM DD, YYYY hh:mm a') : '-',
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

        if (err.response && err.response.data) {
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
      refundId: queries.keys[0].data,
      createdOn: queries.keys[1].data !== '' ? format(queries.keys[1].data.toISOString(), 'YYYY-MM-DD') : '',
      applicationId: queries.keys[2].data,
      applicantName: queries.keys[3].data,
      amountFinanced: queries.keys[4].data,
      refundRequestedAmount: queries.keys[5].data,
      newAmountFinanced: queries.keys[6].data,
      merchantDebitAmount: queries.keys[7].data,
      refundStatus: queries.keys[8].data,
      refundCompletedOn: queries.keys[9].data !== '' ? format(queries.keys[9].data.toISOString(), 'YYYY-MM-DD') : '',
      offset: queries.pageOffset,
      limit: queries.pageLength,
    };
    const { sorting } = queries;
    query.sortBy = sorting.columnName;
    query.sortOrder = sorting.direction;

    const param = this.getParameter(JSON.parse(selectedValue), filterObj, searchValue, query);
    this.getRefunds(param);
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
      this.getRefunds(param);
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
      this.getRefunds(param);
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

  render() {
    // eslint-disable-next-line
    const { columns, loading, rows, rowCount, tableKey, selectedValue, query, searchValue, filterObj } = this.state;
    return (
      <div className="page-applications">
        <Container fluid>

          <Row className="mb-3 align-items-center">
            <Col md={6}>
              <h3 className="mb-3 mb-md-0 text-center text-md-left">Refunds</h3>
            </Col>
            <Col md={6}>
              <Row form>
                <Col md={6} className="mb-1 mb-md-0">
                  <FormGroup className="dropdown-toggle mb-0">
                    <Select
                      name="form-field-name"
                      value={selectedValue}
                      onChange={this.handleFilterChange}
                      placeHolder="All Refunds"
                      data={get(this.filters, '2.filters').map(item => ({
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
            headerTitle="All Refunds"
            key={tableKey}
            className="clean-grid"
            columns={columns}
            defaultSorting={[{ columnName: query.sortBy, direction: query.sortOrder }]}
            pageOffset={{ offset: filterObj.offset, limit: filterObj.limit }}
            // hasGrouping
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

RefundReview.propTypes = {
  getRefunds: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
};

RefundReview.defaultProps = {

};

const mapStateToProps = state => ({
  navigation: state.navigation,
});

const mapDispatchToProps = {
  getRefunds,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(RefundReview));
