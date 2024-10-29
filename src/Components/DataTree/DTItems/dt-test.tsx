import { useMemo,useState,useEffect } from 'react';
import { TreeItem } from 'react-complex-tree';
import { ITreeItemData } from '../../test-tree';
import { IEditorProps } from '.';
//import { Input } from '@mui/base/Input';

export function DtTest(props:IEditorProps){
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
    const result:ITreeItemData = {...props.treeItem.data};
    return(<div>
            <input value={props.treeItem.data.label}
                onChange={(e) => {
                    if(props.onValueChanged){   
                        result.label = e.target.value;
                        props.onValueChanged(props.treeItem,result);
                    }
                }}
            />        
            <input autoFocus={true} value={val}
                onChange={(e) => {
                    if(props.onValueChanged){
                        result.value = e.target.value;
                        props.onValueChanged(props.treeItem,result);
                    }
                }}
            />        
    </div>);
}