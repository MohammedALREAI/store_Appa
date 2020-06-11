import React, { useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../stateProvider";
import { FETCH_FAILED } from "../actions/constants";
import StripeCheckout from "react-stripe-checkout";
import Axios from "axios";
import { toast } from "react-toastify";

export default function Book(props) {
  const history = useHistory();
  const params = useParams();
  const [imgExists, setImgExists] = useState(false);
  const { removeBook, books, dispatch } = useContext(Context);

  let slug = props?.book?.slug || params.slug;

  const book = books.find((book) => book.slug === slug);
  const image = new Image();
  image.src = `/files/${book.imgName}`;
  image.onloadeddata = () => {
    setImgExists(true);
  };

  const handleStripeToken = async (token) => {
    console.log(token);
    const response = await Axios.post("/v1/ckeckout", { token, book });
    const { status, error } = response.data;
    console.log("res: ", response);

    if (status == "success") {
      console.log(status);

      toast("success chck  for details", {
        type: "success",
      });
    } else {
      console.log("called");

      toast("failed", {
        type: "error",
      });
    }
  };
  const sendDeleteReq = () => {
    fetch(`/v1/${book.slug}`, {
      method: "DELETE",
      headers: {
        auth: localStorage.token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          removeBook(book.slug);
          history.push("/");
        }
      })
      .catch((e) => {
        dispatch({ type: FETCH_FAILED, bayload: e });
        console.log(e.msg);
      });
  };

  return book ? (
    <div className="bookComponent card my-4 col-md-3">
      <div className="card-body">
        {imgExists ? (
          <img
            className="card-img-top"
            src={`/files/${book.imgName}`}
            alt="book image"
          />
        ) : (
          <div className="backup-img">no img</div>
        )}
        <div className="card-title">title: {props.book.title}</div>
        <div className="card-subtitle ">
          publidhedAt: {props.book.publishedAt.split("T")[0]}
        </div>
        <div className="card-text">pageCount: {props.book.pageCount}</div>
        <div className="card-text">price: {props.book.price}</div>
        <div className="book-buttons">
          {props.auth && (
            <Link className="btn btn-secondary" to={`/edit/${props.book.slug}`}>
              Edit
            </Link>
          )}
          {props.auth && (
            <button className="btn btn-danger" onClick={sendDeleteReq}>
              Delete
            </button>
          )}

          {!props.auth && (
            <StripeCheckout
              stripeKey={"pk_test_gyV4dJkq6dTNRWFIu0wS81o300iZXbLYju"}
              token={handleStripeToken}
              amount={book.price * 100}
              name={book.title}
            />
          )}
        </div>
      </div>
    </div>
  ) : (
    <div>Error : Book doesn't exist</div>
  );
}
