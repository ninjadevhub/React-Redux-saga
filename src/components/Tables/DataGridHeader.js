import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isEqual } from 'lodash';

const doneTypingInterval = 1000;

export default class DataGridHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tagsObj: this.generateTagsObj(props.tags),
      allTagActive: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.tags, nextProps.tags)) {
      this.setState({
        tagsObj: this.generateTagsObj(nextProps.tags),
      });
    }
  }

  onKeyUpHandler() {
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(this.doneTyping, doneTypingInterval);
  }

  onKeyDownHandler() {
    clearTimeout(this.typingTimer);
  }

  doneTyping = () => {
    const { onSearchValueChange } = this.props;
    onSearchValueChange(this.input.value);
  }

  tagClickHandler(tagObj, index) {
    const { tagsObj } = this.state;
    const { onTagSelected } = this.props;
    tagsObj[index].isActive = !tagObj.isActive;
    this.setState({ tagsObj }, () => {
      const activeTags = [];
      for (let i = 0; i < tagsObj.length; i++) {
        if (tagsObj[i].isActive) {
          activeTags.push(tagsObj[i].tag);
        }
      }
      onTagSelected(activeTags);
    });
  }

  allTagClickHandler(active) {
    const allTagActive = !active;
    const { tagsObj } = this.state;
    const { onTagSelected } = this.props;
    for (let i = 0; i < tagsObj.length; i++) {
      tagsObj[i].isActive = allTagActive;
    }
    this.setState({
      tagsObj,
      allTagActive,
    }, () => {
      const activeTags = [];
      for (let i = 0; i < tagsObj.length; i++) {
        if (tagsObj[i].isActive) {
          activeTags.push(tagsObj[i].tag);
        }
      }
      onTagSelected(activeTags);
    });
  }

  generateTagsObj = (tags) => {
    const tagsObj = [];
    if (tags && tags.length !== 0) {
      for (let i = 0; i < tags.length; i++) {
        const tagObj = {
          tag: tags[i],
          isActive: false,
        };
        tagsObj.push(tagObj);
      }
    }

    return tagsObj;
  }

  render() {
    const { tags } = this.props;
    const { tagsObj, allTagActive } = this.state;
    const renderTagsHeader = (tags && tags.length !== 0) ?
      (
        <div className="header-tag-container">
          <button
            onClick={() => { this.allTagClickHandler(allTagActive); }}
            className={classNames('btn btn-xs grid-tag', (allTagActive) && 'active')}
          >
            All
          </button>
          {
            tagsObj.map((tagObj, index) => (
              <button
                key={`header-tag${index.toString()}`}
                onClick={() => { this.tagClickHandler(tagObj, index); }}
                className={classNames('btn btn-xs grid-tag', (tagObj.isActive) && 'active')}
              >
                {tagObj.tag}
              </button>
            ))
          }
        </div>
      ) :
      null;
    const renderHeader = (renderTagsHeader === null) ?
      null :
      (
        <div className="virtual-data-table-haader">
          {renderTagsHeader}
        </div>
      );
    return (
      <div>
        {renderHeader}
      </div>
    );
  }
}

DataGridHeader.propTypes = {
  tags: PropTypes.array,
  onSearchValueChange: PropTypes.func,
  onTagSelected: PropTypes.func,
};

DataGridHeader.defaultProps = {
  tags: [],
  onSearchValueChange: () => {},
  onTagSelected: () => {},
};
