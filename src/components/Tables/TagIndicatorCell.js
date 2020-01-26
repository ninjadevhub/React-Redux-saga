import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class TagIndicatorCell extends Component {
  render() {
    const { name, title, style, info } = this.props;
    const className = 'tag-indicator-td';
    const isDiabled = (info.status && info.status === 'Completed');
    const tag = info[name] ? (<span key="cell-tag-indicator" className="btn btn-xs tag-indicator-cell" style={style} disabled={isDiabled}>{title}</span>) : <span />;

    return (
      <td className={className}>
        { tag }
      </td>
    );
  }
}

TagIndicatorCell.propTypes = {
  name: PropTypes.string.isRequired,
  info: PropTypes.any.isRequired,
  title: PropTypes.string.isRequired,
  style: PropTypes.object,
};

TagIndicatorCell.defaultProps = {
  style: {},
};
