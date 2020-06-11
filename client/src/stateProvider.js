import React, { createContext, useReducer } from 'react'
import reducer from './reducers/index'
import {
    DELETE_BOOK,
    FETCH_FAILED,
    LOGOUT,
    LOGIN,
    GET_USERS,
} from './actions/constants'
import Axios from 'axios'
const initialState = {
    books: [],
    error: '',
    loading: true,
    currentUser: '',
    users: [],
}
export const Context = createContext(initialState)
export default function StateProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState)
    // const history = useHistory()
    const removeBook = (slug) => {
        dispatch({ type: DELETE_BOOK, payload: slug })
    }
    const addFacebookUser = (res) => {
        console.log(res)

        Axios.post('/auth/facebook', { data: res }).then((res) => {
            if (res.status == 200) {
                dispatch({ type: LOGIN, payload: res.data.user })
                localStorage.setItem('token', res.data.user.token)
            } else {
                dispatch({ type: FETCH_FAILED, payload: res.msg })
            }
        })
    }
    const registerUser = (e) => {
        e.preventDefault()
        const { name, password, confirmPassword, email } = e.target
        if (password.value == confirmPassword.value) {
            fetch('/users', {
                headers: {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                },
                method: 'POST',
                body: JSON.stringify({
                    name: name.value,
                    password: password.value,
                    email: email.value,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    dispatch({ type: LOGIN, payload: data.user })
                    localStorage.setItem('token', data.user.token)
                })
                .catch((e) => console.log(e))
        }
    }
    const logInUser = (email, password) => {
        fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                accept: 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)

                dispatch({ type: LOGIN, payload: data.user })
                localStorage.setItem('token', data.user.token)
            })
            .catch((err) => {
                console.error(err)
                dispatch({ type: FETCH_FAILED, payload: err })
            })
    }
    const logOutUser = () => {
        localStorage.removeItem('token')
        dispatch({ type: LOGOUT })
    }

    const getUsers = () => {
        fetch('/users')
            .then((res) => res.json())
            .then((data) => dispatch({ type: GET_USERS, payload: data.users }))
            .catch((e) => {
                console.log(e)
            })
    }

    return (
        <Context.Provider
            value={{
                ...state,
                dispatch,
                removeBook,
                logInUser,
                logOutUser,
                registerUser,
                getUsers,
                addFacebookUser,
            }}
        >
            {children}
        </Context.Provider>
    )
}
