import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import style from './style.scss';
// import DropdownButton from 'components/button/DropdownButton';

export default class ButtonsCell extends Component {
  render() {
    const { onClick, buttons, info } = this.props;
    let className = 'btns-td';
    if (buttons && buttons.length === 1) {
      if (buttons[0].title === '...') {
        className = 'dot-btn-td';
      } else if (buttons[0].title === '') {
        className = 'icon-btn-td';
      } else {
        className = 'btn-td';
      }
    }
    return (
      <td className={className}>
        {
          buttons.map((item, index) => {
            const isDiabled = (info.status && info.status === 'Completed' && item.title === 'Take Action');

            if (item.disabledBtnTitle && info[item.disabledBtnKey]) {
              return (
                <button
                  key={`cell-button-${index.toString()}`}
                  className="btn btn-xs btn-cell-disabled"
                  style={item.style}
                  disabled={isDiabled}
                >
                  {item.disabledBtnTitle}
                </button>
              );
            }
            if (item.title === '') {
              return (
                <button
                  key={`cell-button-${index.toString()}`}
                  className="btn btn-xs btn-cell"
                  style={item.style}
                  disabled={isDiabled}
                  onClick={() => onClick(index)}
                >
                  <i className="fa fa-arrow-circle-down" />
                </button>
              );
            }
            if (item.title === '...') {
              return (
                <button
                  key={`cell-button-${index.toString()}`}
                  className="btn btn-xs btn-cell"
                  style={item.style}
                  disabled={isDiabled}
                  onClick={() => onClick(index)}
                >
                  <i className="fa fa-eye" />
                </button>
              );
            }
            const arrowIcon = (item.title === 'Details') ? <span className="glyphicon glyphicon-menu-right" /> : null;
            if (item.updatedBtnTitle && info[item.updatedBtnKey]) {
              return (
                <button
                  key={`cell-button-${index.toString()}`}
                  className="btn btn-xs btn-cell"
                  style={item.style}
                  disabled={isDiabled}
                  onClick={() => onClick(index)}
                >
                  {item.updatedBtnTitle} {arrowIcon}
                </button>
              );
            }
            return (
              <button
                key={`cell-button-${index.toString()}`}
                className={item.className ? cn('button green', style[item.className]) : 'btn btn-xs btn-cell'}
                style={item.style}
                disabled={isDiabled}
                onClick={() => onClick(index)}
              >
                {item.title} {arrowIcon}
              </button>
            );
          })
        }
      </td>
    );
  }
}

ButtonsCell.propTypes = {
  onClick: PropTypes.func,
  info: PropTypes.any,
  buttons: PropTypes.array,
};

ButtonsCell.defaultProps = {
  onClick: () => {},
  info: null,
  buttons: [],
};
