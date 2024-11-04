export enum LogRowResult {
  undefined = 0,
  highlighted = 1,
  backgr1 = 2,
  backgr2 = 4,
  isNewFltGroupStart = 8, //Строка содержит в себе значение указанное в первой строке набора фильтров
  errMissingRowsInFltGroup = 16,
  errWrongOrder = 32,
  groupIsCorrect = 64,
  groupIsWrong = 128,
  selectedByUser = 256
}

export interface ILogRow {
  id: number;
  RowLineNumber: number;
  Severity: string;
  Date: Date | undefined;
  ThreadId: number | undefined;
  Comment: string;
  SelectedMark?: number;
  Result?: LogRowResult;
  ResultMessage?: string;
}

export interface IApiResponse {
  response: any;
  error: any;
}

type TTreeItemIndex = string | number

export interface ITreeItemSimple<T>{
  index:TTreeItemIndex;
  isFolder?:boolean
  children?:Array<TTreeItemIndex>;
  data?:T;
}

export interface IFilterSetBase<T>{
  name:string;
  description:string;
  filterTree:ITreeItemSimple<T>[];
}

export interface IFilterSetFolder {
  name: string;
  description: string;
  filterSetList: IFilterSetBase<any>[];
}

export interface IActionInfo{
  name:string;
  description?:string;
}

export interface ILogRowAction{
  info:IActionInfo;
  jsSourceCode:string;
}



