import { Reducer } from 'redux';
import { IFilterSetBase, ILogRowAction } from '../common-types';
import { ITreeItemData } from '../gui-common-types';
import { GridRowId } from '@mui/x-data-grid-pro';


export interface IAppSettings {
    filterSetItem:IFilterSetBase<ITreeItemData>|undefined;
    filterSetFolderName: string;
    logRowActions:ILogRowAction[];
    selectedLogRowUid:GridRowId;
}
export const initAppSettings: IAppSettings = {
    filterSetFolderName:"",
    filterSetItem:undefined,
    logRowActions:[],
    selectedLogRowUid:-1
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

export interface ISelectLogRow{
    type:"SelectLogRow",
    uid:GridRowId
}



export type TAppAction = ISelectFilterSetFolder|ISelectFilterSetItem|ISetLogRowActions|ISelectLogRow;

const appReducer:Reducer<IAppSettings,TAppAction> = (state = initAppSettings,action)=>{
    let newState = {...state};
    switch (action.type){
        case 'SelectFilterSetFolder':
            newState.filterSetFolderName = action.folderName;
            return newState;
        case 'SelectFilterSetItem':
            newState.filterSetItem = action.item;
            return newState;
        case 'SetLogRowActions':
            newState.logRowActions = action.actions;
            return newState;
        case 'SelectLogRow':
            newState.selectedLogRowUid = action.uid;
            return newState;
    }
    return state;
}   

export default appReducer;