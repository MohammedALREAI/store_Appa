import React, { useCallback, useContext, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Context } from "../stateProvider";
import { EDIT_BOOK, FETCH_FAILED } from "../actions/constants";

export default function EditPage(props) {
  const history = useHistory();
  const params = useParams();
  const { books, dispatch } = useContext(Context);

  const slug = params.slug;

  const selectedBook = books.find((book) => book.slug === slug);
  const date = new Date(
    selectedBook?.publishedAt ? selectedBook.publishedAt : null
  )
    .toISOString()
    .split("T")[0];
  const [bookState, setBookState] = useState(selectedBook);

  const handleOnChange = (key, value) => {
    setBookState({ ...bookState, [key]: value });
  };

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      fetch(`/v1/${slug}`, {
        headers: {
          "Content-Type": "application/json",
          accept: "applicatoin/json",
          auth: localStorage.token,
        },
        method: "PUT",
        body: JSON.stringify(bookState),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.book) {
            dispatch({
              type: EDIT_BOOK,
              payload: { slug, book: data.book },
            });
            history.push(`/show-book/${data.book.slug}`);
          }
        })
        .catch((e) => {
          dispatch({ type: FETCH_FAILED, payload: JSON.stringify(e) });
        });
    },
    [slug, bookState]
  );

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>title</label>
          <input
            onChange={(e) => handleOnChange(e.target.name, e.target.value)}
            type="text"
            name="title"
            className="form-control"
            defaultValue={selectedBook?.title}
          />
        </div>
        <div className="form-group">
          <label>page count</label>
          <input
            type="number"
            name="pageCount"
            className="form-control"
            defaultValue={selectedBook?.pageCount}
            onChange={(e) => handleOnChange(e.target.name, e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>price</label>
          <input
            type="number"
            name="price"
            className="form-control"
            defaultValue={selectedBook?.price}
            onChange={(e) => handleOnChange(e.target.name, e.target.value)}
          />
        </div>
        <div className="form-group">
          <label> publishedAt</label>

          <input
            type="date"
            name="publishedAt"
            defaultValue={date}
            className="form-control"
            onChange={(e) => handleOnChange(e.target.name, e.target.value)}
          />
        </div>
        <input className="btn btn-primary" type="submit" />
      </form>
    </div>
  );
}
