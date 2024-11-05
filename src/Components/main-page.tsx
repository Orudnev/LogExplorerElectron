import React, { useEffect, useState, useRef } from 'react';
import { DataGridPro, GridColDef, GridCellParams, useGridApiRef } from '@mui/x-data-grid-pro';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { ApiWrapper } from '../api-wrapper';
import { MultiSelect, Option } from './multi-select';
import { ToolbarButton, ToolbarCheckButton } from './toolbar-button';
import { ILogRow, ITreeItemSimple, LogRowResult} from '../common-types';
import { AppGlobal } from '../app';
import { AppSessionData } from './AppData';
import { FilterPanel } from './filter-panel';
import { ApplyFilterTreeResult, IFilterPanelRowValue, IFilterTreeItemResult, ITreeItemData } from '../gui-common-types';


var lastTreeItemIndex = -1;

//"proxy": "http://localhost:5000/api/",
export function MainPage() {
    let dfltRows: ILogRow[] = [];
    let dfltCurrRow: ILogRow = { id: -1, RowLineNumber: -1, Severity: "", Date: undefined, ThreadId: undefined, Comment: "" };
    const [allRowList, setAllRowList] = useState(dfltRows);
    const [rowList, setRowList] = useState(dfltRows);
    const [currRow, setCurrRow] = useState<ILogRow>(dfltCurrRow);
    const [dateFrom, setDateFrom] = React.useState<Dayjs | null>(dayjs(new Date(AppSessionData.prop('TsFromFilter'))));
    const [dateTo, setDateTo] = React.useState<Dayjs | null>(dayjs(new Date(AppSessionData.prop('TsToFilter'))));
    const [isLoading, setIsLoading] = useState(false);
    const [severityFltValue, setSeverityFltValue] = useState(AppSessionData.prop('SeverityFilter'));
    const [error, setError] = useState("");
    const datagrid = useGridApiRef();
    const appSettings = AppGlobal.getState().AppReducer;
    if (isLoading) { 
        return (<div>'Loading...'</div>);
    }
    const columns: GridColDef[] = [
        { field: 'id', headerName: '#', width: 70 },
        { field: 'Date', headerName: 'Date', width: 195 },
        { field: 'Severity', headerName: 'Type', width: 80 },
        { field: 'ThreadId', headerName: 'Thread', width: 70 },
        { field: 'Img', headerName: 'Err', width: 50 },
        { field: 'Comment', headerName: 'Comment', width: 4000 }
    ];
    if(lastTreeItemIndex == -1 ){
        //appSettings.logRowActions[0].info.
    }
    return (
        <div className='main-page'>
            <div className='main-page-toolbar'>
                <div className='main-page-toolbar__firstline'>
                    <DatePicker label="Дата начала:" value={dateFrom} onChange={(newValue) => {
                        setDateFrom(newValue);
                        AppSessionData.prop('TsFromFilter', newValue?.valueOf())
                        if (newValue && dateTo && newValue?.toDate() >= dateTo?.toDate()) {
                            setDateTo(newValue);
                            AppSessionData.prop('TsToFilter', newValue.valueOf())
                        }
                    }} />
                    <DatePicker label="Дата окончания:" value={dateTo} onChange={(newValue) => {
                        setDateTo(newValue);
                        AppSessionData.prop('TsToFilter', newValue?.valueOf())
                    }} />
                    <MultiSelect defaultValue={["Info"]} value={severityFltValue} className="severity-mselect" onChange={(evt, value) => {
                        setSeverityFltValue(value);
                        AppSessionData.prop('SeverityFilter', value);
                    }}>
                        <Option value={"Debug"}>Debug</Option>
                        <Option value={"Info"}>Info</Option>
                        <Option value={"Error"}>Error</Option>
                    </MultiSelect>
                    <ToolbarButton image='gear' toolTip='Настройки' onClick={() => { AppGlobal.navigate('/Settings'); }} size='56' />
                    <ToolbarButton image='apply' toolTip='Загрузить лог файлы' onClick={() => {
                        setIsLoading(true);
                        let tsFrom = dateFrom?.valueOf();
                        let tsTo = dateFrom?.valueOf();
                        let svr = severityFltValue.reduce((accum: string, curItm: string) => accum + curItm, "");
                        if (tsFrom && tsTo) {
                            ApiWrapper.GetLogRows(AppSessionData.prop('LogFilesFolder'), tsFrom, tsTo, svr)
                            .then(resp=>{
                                setIsLoading(false);
                                if(resp.isOk && resp.result){
                                    setAllRowList(resp.result);
                                    setRowList([...resp.result]);
                                    setError("");
                                } else {
                                    if(resp.error){
                                        setError(resp.error);
                                    }
                                }
                            })
                        }
                    }} size='56' />
                </div>
                <div className='main-page-toolbar__secondline'>
                    {error ?
                        (
                            <div className='main-page-toolbar__error'>{error}</div>)
                        : (
                            <div className='filter-panel-wrapper'>
                                <FilterPanel  dataRows={rowList}
                                    onChange={() => {
                                        ProccessLogRows(rowList);
                                        setRowList([...rowList]);
                                        // let newRows = ApplyFilter(allRowList, frows, isFilterOn, showSelItemsOnly,  grpFilter);
                                        // let cr = currRow;
                                        // let dg = datagrid;
                                        // if (newRows.length > 0) {
                                        //     setRowList(newRows);
                                        //     if (!isFilterOn && currRow && currRow.id > -1) {
                                        //         dg.current.selectRow(currRow.id, true);
                                        //         let pgSize = 100;
                                        //         let pageNum = Math.trunc(currRow.id / 100);
                                        //         let positionOnPage = currRow.id % pgSize;
                                        //         dg.current.setPageSize(pgSize);
                                        //         setTimeout(() => { 
                                        //             dg.current.setPage(pageNum);                                                    
                                        //             dg.current.scrollToIndexes({rowIndex:currRow.id});
                                        //         }, 100);
                                        //     }
                                        // }
                                    }}
                                />
                                {/* <FilterPanelTotals grpFilterValue={groupFilter} rows={rowList} onGroupFilterChanged={(flt)=>{
                                    setGroupFilter(flt);
                                    let newRows = ApplyGroupFilter(rowList,flt);
                                    if (newRows.length > 0) {
                                        setRowList(newRows);
                                    }
                                }} /> */}
                            </div>
                        )
                    }
                </div>
            </div>
            <div className='datagrid-and-details'>
                <div className='datagrid-container'>
                    <DataGridPro apiRef={datagrid}
                        disableVirtualization = {false}
                        rowHeight={25}
                        rows={rowList}
                        columns={columns}
                        getCellClassName={(params: GridCellParams<any, any, number>) => {
                            let trow = params.row as ILogRow;
                            if (params.field === 'Comment' && (trow.Result && (trow.Result & LogRowResult.highlighted) > 0)) {
                                let bckgr = "";
                                if ((trow.Result & LogRowResult.backgr1) > 0) {
                                    bckgr = "datagrid-row_highligt-stripe1";
                                }
                                if ((trow.Result & LogRowResult.backgr2) > 0) {
                                    bckgr = "datagrid-row_highligt-stripe2";
                                }
                                return `datagrid-row_highlight ${bckgr}`;
                            }
                            if (params.field === 'Img' && trow.ResultMessage) {
                                return "img-error bckgrSize24";
                            }
                            if (params.field === 'Severity' && trow.Result && (trow.Result & LogRowResult.selectedByUser)>0) {
                                return `datagrid-row_background-highlight`;
                            }                            
                            return "";
                        }}
                        onCellClick={(params, event, details) => {
                            let s = 1;
                        }}
                        onRowClick={(par, ev) => {
                            setCurrRow(par.row);
                            if(ev.nativeEvent.ctrlKey){
                                let trow = par.row as ILogRow;
                                if(!trow.Result){
                                    trow.Result = LogRowResult.selectedByUser;
                                } else {
                                    trow.Result = trow.Result | LogRowResult.selectedByUser;
                                }
                                allRowList[trow.id] = trow;
                                setRowList([...rowList]);
                                setAllRowList([...allRowList]);
                            }
                        }} />
                </div>
                <div className='datagrid-details'>
                    <div className='dg-details-comment'>
                        <div className="title">Comment</div>
                        <div className="body">{currRow.Comment}</div>
                        <div className='infolabel'>Номер строки в лог файле:<div className='infotext'>{currRow.RowLineNumber}</div></div>
                    </div>
                    {currRow.ResultMessage
                        ? (
                            <div className='dg-details-error'>
                                <div className="title">Error</div>
                                <div className="body">{currRow.ResultMessage}</div>
                            </div>
                        )
                        : (
                            <></>
                        )
                    }
                </div>
            </div>
        </div>
    );
} 

