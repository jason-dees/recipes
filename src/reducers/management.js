/**
 * Created by jasondees on 5/6/17.
 */
import {
    REQUEST_CATEGORIES, RECEIVE_CATEGORIES
} from '../actions/sheetsactions.js';

export default (state = {
    isFetching: false,
    categories: [] }, action) => {
    console.log(action);
    switch(action.type){
        case REQUEST_CATEGORIES:
            return {
                ...state,
                isFetching: true
            };
        case RECEIVE_CATEGORIES:
            return {
                ...state,
                isFetching: false,
                categories: action.categories,
                lastUpdated: action.receivedAt
            };
        default:
            console.log(state);
            return state;
        //get recipe list
    }
}