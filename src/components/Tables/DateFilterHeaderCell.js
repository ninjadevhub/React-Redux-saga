// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Datetime from 'react-datetime';

export class DateFilterHeaderCell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.value,
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef = (node) => {
    this.wrapperRef = node;
  }

  handleDateChange(date) {
    const { setFilter } = this.props;
    this.setState({ data: date }, () => {
      setFilter(this.state);
    });
  }

  handleKeyDown = (e) => {
    e.preventDefault();
    if (e.key === 'Backspace' || e.key === 'Escape' || e.key === 'Delete') {
      this.dateTime.props.onChange('');
    }
  }

  handleInputChange = (e) => { e.preventDefault(); }

  render() {
    const { data } = this.state;
    return (
      <th className="header-cell">
        <div className="header-cell-container has-filter" ref={this.setWrapperRef}>
          <div className="date-picker-container">
            <Datetime
              value={data}
              dateFormat="MM/DD/YYYY"
              timeFormat={false}
              onChange={date => this.handleDateChange(date)}
              inputProps={{
                onChange: this.handleInputChange,
                onKeyDown: this.handleKeyDown,
              }}
              ref={(el) => { this.dateTime = el; }}
            />
          </div>
        </div>
      </th>
    );
  }
}

DateFilterHeaderCell.propTypes = {
  setFilter: PropTypes.func,
  value: PropTypes.string,
};

DateFilterHeaderCell.defaultProps = {
  setFilter: () => {},
  value: '',
};

export default DateFilterHeaderCell;
