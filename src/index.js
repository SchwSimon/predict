import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore } from 'redux';

// FlushPaint reducer
import AppStore from './reducers/index';
import App from './containers/App';

import registerServiceWorker from './registerServiceWorker';

import './index.css';

// the store
let store = createStore(AppStore);

// log store changes
store.subscribe(() => {
	console.log(store.getState())
});

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
);

registerServiceWorker();
