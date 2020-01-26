import React from 'react';

type Props = {
  setFilter: () => {},
  value: '',
}

const doneTypingInterval = 1000;

export default class TagFilterHeaderCell extends React.Component {
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

  onKeyUpHandler() {
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(this.doneTyping, doneTypingInterval);
  }

  onKeyDownHandler() {
    clearTimeout(this.typingTimer);
  }

  onChangeHander() {
    this.setState({ data: [this.input.value] });
  }

  setWrapperRef = (node) => {
    this.wrapperRef = node;
  }

  props: Props;

  doneTyping = () => {
    const { setFilter } = this.props;
    this.setState({ data: [this.input.value] }, () => {
      setFilter(this.state);
    });
  }

  render() {
    const { data } = this.state;
    let filterString = '';
    for (let i = 0; i < data.length; i++) {
      filterString += data[i];
    }
    return (
      <th className="header-cell">
        <div className="header-cell-container has-filter" ref={this.setWrapperRef}>
          <input
            type="text"
            className="form-control"
            placeholder=""
            value={filterString}
            ref={(el) => { this.input = el; }}
            onChange={() => this.onChangeHander()}
            onKeyUp={() => this.onKeyUpHandler()}
            onKeyDown={() => this.onKeyDownHandler()}
          />
        </div>
      </th>
    );
  }
}
