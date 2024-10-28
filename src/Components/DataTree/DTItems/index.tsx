import { TreeItem } from "react-complex-tree";
import { ITreeItemData } from "../../test-tree";
import { IDataTreeProps } from "../component";
import { DtTest } from "./dt-test";

export type TDtItemType = 'test'|'folder'|'leaf';

export interface IDtItem{
    type:TDtItemType;
}


export function GetDtItemEditor<T>(dtItemType:TDtItemType, gprops:T){
    const props = gprops as TreeItem<ITreeItemData>;
    switch (dtItemType){
        case "test":
            return (<DtTest {...props}/>);
        default:
            return (<></>); 
    }
}