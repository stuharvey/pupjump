import React, { Component } from 'react';

import Modal from 'react-modal';


export default class BooksModal extends Component {
  render() {
    return (
      <Modal
        isOpen={this.props.active}
        contentLabel="booksModal"
        style={{
          content: {
            'z-index': 2,
            top: '80px',
          }
        }}>
        <h2>
          Books I've read:
        </h2>
        <h3>
          2017
        </h3>
        <h3>
          2016
        </h3>
      </Modal>
    );
  }
}