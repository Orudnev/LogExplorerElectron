import { useMemo,useState,useEffect } from 'react';
import { TreeItem } from 'react-complex-tree';
import { GetAllFilterOperations, ITreeItemData, TFilterOperation } from '../../test-tree';
import { IEditorProps } from '.';
import TextField from '@mui/material/TextField';
import { SelectFromList } from '../../SelectAndEditItemList/select-and-edit-item-list';


export function DtFilter(props:IEditorProps){
    let val = "";let lbl = "";
    if(!props.treeItem){
        return (<></>);
    }
    if(props.treeItem.data.value){
        val = props.treeItem.data.value;
    }
    if(props.treeItem.data.label){
        lbl = props.treeItem.data.label;
    } 
    const operatorList = GetAllFilterOperations();
    const result:ITreeItemData = {...props.treeItem.data};
    return(<div className='dt-editor'>
            <SelectFromList id='operator' itemList={operatorList} caption='Operator' 
                onChange={(selItem)=>{
                    if(props.onValueChanged){
                        result.operation = selItem as TFilterOperation;
                        props.onValueChanged(props.treeItem,result);
                    }
                }} 
            selectedItem={props.treeItem.data.operation} />
            <TextField id='' label='Label' value={props.treeItem.data.label}
                onChange={(e) => {
                    if(props.onValueChanged){   
                        result.label = e.target.value;
                        props.onValueChanged(props.treeItem,result);
                    }
                }} 
            />
            <TextField id='value' label='Value' value={val}
                onChange={(e) => {
                    if(props.onValueChanged){
                        result.value = e.target.value;
                        props.onValueChanged(props.treeItem,result);
                    }
                }}
            />        
    </div>);
}