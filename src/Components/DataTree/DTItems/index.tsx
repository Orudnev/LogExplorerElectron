import { useState } from "react";
import { connect } from "react-redux";
import { TreeItem } from "react-complex-tree";
import { DtFilter } from "./dt-filter";
import { ToolbarButton } from "../../toolbar-button";
import { ApplyFilterTreeResult, IFilterTreeItemResult, ITreeItemData } from "../../../gui-common-types";
import Badge from '@mui/material/Badge';
import { AppGlobal } from "../../../app";
export type TEditorType = 'filter' | 'folder' | 'leaf';

export interface IEditorProps {
    treeItem: TreeItem<ITreeItemData>;
    onValueChanged?: (item: TreeItem<ITreeItemData>, newValue: ITreeItemData) => void;
}

export type TDtItemToolbarCommand = 'add' | 'delete' | 'clearSelection';
export function GetDtItemToolbar<T>(item: T, allowDelete: boolean,
    onToolbarButtonClick?: (btnCommand: TDtItemToolbarCommand) => void) {
    const selectedItem = item as TreeItem<ITreeItemData>;
    const handleClick = (btnCmd: TDtItemToolbarCommand) => {
        if (onToolbarButtonClick) {
            onToolbarButtonClick(btnCmd);
        }
    }
    let noselection = selectedItem ? false : true;
    if (!selectedItem) {
        return (
            <div className='dtree_item-toolbar'>
                <ToolbarButton toolTip='Добавить корневой элемент' image='plus' size='24' class='toolbar-button' onClick={() => { handleClick('add') }} />
            </div>
        );
    }
    let selLogRow = AppGlobal.getState().AppReducer.selectedLogRowUid;
    let currTitemResults = ApplyFilterTreeResult.filter(resItm => resItm.treeItemIndex == selectedItem.index);
    return (
        <div className='dtree_item-toolbar'>
            <ToolbarButton toolTip='Добавить вложенный элемент' image='plus' size='24' class='toolbar-button' onClick={() => { handleClick('add') }} />
            {allowDelete && <ToolbarButton toolTip='Удалить выделенный элемент' image='cancel' size='24' class='toolbar-button' onClick={() => { handleClick('delete') }} />}
            <ToolbarButton toolTip='Сбросить отметку выделенного элемента' image='selitems-off' size='24' class='toolbar-button' onClick={() => { handleClick('clearSelection') }} />
            {currTitemResults.length > 0
                ? <UpDnNavigator fltResults={currTitemResults} onNavigate={(delta: number) => {
                    let currTResultIndex = GetTreeFilterResultIndex(currTitemResults);
                    let newTResultIndex = currTResultIndex + delta;
                    if (-1 < newTResultIndex && newTResultIndex < currTitemResults.length) {
                        let newLogRowIndex = currTitemResults[newTResultIndex].logRowid;
                        AppGlobal.dispatch({ type: 'SelectLogRow', uid: newLogRowIndex });
                        return true;
                    }
                    return false;
                }} />
                : null
            }
        </div>
    );
}

// Вычисляет номер строки в списке результатов по выбранной строке в дата гриде
function GetTreeFilterResultIndex(fltResults: IFilterTreeItemResult[]) {
    let selectedLogRowIndex = AppGlobal.getState().AppReducer.selectedLogRowUid as number;
    let tResultIndex = fltResults.findIndex(fr => fr.logRowid === selectedLogRowIndex);
    return tResultIndex;
}


function UpDnNavigatorImpl(props: { fltResults: IFilterTreeItemResult[], onNavigate: (delta: number) => boolean }) {
    let tResultIndex = GetTreeFilterResultIndex(props.fltResults);
    if (tResultIndex > -1) {
        return (
            <div className="updn-navigator">
                <Badge badgeContent={<div>{tResultIndex + 1}</div>} color="info" max={999}>
                    <ToolbarButton toolTip='' image='up' size='24' class='toolbar-button' onClick={() => {
                        props.onNavigate(-1);
                    }} />
                    <ToolbarButton toolTip='' image='down' size='24' class='toolbar-button' onClick={() => {
                        props.onNavigate(1);
                    }} />
                </Badge>
            </div>
        );
    } else {
        return (
            <div className="updn-navigator">
                <Badge color="info" max={999}>
                    <ToolbarButton toolTip='' image='up' size='24' class='toolbar-button' onClick={() => {
                        props.onNavigate(-1);
                    }} />
                    <ToolbarButton toolTip='' image='down' size='24' class='toolbar-button' onClick={() => {
                        props.onNavigate(1);
                    }} />
                </Badge>
            </div>
        );
    }
}

const mapStateToProps = (state: any, ownProps: any) => {
    return state;
}

const UpDnNavigator = connect(mapStateToProps)(UpDnNavigatorImpl);

export function GetDtItemEditor<T>(dtItemType: TEditorType, genProps: T,
    onValueChange?: (item: TreeItem<ITreeItemData>, newValue: ITreeItemData) => void) {
    const props: IEditorProps = {
        treeItem: genProps as TreeItem<ITreeItemData>,
        onValueChanged: onValueChange
    }

    switch (dtItemType) {
        case "filter":
            return (<DtFilter {...props} />);
        default:
            return (<></>);
    }
}

