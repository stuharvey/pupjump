import React, { Component } from 'react';

import Modal from 'react-modal';
import BOOKS from '../data/BookList';

const Book = ({
  title,
  link,
  description,
  stars,
  status,
  year,
}) => (
    <div style={{ margin: 10, padding: 10, backgroundColor: '#fafafa' }}>
      <h3>
        {link ? (
          <a style={{ color: 'black' }} href={link}>
            {title}
          </a>
        ) : (
            title
          )}
        <span style={{ float: 'right', color: 'darkgrey', fontWeight: 300, }}>
          {stars} stars
        </span>
      </h3>
      <p>
        {description}
      </p>
    </div>
  )

const BooksModal = ({ active }) => (
  <Modal
    isOpen={active}
    style={{
      content: {
        padding: 20,
        top: 90,
      }
    }}
    contentLabel="booksModal"
  >
    <h2>
      Books I've read
    </h2>
    {Object.entries(BOOKS
      .reduce((booksInYear, book) => (
        { ...booksInYear, [book.yearRead]: [...booksInYear[book.yearRead], book] }
      ), {2018: [], 2017: []}))
      .map(([year, books]) =>
        <div>
          <h2>
            {year}
          </h2>
          {books.map(book => <Book {...book} />)}
        </div>
      )
    }
  </Modal>
)

export default BooksModal