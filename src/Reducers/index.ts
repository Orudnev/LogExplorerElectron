import {applyMiddleware, Reducer,combineReducers,createStore,Store} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import AppReducer,{IAppSettings,TAppAction} from './app'; 

const rootReducer = combineReducers({
    AppReducer
});

export type TAllActions = TAppAction;

export interface IAppState{
    AppReducer:IAppSettings
}


const middleware = [thunk];
export const store = createStore(rootReducer,undefined,composeWithDevTools(applyMiddleware(...middleware)));