import { useMemo, useState, useEffect } from 'react';
import { TreeItem } from 'react-complex-tree';
import { IEditorProps } from '.';
import TextField from '@mui/material/TextField';
import { SelectFromList } from '../../SelectAndEditItemList/select-and-edit-item-list';
import { GetAllFilterOperations, ITreeItemData, TFilterOperation } from '../../../gui-common-types';
import { ApiWrapper } from '../../../api-wrapper';
import { ILogRowAction } from '../../../common-types';
import { AppGlobal } from '../../../app';
import { IChoiseItemData, TextFldWithCodeCompletion } from '../../TextFldWithCodeCompletion/component';


export function DtFilter(props: IEditorProps) {
    let val = ""; let lbl = ""; let operation: TFilterOperation = 'Contains';
    let selAction = ""; let logExpr = "";
    if (!props.treeItem) {
        return (<></>);
    }
    if (props.treeItem.data && props.treeItem.data.value) {
        val = props.treeItem.data.value;
    }
    if (props.treeItem.data && props.treeItem.data.label) {
        lbl = props.treeItem.data.label;
    }
    if (props.treeItem.data && props.treeItem.data.operation) {
        operation = props.treeItem.data.operation;
    }
    if (props.treeItem.data && props.treeItem.data.actionName) {
        selAction = props.treeItem.data.actionName;
    }
    if (props.treeItem.data && props.treeItem.data.logicalExpression) {
        logExpr = props.treeItem.data.logicalExpression;
    }


    const operatorList = GetAllFilterOperations();
    const result: ITreeItemData = { ...props.treeItem.data };
    const lrActions = AppGlobal.getState().AppReducer.logRowActions;
    const lrActionNames = lrActions.map(itm => {return {label:itm.info.name,description:itm.info.description}});
    let selActionDescription:string|undefined = "";
    let selActionData = lrActionNames.find(itm => itm.label === selAction);
    if (selActionData) {
        selActionDescription = selActionData.description;
    }
    return (<div className='dt-editor'>
        <SelectFromList id='operator' itemList={operatorList.map(itm => {return {label:itm}})} caption='Operator'
            onChange={(selItem) => {
                if (props.onValueChanged) {
                    result.operation = selItem as TFilterOperation;
                    props.onValueChanged(props.treeItem, result);
                }
            }}
            selectedItem={operation} />
        <TextField id='' label='Label' value={lbl}
            onChange={(e) => {
                if (props.onValueChanged) {
                    result.label = e.target.value;
                    props.onValueChanged(props.treeItem, result);
                }
            }}
        />
        <SelectFromList id='actions' itemList={lrActionNames} caption='Action'
            onChange={(selItem) => {
                if (props.onValueChanged) {
                    result.actionName = selItem;
                    props.onValueChanged(props.treeItem, result);
                }
            }}
            selectedItem={selAction} />
        <TextField id='value' label='Value' value={val}
            onChange={(e) => {
                if (props.onValueChanged) {
                    result.value = e.target.value;
                    props.onValueChanged(props.treeItem, result);
                }
            }}
        />
        <TextFldWithCodeCompletion id='log-expr' 
            value={logExpr} 
            choiseObject={AppGlobal.ddConnector.DictObject}
            onChange={(newValue)=>{
                if (props.onValueChanged) {
                    result.logicalExpression = newValue;
                    props.onValueChanged(props.treeItem, result);
                }
            }} />
    </div>);
}

