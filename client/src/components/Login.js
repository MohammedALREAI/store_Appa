import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { Context } from '../stateProvider'
import FacebookLogin from 'react-facebook-login'
export default function Login() {
    const history = useHistory()
    const { error, logInUser, addFacebookUser, currentUser } = useContext(
        Context
    )
    const handleSubmit = (e) => {
        e.preventDefault()

        logInUser(e.target.email.value, e.target.password.value)
        history.push('/')
    }

    const handleFacebookAuth = (res) => {
        addFacebookUser(res)
    }
    if (currentUser) {
        history.push('/')
    }

    return (
        <>
            <FacebookLogin
                appId="1223606648030855"
                autoLoad={true}
                fields={'name, email'}
                callback={handleFacebookAuth}
            />
            <form onSubmit={handleSubmit}>
                {error && <div className="error ">{JSON.stringify(error)}</div>}
                <h2>Login</h2>
                <div className="form-group">
                    <label htmlFor="email">email</label>
                    <input
                        className="form-control"
                        name="email"
                        type="email"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">password</label>
                    <input
                        className="form-control"
                        name="password"
                        type="password"
                        required
                    />
                </div>

                <div className="form-group">
                    <input type="submit" />
                </div>
            </form>
        </>
    )
}
