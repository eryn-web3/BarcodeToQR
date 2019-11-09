import { applyMiddleware, createStore } from 'redux';
import { createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers';

import reducers from '../reducers';

const middleware = createReactNavigationReduxMiddleware(
    state => state.nav,
);

const store = createStore(
    reducers,
    applyMiddleware(middleware),
);

export default store;