function ProccessLogRows(allRows: ILogRow[]){
    const isMatched = (item:ITreeItemSimple<ITreeItemData>,row:ILogRow)=>{
        if(!item.data || !item.data.value){
            return false;
        }
        switch(item.data.operation){
            case 'NotContain':
                return !row.Comment.includes(item.data.value);
            case 'Regex':
                let re = new RegExp(item.data.value);
                let m = re.exec(row.Comment);
                if(m){
                    return true;
                }
                break;
            case 'Contains':
            default:
                return row.Comment.includes(item.data.value);
        }
        return false;
    };
    
    const treeRows = AppGlobal.getAppSettings().filterSetItem?.filterTree;
    AppGlobal.resetCurrentTreeItemIndex();
    while(ApplyFilterTreeResult.length>0){
        ApplyFilterTreeResult.pop();
    }
    allRows.forEach(logRow=>{
        logRow.Result = LogRowResult.undefined;
        treeRows?.find(treeRow=>{
            if(isMatched(treeRow,logRow)){
                logRow.Result = LogRowResult.highlighted;
                let newRow:IFilterTreeItemResult = {
                    logRowid:logRow.id,
                    treeItemIndex:treeRow.index
                }
                ApplyFilterTreeResult.push(newRow);
                return true;                
            }
        });
    });
}

