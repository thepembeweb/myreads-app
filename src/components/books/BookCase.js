import React , { Component } from 'react';
import PropTypes from 'prop-types';
import BookShelf from './BookShelf'

class BookCase extends Component {

    handleBookShelfChange = (book, shelf) => {
        this.props.onBookShelfChange(book, shelf);
    }

    render() {
        return (
            <div className="list-books-content">
                <div>
                    <BookShelf
                        title="Currently Reading"
                        cat="currentlyReading"
                        books={this.props.books.filter(book => book.shelf === 'currentlyReading')}
                        onBookShelfChange={this.handleBookShelfChange}
                    />
                    <BookShelf
                        title="Want to Read"
                        cat="wantToRead"
                        books={this.props.books.filter(book => book.shelf === 'wantToRead')}
                        onBookShelfChange={this.handleBookShelfChange}
                    />
                    <BookShelf
                        title="Read"
                        cat="read"
                        books={this.props.books.filter(book => book.shelf === 'read')}
                        onBookShelfChange={this.handleBookShelfChange}
                    />
                </div>
            </div>
        )
    }

    static propTypes = {
        books: PropTypes.array.isRequired,
        onBookShelfChange: PropTypes.func.isRequired
    }

}

export default BookCase