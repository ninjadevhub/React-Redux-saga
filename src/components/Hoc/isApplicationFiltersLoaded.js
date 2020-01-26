import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getApplicationFilters } from 'actions/application';
import get from 'lodash/get';

export default function isApplicationLoaded(WrappedComponent) {
  const HOC = class extends Component {
    static propTypes = {
      getApplicationFilters: PropTypes.func.isRequired,
      location: PropTypes.object.isRequired,
    };

    state = {
      isApplicationReviewDataLoaded: !!localStorage.getItem('filters'),
    };

    componentDidMount() {
      if (!localStorage.getItem('filters') && localStorage.idToken) {
        this.props.getApplicationFilters({
          url: 'filters/merchant-portal',
          success: (res) => {
            localStorage.setItem('filters', JSON.stringify(get(res, 'filters')));
            this.setState({
              isApplicationReviewDataLoaded: true,
            });
          },
        });
      }
    }

    // eslint-disable-next-line
    UNSAFE_componentWillReceiveProps(nextProps) {
      if (!localStorage.getItem('filters') && localStorage.idToken) {
        this.props.getApplicationFilters({
          url: 'filters/merchant-portal',
          success: (res) => {
            localStorage.setItem('filters', JSON.stringify(get(res, 'filters')));
            this.setState({
              isApplicationReviewDataLoaded: true,
            });
          },
        });
      }
    }

    render() {
      const { isApplicationReviewDataLoaded } = this.state;
      return <WrappedComponent {...this.props} isApplicationReviewDataLoaded={isApplicationReviewDataLoaded} />;
    }
  };

  return connect(null, { getApplicationFilters })(HOC);
}

