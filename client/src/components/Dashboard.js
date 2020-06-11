import React, { useEffect, useState, useContext } from 'react'
import { Context } from '../stateProvider'
import Book from './Book'
export default function Dashboard() {
    const { currentUser } = useContext(Context)
    const [user, setUser] = useState(currentUser)
    useEffect(() => {
        fetch('/users/userProfile?userId=' + user._id)
            .then((res) => res.json())
            .then((data) => {
                setUser(data.user)
                console.log(data.user)
            })
            .catch((e) => console.log(e))
    }, [])
    return (
        <>
            <div>{user?.name}</div>
            <div>
                {user?.books ? (
                    user.books.map((book) => (
                        <Book book={book} key={Date.now()} />
                    ))
                ) : (
                    <div>no books</div>
                )}
            </div>
        </>
    )
}
