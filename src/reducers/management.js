/**
 * Created by jasondees on 5/6/17.
 */
import {
    REQUEST_CATEGORIES, RECEIVE_CATEGORIES,
    REQUEST_DIRECTIONS, RECEIVE_DIRECTIONS
} from '../actions/sheetsactions.js';

export default (state = {
    isFetching: false,
    categories: [],
    directions: []}, action) => {
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
        case REQUEST_DIRECTIONS:
            return {
                ...state,
                isFetching: true
            };
        case RECEIVE_DIRECTIONS:
            return {
                ...state,
                isFetching: false,
                directions: action.directions,
                lastUpdated: action.receivedAt
            };
        default:
            return state;
        //get recipe list
    }
}