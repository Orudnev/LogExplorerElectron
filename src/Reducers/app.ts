import { Reducer } from 'redux';
import { ILogRowAction } from '../common-types';


export interface IAppSettings {
    filterSetFolderName: string;
    filterSetItemName:string;
    logRowActions:ILogRowAction[];
}
export const initAppSettings: IAppSettings = {
    filterSetFolderName:"",
    filterSetItemName:"",
    logRowActions:[]
};

export interface ISelectFilterSetFolder{
    type:"SelectFilterSetFolder",
    folderName:string,
}

export interface ISelectFilterSetItem{
    type:"SelectFilterSetItem",
    itemName:string
}

export interface ISetLogRowActions{
    type:"SetLogRowActions",
    actions: ILogRowAction[]
}



export type TAppAction = ISelectFilterSetFolder|ISelectFilterSetItem|ISetLogRowActions;

const appReducer:Reducer<IAppSettings,TAppAction> = (state = initAppSettings,action)=>{
    let newState = {...state};
    switch (action.type){
        case 'SelectFilterSetFolder':
            newState.filterSetFolderName = action.folderName;
            return newState;
            break;
        case 'SelectFilterSetItem':
            newState.filterSetItemName = action.itemName;
            return newState;
            break;
        case 'SetLogRowActions':
            newState.logRowActions = action.actions;
            return newState;
            break;
    }
    return state;
}   

export default appReducer;