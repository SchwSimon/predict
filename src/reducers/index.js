import { combineReducers } from 'redux';
import predict from './Predict';
import settings from './Settings';

const AppStore = combineReducers({
	predict,
	settings
});

export default AppStore;
