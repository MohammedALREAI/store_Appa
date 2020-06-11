import React, { useContext } from 'react'
import { Context } from '../stateProvider'
import { useHistory } from 'react-router'
import FacebookLogin from 'react-facebook-login'

export default function CreateNewUserPage(props) {
    const { registerUser, currentUser, addFacebookUser } = useContext(Context)

    const handleFacebookAuth = (res) => {
        addFacebookUser(res)
    }
    const history = useHistory()
    if (currentUser) history.push('/')
    return (
        <>
            <form onSubmit={registerUser}>
                <FacebookLogin
                    appId="1223606648030855"
                    autoLoad={true}
                    fields={'name, email'}
                    callback={handleFacebookAuth}
                />
                <div className="form-group">
                    <label htmlFor="name">name</label>
                    <input
                        name="name"
                        id="name"
                        placeholder="Name"
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">email</label>
                    <input
                        name="email"
                        id="email"
                        placeholder="email"
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">password</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="password"
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">confirm password</label>
                    <input
                        type="password"
                        className="form-control"
                        name="confirmPassword"
                        id="confirmPassword"
                        placeholder="confirm-password"
                    />
                </div>
                <input type="submit" value="register" />
            </form>
        </>
    )
}
