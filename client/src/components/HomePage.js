import React, { useContext } from 'react'
import Book from './Book'
import { Context } from '../stateProvider'
export default function HomePage() {
    const { books, loading, currentUser } = useContext(Context)
    if (loading) {
        return <div>loading</div>
    }
    return (
        <div className="row justify-content-between">
            {books.map((book) => (
                <Book
                    key={book.slug}
                    book={book}
                    auth={
                        currentUser?._id == book?.user ||
                        currentUser?.role == 'admin'
                            ? true
                            : false
                    }
                />
            ))}
        </div>
    )
}
