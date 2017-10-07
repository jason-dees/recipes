import GoogleSheet from '../GoogleSheet.js';
import Linq from '../linq.js';

export const REQUEST_CATEGORIES = 'REQUEST_CATEGORIES';
export const RECEIVE_CATEGORIES = 'RECEIVE_CATEGORIES';
export const REQUEST_DIRECTIONS = 'REQUEST_DIRECTIONS';
export const RECEIVE_DIRECTIONS = 'RECEIVE_DIRECTIONS';

export const receiveCategories = (categories) => ({
    type: RECEIVE_CATEGORIES,
    categories,
    receivedAt: Date.now()
});

export const fetchCategories = (sheetsrc) => dispatch => {
    dispatch({
        type: REQUEST_CATEGORIES,
        categories: []
    });
    let sheet = new GoogleSheet(sheetsrc, 2);
    return sheet.getSheet(() => {
        let bigList = Linq(sheet.results);
        let categories = bigList.GroupBy((c) => c.category);
        dispatch(receiveCategories(categories));
    });
};

export const receiveDirections = (directions) => ({
    type: RECEIVE_DIRECTIONS,
    directions,
    receivedAt: Date.now()
});

export const fetchDirections = (sheetsrc) => dispatch => {
    dispatch({
        type: REQUEST_DIRECTIONS,
        categories: []
    });
    let sheet = new GoogleSheet(sheetsrc, 3 );
    return sheet.getSheet(() => {
        let bigList = Linq(sheet.results);
        let directions = bigList.GroupBy((c) => c.key);
        dispatch(receiveDirections(directions));
    });
};
