import { TreeItemIndex } from "react-complex-tree";
import { IFilterSetBase, ILogRow, ILogRowAction, ITreeItemSimple } from "./common-types";


export interface IFilterPanelRowValue {
    searchCriteria:string;
    mustSkip:boolean;
}

export interface ITreeItemData {
    operation:TFilterOperation;
    label?:string,
    value:string;
    logicalExpression?:string;
    actionName?:string;
  }

export interface IFilterPanelRow {
    rows: IFilterPanelRowValue[];
    index: number;
    onChangedValue: (index: number, newValue: IFilterPanelRowValue) => void;
    onDeleteRowBtnClick: (index: number) => void;
    onAddRowBtnClick: () => void;
    onMoveRowUp:(index:number) => void;
    onMoveRowDown:(index:number) => void;
  }

export interface IFilterPanel {
    filterTree?:ITreeItemSimple<ITreeItemData>[];
    dataRows: ILogRow[];
    onChange: () => void;
  }

const FILTER_OPERATIONS = {
    Contains:'',
    NotContain:'',
    Regex:''
};


export type TFilterSet = IFilterSetBase<ITreeItemData>;
  
export type TFilterOperation = keyof typeof FILTER_OPERATIONS;

export function GetAllFilterOperations():string[]{
  let result = [];
  for(const opr in FILTER_OPERATIONS){
      result.push(opr);
  }
  return result;
}

export interface IFilterTreeItemResult{
  logRowid:number;
  treeItemIndex:TreeItemIndex;
  error?:string;
}

export const ApplyFilterTreeResult:IFilterTreeItemResult[] = [];

  