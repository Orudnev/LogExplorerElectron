import { TreeItem } from "react-complex-tree";
import { DtFilter } from "./dt-filter";
import { ToolbarButton } from "../../toolbar-button";
import { ITreeItemData } from "../../../common-types";

export type TEditorType = 'filter'|'folder'|'leaf';

export interface IEditorProps {
    treeItem: TreeItem<ITreeItemData>;
    onIndexChanged?: (item:TreeItem<ITreeItemData>,newValue:number)=>void;
    onValueChanged?: (item:TreeItem<ITreeItemData>,newValue:ITreeItemData)=>void;
}  

export type TDtItemToolbarCommand = 'add'|'delete'|'clearSelection';
export function GetDtItemToolbar<T>(item:T,allowDelete:boolean,
    onToolbarButtonClick?:(btnCommand: TDtItemToolbarCommand)=>void){
    const selectedItem = item as TreeItem<ITreeItemData>; 
    const handleClick = (btnCmd:TDtItemToolbarCommand) =>{
        if(onToolbarButtonClick){
            onToolbarButtonClick(btnCmd);
        }
    }
    let noselection = selectedItem?false:true;
    if(!selectedItem){
        return(
            <div className='dtree_item-toolbar'>
                <ToolbarButton toolTip='Добавить корневой элемент' image='plus' size='24' class = 'toolbar-button' onClick={()=>{handleClick('add')}} />
            </div>        
        );
    }
    return(
        <div className='dtree_item-toolbar'>
            <ToolbarButton toolTip='Добавить вложенный элемент' image='plus' size='24' class = 'toolbar-button' onClick={()=>{handleClick('add')}} />
            {allowDelete&&<ToolbarButton toolTip='Удалить выделенный элемент' image='cancel' size='24' class = 'toolbar-button' onClick={()=>{handleClick('delete')}} />}
            <ToolbarButton toolTip='Сбросить отметку выделенного элемента' image='selitems-off' size='24' class = 'toolbar-button' onClick={()=>{handleClick('clearSelection')}} />
        </div>        
    );
}

export function GetDtItemEditor<T>(dtItemType:TEditorType, genProps:T,
    onValueChange?:(item:TreeItem<ITreeItemData>,newValue:ITreeItemData)=>void){
    const props:IEditorProps = {
        treeItem: genProps as TreeItem<ITreeItemData>,
        onValueChanged:onValueChange
    } 

    switch (dtItemType){
        case "filter":
            return (<DtFilter {...props}/>);
        default:
            return (<></>); 
    }
}

