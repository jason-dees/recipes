import GoogleSheet from '../GoogleSheet.js';
import Linq from '../linq.js';

export const REQUEST_CATEGORIES = 'REQUEST_POSTS';
export const RECEIVE_CATEGORIES = 'RECEIVE_POSTS';

export const receiveCategories = (categories) => ({
    type: RECEIVE_CATEGORIES,
    categories,
    receivedAt: Date.now()
});

export const fetchCategories = sheetsrc => dispatch => {
    dispatch({
        type: REQUEST_CATEGORIES,
        categories: []
    });
    let sheet = new GoogleSheet(sheetsrc);
    return sheet.getSheet(() => {
        let bigList = Linq(sheet.results);
        let categories = bigList.GroupBy((c) => c.category);
        receiveCategories(categories);
    });
};