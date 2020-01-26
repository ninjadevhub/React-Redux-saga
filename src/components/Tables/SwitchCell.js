import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class SwitchCell extends Component {
  render() {
    const { rowId, row, options, name, onClick } = this.props;
    const className = 'tag-indicator';
    const baseStyle = {
      marginRight: '5px',
      padding: '0px 5px',
      fontSize: '16px',
      textTransform: 'Capitalize',
      lineHeight: '36px',
      height: '36px',
    };

    const style = row[name] === options[0].value ? options[0].style : options[1].style;
    const title = row[name] === options[0].value ? options[0].title : options[1].title;

    return (
      <td className={className}>
        <span
          className="btn btn-xs btn-cell"
          style={{ ...baseStyle, ...style }}
          onClick={() => onClick(rowId, row, options, name)}
        >
          {title}
        </span>
      </td>
    );
  }
}

SwitchCell.propTypes = {
  options: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  row: PropTypes.object.isRequired,
  rowId: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};
