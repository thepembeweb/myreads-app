import React , { Component } from 'react';
import { Link } from 'react-router-dom'
import { Debounce } from 'react-throttle';
import PropTypes from 'prop-types';
import Book from '../books/Book'
import * as BooksAPI from '../../api/BooksAPI'

class Search extends Component {
    state = {
        booksQuery: []
    }

    static propType = {
        bsBooks: PropTypes.array.isRequired,
        onBookShelfChange: PropTypes.func.isRequired
    }

    intersect = (firstElement, secondElement) => {
        let element;
        if (secondElement.length > firstElement.length) {
            element = secondElement;
            secondElement = firstElement;
            firstElement = element;
        }
        return firstElement.filter(function (e) {
            return secondElement.indexOf(e) > -1;
        });
    }

    updateQuery = (query) => {

        if(query === '') {
            this.setState({
                booksQuery: []
            })

            return
        }

        BooksAPI.search(query, 20).then((books) => {

            this.updateBookSearchState(books);

            if (books !== undefined && books.error !== "empty query") {

                this.setState({
                    booksQuery: books
                })
            } else {
                this.setState({
                    booksQuery: []
                })
            }

        })


    }

    updateBookSearchState = (books) => {

        if(books !== undefined && books.error !== "empty query") {
            let bookIds = books.map(book => book.id);
            let readIntersects = this.intersect(bookIds, this.props.bsBooks.filter(book => book.shelf === 'read').map((book) => book.id));
            let currentlyReadingIntersect = this.intersect(bookIds, this.props.bsBooks.filter((book) => book.shelf === 'currentlyReading').map(book => book.id));
            let wantToReadIntersects = this.intersect(bookIds, this.props.bsBooks.filter((book) => book.shelf === 'wantToRead').map((book) => book.id));

            for (let i = 0; i < books.length; i++) {
                if (readIntersects.includes(books[i].id)) {
                    books[i].shelf = 'read';
                }
                if (currentlyReadingIntersect.includes(books[i].id)) {
                    books[i].shelf = 'currentlyReading';
                }
                if (wantToReadIntersects.includes(books[i].id)) {
                    books[i].shelf = 'wantToRead';
                }
            }
        }
    }

    clearQuery = () => {
        this.setState({
            query: '',
            booksQuery: []
        })
    }

    handleBookShelfChange = (book, shelf) => {
        this.props.onBookShelfChange(book, shelf);
    }

    render() {

        return (
            <div className="search-books">
                <div className="search-books-bar">
                    <Link
                        to="/"
                        className="close-search"
                        onClick={this.clearQuery}
                    >Close</Link>
                    <div className="search-books-input-wrapper">
                        <Debounce time="200" handler="onChange">
                            <input
                                type="text"
                                placeholder="Search by title or author"
                                onChange={(event) => this.updateQuery(event.target.value)}
                            />
                        </Debounce>

                    </div>
                </div>
                <div className="search-books-results">
                    <ol className="books-grid">
                        {this.state.booksQuery.map(book => (
                            <li key={book.id}>
                                <Book
                                    book={book}
                                    booksShelfChange={this.handleBookShelfChange}
                                />
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        )
    }
}

export default Search