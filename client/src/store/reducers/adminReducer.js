import actionTypes from "../actions/actionTypes";

const initialState = {
    users: [],
    upgradeRequests: [],
    pagination: {},
    loading: false,
    typePosts: [],
};

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_USERS_SUCCESS:
            return {
                ...state,
                users: action.payload,
            };
        case actionTypes.DELETE_USER_SUCCESS:
            return {
                ...state,
                users: state.users.filter(user => user.id !== action.payload),
            };
        case actionTypes.UPDATE_USER_SUCCESS:
            return {
                ...state,
                users: state.users.map(user => user.id === action.payload.id ? action.payload : user),
            };



        case actionTypes.FETCH_UPGRADE_REQUESTS_SUCCESS:
            return {
                ...state,
                upgradeRequests: action.payload,
                pagination: action.pagination,
                error: null
            };
        case actionTypes.FETCH_UPGRADE_REQUESTS_FAILURE:
            return {
                ...state,
                error: action.payload
            };
        // Fetch Type Posts
        case actionTypes.FETCH_TYPE_POSTS_REQUEST:
            return { ...state, loading: true, error: null };
        case actionTypes.FETCH_TYPE_POSTS_SUCCESS:
            return {
                ...state,
                loading: false,
                typePosts: action.payload,
                error: null,
            };
        case actionTypes.FETCH_TYPE_POSTS_FAILURE:
            return { ...state, loading: false, error: action.payload };

        // Create Type Post
        case actionTypes.CREATE_TYPE_POST_REQUEST:
            return { ...state, loading: true, error: null };
        case actionTypes.CREATE_TYPE_POST_SUCCESS:
            return {
                ...state,
                loading: false,
                typePosts: [action.payload, ...state.typePosts],
                error: null,
            };
        case actionTypes.CREATE_TYPE_POST_FAILURE:
            return { ...state, loading: false, error: action.payload };

        // Update Type Post
        case actionTypes.UPDATE_TYPE_POST_REQUEST:
            return { ...state, loading: true, error: null };
        case actionTypes.UPDATE_TYPE_POST_SUCCESS:
            return {
                ...state,
                loading: false,
                typePosts: state.typePosts.map((post) =>
                    post.id === action.payload.id ? action.payload : post
                ),
                error: null,
            };
        case actionTypes.UPDATE_TYPE_POST_FAILURE:
            return { ...state, loading: false, error: action.payload };

        // Delete Type Post
        case actionTypes.DELETE_TYPE_POST_REQUEST:
            return { ...state, loading: true, error: null };
        case actionTypes.DELETE_TYPE_POST_SUCCESS:
            return {
                ...state,
                loading: false,
                typePosts: state.typePosts.filter((post) => post.id !== action.payload),
                error: null,
            };
        case actionTypes.DELETE_TYPE_POST_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default adminReducer;