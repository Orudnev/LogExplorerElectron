import { Reducer } from 'redux';
import { IFilterSetBase, ILogRowAction } from '../common-types';
import { ITreeItemData } from '../gui-common-types';


export interface IAppSettings {
    filterSetItem:IFilterSetBase<ITreeItemData>|undefined;
    filterSetFolderName: string;
    logRowActions:ILogRowAction[];
}
export const initAppSettings: IAppSettings = {
    filterSetFolderName:"",
    filterSetItem:undefined,
    logRowActions:[]
};

export interface ISelectFilterSetFolder{
    type:"SelectFilterSetFolder",
    folderName:string,
}

export interface ISelectFilterSetItem{
    type:"SelectFilterSetItem",
    item:IFilterSetBase<ITreeItemData>
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
            newState.filterSetItem = action.item;
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