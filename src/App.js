import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import './App.css';
import RecipeCategoryTable from './components/RecipeCategoryTable.js';
import management from './reducers/management.js';

const middleware = [ thunk ];

const store = createStore(
    management,
    applyMiddleware(...middleware)
);

class App extends Component {
    render() {
        return (
            <div>
                <Provider store={store}>
                    <RecipeCategoryTable />
                </Provider>
            </div>
        );
    }
}

export default App;