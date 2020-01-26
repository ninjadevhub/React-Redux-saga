import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export class MultiLineTextCell extends Component {
  state = {
    height: 0,
  };

  componentDidMount() {
    const height = this.tooltipElement.offsetHeight;
    setTimeout(() => {
      // console.log('tooltipElement height ===>', height);
      this.setState({ height });
    }, 500);
  }

  render() {
    const { text } = this.props;
    const { height } = this.state;
    // const text1 = ['Sunt minus occaecati neque magnam ut optio.Sunt minus occaecati neque magnam ut optio.Sunt minus occaecati neque magnam ut optio.Sunt minus occaecati neque magnam ut optio.Sunt minus occaecati neque magnam ut optio.', 'Sunt minus occaecati neque magnam ut optio.Sunt minus occaecati neque magnam ut optio.'][Math.floor(Math.random() * 2)];
    return (
      <td className="multi-line-td">
        <div className="td-content">
          <span className={classNames('tooltiptext', (height < 60) ? 'tooltip-hide' : '')} >
            <span ref={(el) => { this.tooltipElement = el; }}>{text}</span>
          </span>
          <div className="ellipsis" >
            {text}
          </div>
        </div>
      </td>
    );
  }
}

MultiLineTextCell.propTypes = {
  text: PropTypes.string,
};

MultiLineTextCell.defaultProps = {
  text: '',
};

export default MultiLineTextCell;
