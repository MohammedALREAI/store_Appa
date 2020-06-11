import React, { useCallback, useContext, useState } from 'react'
import { Context } from '../stateProvider'
import { ADD_BOOK, FETCH_FAILED } from '../actions/constants'
import axios from 'axios'
export default function CreateNewBookPage(props) {
    const [imgFile, setImgFile] = useState(null)
    const [presentage, setPersentage] = useState(0)
    let titleInput, countInput, dateInput, priceInput
    const { dispatch } = useContext(Context)
    const fileOnChangeHandler = (e) => {
        setImgFile(e.target.files[0])
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const data = new FormData()
        data.append('file', imgFile)
        data.append('title', titleInput.value)
        data.append('pageCount', countInput.value)
        data.append('publishedAt', countInput.value)
        data.append('price', countInput.value)
        axios
            .post('/books', data, {
                onUploadProgress: (progressEvent) => {
                    let presentage = Math.ceil(
                        (progressEvent.loaded / progressEvent.total) * 100
                    )
                    setPersentage(presentage)
                    console.log(presentage)
                },
                responseType: 'json',
                headers: {
                    auth: localStorage.token,
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((res) => {
                if (res.status == 200) {
                    dispatch({ type: ADD_BOOK, payload: res.data.book })

                    props.history.push(`/show-book/${res.data.book.slug}`)
                } else console.log(res.statusText)
            })
            .catch((e) => console.log(e))
        e.preventDefault()
    }
    return (
        <div>
            <h2 className="mt-4">Create New Books</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>title</label>
                    <input
                        ref={(node) => (titleInput = node)}
                        type="text"
                        name="title"
                        className="form-control"
                    />
                </div>
                <div className="input-group my-5">
                    <div className="custom-file ">
                        <input
                            type="file"
                            className="custom-file-input"
                            id="inputGroupFile02"
                            onChange={fileOnChangeHandler}
                        />
                        <label
                            className="custom-file-label"
                            htmlFor="inputGroupFile020"
                        >
                            Choose file
                        </label>
                    </div>
                    <div className="input-group-append">
                        <span
                            className="input-group-text"
                            id="inputGroupFile02"
                        >
                            Upload
                        </span>
                    </div>
                </div>

                <div className="form-group">
                    <label>page count</label>
                    <input
                        ref={(node) => (countInput = node)}
                        type="number"
                        name="pageCount"
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>price</label>
                    <input
                        ref={(node) => (priceInput = node)}
                        type="number"
                        name="price"
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label> publishedAt</label>

                    <input
                        ref={(node) => (dateInput = node)}
                        type="date"
                        name="publishedAt"
                        className="form-control"
                    />
                </div>
                <div className="progress">
                    <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${presentage}%` }}
                    ></div>
                </div>
                <input className="btn btn-primary" type="submit" />
            </form>
        </div>
    )
}
