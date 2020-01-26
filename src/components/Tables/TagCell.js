import React from 'react';
import PropTypes from 'prop-types';

export class TagCell extends React.Component {
  render() {
    const { tags, type } = this.props;
    return (
      <td>
        {
          (type === 'tag') ?
            tags.map((tag, index) => (
              <button
                key={`table-tag${index.toString()}`}
                onClick={() => {}}
                className="btn btn-xs grid-tag"
              >
                {tag}
              </button>
            )) :
            tags.map((tag, index) => (
              <div
                key={`table-tag${index.toString()}`}
                className="tag-text"
              >
                {tag}
              </div>
            ))
        }
      </td>
    );
  }
}

TagCell.propTypes = {
  tags: PropTypes.string,
  type: PropTypes.string,
};

TagCell.defaultProps = {
  tags: '',
  type: 'tag',
};

export default TagCell;
