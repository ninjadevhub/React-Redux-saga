import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  Col,
  Container,
  Row,
} from 'reactstrap';

import LargeDataTable from 'components/Tables/LargeDataTable';

import {
  getMerchantPlans,
  selectMerchantPlan,
} from 'actions/menu';
import { tableFilter } from 'utils/table';


class RefundReview extends Component {
  constructor(props) {
    super(props);
    const columns = [
      // { name: 'planID', title: 'Plan ID', type: 'text', width: 120 },
      { name: 'name', title: 'Plan Name', type: 'text' },
      // { name: 'internalName', title: 'Internal Name', type: 'text', width: 200 },
      { name: 'term', title: 'Term', type: 'text', align: 'center' },
      { name: 'interestRateRange', title: 'Interest Rate (%)', type: 'text', align: 'center' },
      { name: 'orginationFeeRange', title: 'Origination Fee (%)', type: 'text', align: 'center' },
      { name: 'payoutRange', title: 'Payout (%)', type: 'text', align: 'center' },
      // { name: 'maxAmountRange', title: 'Max Amount', type: 'text', width: 150, align: 'center' },
      { name: 'zipTerm', title: 'Promo', type: 'text', align: 'center' },
      {
        name: 'selected',
        title: 'Selected',
        type: 'switch',
        items: [
          {
            value: true,
            title: 'Selected',
            style: { backgroundColor: '#04BC6C' },
          },
          {
            value: false,
            title: 'Select',
            style: { backgroundColor: '#727272' },
          },
        ],
        moreOptions: {
          isEmptyHeader: true,
          buttonClick: this.cellButtonClickHandler,
        },
        width: 100,
      },
    ];

    this.state = {
      columns,
      filteredRows: [],
      loading: false,
      rowCount: 1,
      rows: [],
    };
  }

  componentDidMount() {
    this.getPlans();
  }

  getPlans() {
    const id = localStorage.getItem('merchantId');

    this.setState({ loading: true });
    this.props.getMerchantPlans({
      url: `/merchants/${id}/pricing/plans`,
      success: (res) => {
        // const totalRows = res.sort((itemA, itemB) => itemA.createdOn < itemB.createdOn);
        const totalRows = res;

        this.setState({
          loading: false,
          filteredRows: totalRows,
          rowCount: totalRows.length,
          rows: totalRows,
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

  filterHandler = (queries, isInitial, isHeaderTag) => {
    const { filteredData, rowCount } = tableFilter(this.state.rows, queries, isHeaderTag);

    this.setState({
      filteredRows: filteredData,
      rowCount,
    });
  }

  cellButtonClickHandler = (rowId, row) => {
    const id = localStorage.getItem('merchantId');

    this.setState({ loading: true });
    this.props.selectMerchantPlan({
      url: `/merchants/${id}/pricing/plans/${row.code}/selected`,
      data: {
        selected: !row.selected,
      },
      // data: ,
      success: () => {
        this.getPlans();
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

  render() {
    const { columns, filteredRows, rowCount, loading } = this.state;
    return (
      <div className="page-applications">
        <Container fluid>

          <Row className="mb-3 align-items-center">
            <Col md={6}>
              <h3 className="mb-3 mb-md-0 text-center text-md-left">Select Your Plans</h3>
            </Col>
          </Row>
          <LargeDataTable
            headerTitle=""
            columns={columns}
            // defaultSorting={[{ columnName: 'generatedOn', direction: 'desc' }]}
            // hasSorting
            hasFiltering={false}
            rows={filteredRows}
            rowCount={rowCount}
            loading={loading}
            onFilter={(queries, isInitial, isHeaderTag) => { this.filterHandler(queries, isInitial, isHeaderTag); }}
          />
        </Container>
      </div>
    );
  }
}

RefundReview.propTypes = {
  getMerchantPlans: PropTypes.func.isRequired,
  selectMerchantPlan: PropTypes.func.isRequired,
};

RefundReview.defaultProps = {

};

const mapStateToProps = state => ({
  navigation: state.navigation,
});

const mapDispatchToProps = {
  getMerchantPlans,
  selectMerchantPlan,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(RefundReview));
