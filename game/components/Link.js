import React, { Component } from 'react';

export default class Link extends Component {
  render() {
    return (
      <li className="link">
        <a href={this.props.address} onClick={() => this.props.onClick()}>
          {this.props.text}
        </a>
      </li>
    );
  }
}
