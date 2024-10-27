import actionTypes from "../actions/actionTypes";
const initState = {
    posts: [],
    msg: '',
    count: 0,
    newPosts: [],
    savedPosts: [],
}

const postReducer = (state = initState, action) => {
    switch (action.type) {
        case actionTypes.GET_POSTS:
        case actionTypes.GET_POSTS_LIMIT:
            return {
                ...state,
                posts: action.posts || [],
                msg: action.msg || '',
                count: action.count || 0
            }
        case actionTypes.GET_NEW_POST:
            return {
                ...state,
                msg: action.msg || '',
                newPosts: action.newPosts || []
            }



        case actionTypes.FETCH_SAVED_POSTS_SUCCESS:
            return {
                ...state,
                savedPosts: action.payload,
                error: null
            };
        case actionTypes.FETCH_SAVED_POSTS_FAILURE:
            return {
                ...state,
                error: action.payload
            };
        case actionTypes.DELETE_SAVED_POST_SUCCESS:
            return {
                ...state,
                savedPosts: state.savedPosts.filter(post => post.Post.id !== action.payload),
                error: null
            };
        case actionTypes.DELETE_SAVED_POST_FAILURE:
            return {
                ...state,
                error: action.payload
            };
        default:
            return state;
    }

}

export default postReducer