import React, { useEffect, useContext } from 'react'
import './App.css'
import Book from './components/Book'
import Nav from './components/Nav'
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom'
import CreateNewBookPage from './components/CreateNewBookPage'
import HomePage from './components/HomePage'
import EditPage from './components/EditPage'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import AllUsers from './components/AllUsers'
import { FETCH_SUCCESS, FETCH_FAILED, LOGIN } from './actions/constants'
import { Context } from './stateProvider'
import CreateNewUserPage from './components/CreateNewUserPage'
function App() {
    const { books, currentUser, dispatch } = useContext(Context)
    useEffect(() => {
        fetch('/allbooks', {
            headers: {
                'Content-type': 'application/json',
                accept: 'application/json',
                auth: localStorage.getItem('token'),
            },
        })
            .then((res) => res.json())
            .then((data) => {
                dispatch({ type: FETCH_SUCCESS, payload: data.books })
                if (data.user) dispatch({ type: LOGIN, payload: data.user })
            })
            .catch((e) => {
                dispatch({ type: FETCH_FAILED, payload: JSON.stringify(e) })
            })
    }, [])
    return (
        <>
            <Nav />
            <div className="App container">
                {currentUser && (
                    <div className="badge badge-secondary">{`Hello ${currentUser.name}`}</div>
                )}

                <Switch>
                    <Route path="/" exact component={HomePage} />
                    <Route
                        path="/show-book/:slug"
                        render={(props) => {
                            const {
                                match: {
                                    params: { slug },
                                },
                            } = props
                            const book = books.find(
                                (book) => book.slug === slug
                            )
                            return (
                                <Book
                                    book={book}
                                    auth={currentUser?._id == book?.user}
                                />
                            )
                        }}
                    />
                    <Route
                        path="/new-book"
                        render={(props) => <CreateNewBookPage {...props} />}
                    />
                    <Route
                        path="/edit/:slug"
                        render={(props) => <EditPage {...props} />}
                    />
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={CreateNewUserPage} />
                    <Route path="/myAccount" component={Dashboard} />
                    <Route path="/allUsers" component={AllUsers} />
                </Switch>
            </div>
        </>
    )
}

export default App
