import React, { Component, PropTypes } from 'react';
import TestItem from './TestItem';

export default class Test extends Component {
  static propTypes = {
    placeholder: PropTypes.string.isRequired,
    list: PropTypes.arrayOf(PropTypes.object).isRequired,
    unshiftItem: PropTypes.func.isRequired,
    incrementCount: PropTypes.func.isRequired
  };

  unshiftItem = () => {
    this.props.unshiftItem({
      value: this.refs.input.value
    });
  };

  unshiftItemOnEnter = (event) => {
    if (event.key === 'Enter') {
      this.unshiftItem();
    }
  };

  render() {
    return (
      <div className="test">
        {this.renderInput()}
        {this.renderItems()}
      </div>
    );
  }

  renderInput() {
    return (
      <input
        ref="input"
        type="text"
        placeholder={this.props.placeholder}
        onKeyDown={this.unshiftItemOnEnter}
      />
    );
  }

  renderItems() {
    return this.props.list.map(
      (item, index) => (
        <TestItem ref={`item${index}`} key={index} index={index} />
      )
    );
  }
}