function ApplyFilter(allRows: ILogRow[], allFltRows: IFilterPanelRowValue[], isFilterOn: boolean, showSelItemsOnly:boolean, grpFilter: number): ILogRow[] {
    let skipList = allFltRows.filter(itm=>itm.mustSkip === true);
    let filterList = allFltRows.filter(itm=>itm.mustSkip === false);
    if (filterList.length === 1 && !filterList[0]) {
        return allRows;
    }
    let lastMatchedFilterRowIndex = -1;
    let lastGroupItemIndexList: number[] = []; //список индексов строк последней группы
    let isBackgr1 = true; //переключатель BackgroundColor для выделения групп полосками
    let result: ILogRow[] = [];
    let checkRowOrder = (row: ILogRow, fltIndex: number) => {
        if(!row.Result){
            row.Result = 0;
        }
        if (filterList.length === 0) {
            return;
        }
        let expectedIndex = lastMatchedFilterRowIndex + 1;
        if (expectedIndex > filterList.length - 1) {
            //группа фильтров завершена, сбрасываем индекс в 0
            expectedIndex = 0;
        }
        if (expectedIndex != fltIndex) {
            if (fltIndex !== 0) {
                row.Result = row.Result | LogRowResult.highlighted | LogRowResult.errWrongOrder;
                row.ResultMessage = `Ожидаемое значение: ${filterList[expectedIndex]}`
            } else {
                //несовпавшее значение соответствует началу очередной группы набора фильтров
                row.Result =row.Result | LogRowResult.highlighted | LogRowResult.isNewFltGroupStart; //отмечаем начало очередной группы для текущей строки
                //проверяем прошлую группу на некомплектность
                if (lastGroupItemIndexList.length > 0 && lastGroupItemIndexList.length < filterList.length) {
                    let prevGrStartRow = result[lastGroupItemIndexList[0]];
                    let r = prevGrStartRow.Result;
                    prevGrStartRow.Result = r ? r | LogRowResult.errMissingRowsInFltGroup : LogRowResult.errMissingRowsInFltGroup;
                    prevGrStartRow.ResultMessage = "Группа неполная, отсутствуют некоторые элементы";
                }
            }
        } else {
            //совпавшее значение фильтра соответствует ожидаемому
            if (expectedIndex == 0) {
                //совпавшее значение соответствует началу очередной группы набора фильтров
                row.Result = row.Result | LogRowResult.highlighted | LogRowResult.isNewFltGroupStart;
            }
        }
    }
    let setGroupStatus = () => {
        let grMembers = lastGroupItemIndexList.map(itm => result[itm]);
        let hasErrors = grMembers.some(itm =>
            itm.Result && (
                (itm.Result & LogRowResult.errWrongOrder) > 0
                || (itm.Result & LogRowResult.errMissingRowsInFltGroup) > 0
            ));
        let grStatus = hasErrors ? LogRowResult.groupIsWrong : LogRowResult.groupIsCorrect;
        grMembers.forEach(itm => {
            let v = itm.Result ? itm.Result | grStatus : grStatus;
            itm.Result = v;
        });
    };
    allRows.forEach((row, ind) => {
        if(showSelItemsOnly){
            // Показывать только строки отмеченные пользователем
            if(row.Result && (row.Result && LogRowResult.selectedByUser)>0){
                // эта строка отмечена, включаем ее в результирующий список
                result.push({...row});
            } 
            return;
        }
        let skipIndex = skipList.findIndex(skp => row.Comment.toLowerCase().includes(skp.searchCriteria.toLowerCase())); 
        if(skipIndex > -1 && isFilterOn){
            // строка содержит в себе исключающий фильтр
            // Решение : строка не будет включена в результирующий список
            return;
        }
        let fltIndex = filterList.findIndex(flt => row.Comment.toLowerCase().includes(flt.searchCriteria.toLowerCase()));
        if (fltIndex === -1 && isFilterOn) {
            // - строка не содержит в себе ни одного значения из набора фильтров
            // - фильтрация записей включена
            // Решение : строка не будет включена в результирующий список
            return;
        }
        let newRow = { ...row };
        if (fltIndex === -1 && !isFilterOn) {
            // - строка не содержит в себе ни одного значения из набора фильтров
            // - фильтрация записей отключена
            // Решение : добавляем несовпавшую строку в результирующий список
            result.push(newRow);
            return;
        }
        // строка содержит в себе значение filterList[fltIndex] 
        newRow.Result = newRow.Result?newRow.Result | LogRowResult.highlighted:LogRowResult.highlighted; // Выделяем строку (highlighted) 
        checkRowOrder(newRow, fltIndex);
        result.push(newRow);
        if ((newRow.Result & LogRowResult.isNewFltGroupStart) > 0) {
            setGroupStatus();
            lastGroupItemIndexList = [];
        }
        lastGroupItemIndexList.push(result.length - 1);
        lastMatchedFilterRowIndex = fltIndex;
    });
    if (grpFilter !== 0) {
        result = result.filter(itm => {
            return itm.Result && (itm.Result & grpFilter) > 0;
        });
    }

    result.forEach((itm, idx) => {
        //раскрашиваем группы полосками
        if (itm.Result && ((itm.Result & LogRowResult.groupIsCorrect) > 0 || ((itm.Result & LogRowResult.groupIsWrong) > 0))) {
            if (itm.Result & LogRowResult.isNewFltGroupStart) {
                isBackgr1 = !isBackgr1;
            }
            let backGr = isBackgr1 ? LogRowResult.backgr1 : LogRowResult.backgr2;
            let v = itm.Result | backGr;
            itm.Result = v;
        }
    });
    return result;
}
