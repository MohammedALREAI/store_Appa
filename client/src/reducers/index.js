import {
    FETCH_SUCCESS,
    FETCH_FAILED,
    ADD_BOOK,
    DELETE_BOOK,
    EDIT_BOOK,
    LOGIN,
    LOGOUT,
    GET_USERS,
} from '../actions/constants'
const reducer = (state, action) => {
    localStorage.setItem('lastAction', action.type)
    console.log(action.type)

    switch (action.type) {
        case FETCH_SUCCESS:
            return {
                ...state,
                books: action.payload,
                loading: false,
            }
        case FETCH_FAILED:
            console.log('error : ', action.payload)

            return {
                ...state,
                loading: false,
                error: action.payload,
            }
        case ADD_BOOK:
            return {
                ...state,
                books: [action.payload, ...state.books],
            }
        case EDIT_BOOK:
            console.log(action.payload)

            return {
                ...state,
                books: state.books.map((book) => {
                    // console.log(book.slug === action.payload.slug)
                    if (book.slug === action.payload.slug) {
                        return action.payload.book
                    } else {
                        return book
                    }
                }),
            }
        case DELETE_BOOK:
            return {
                ...state,
                books: state.books.filter(
                    (book) => book.slug !== action.payload
                ),
            }

        case LOGIN:
            return {
                ...state,
                currentUser: action.payload,
            }
        case LOGOUT:
            return {
                ...state,
                currentUser: null,
            }
        case GET_USERS:
            return {
                ...state,
                users: action.payload,
            }
        default:
            return state
    }
}
export default reducer
