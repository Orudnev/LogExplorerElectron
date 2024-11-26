import React, { useEffect, useState, useRef } from 'react';
import { Input } from '@mui/base/Input';
import { SelectAndEditItemList } from './SelectAndEditItemList/select-and-edit-item-list';
import { ToolbarButton, ToolbarCheckButton } from './toolbar-button';
//import * as Api from '../api-wrapper';
import { ApiWrapper } from '../api-wrapper';
import { IFilterPanel, IFilterPanelRow,TFilterSet  } from '../gui-common-types';
import { AppSessionData } from './AppData';
import { DataTree, IDataTreeAPI, emptyTreeData } from './DataTree/component';
import { IFilterSetFolder } from '../common-types';
import { AppGlobal } from '../app';



function FilterPanelRow(props: IFilterPanelRow) {
    const [value, setValue] = useState(props.rows[props.index]);
    useEffect(() => {
        setValue(props.rows[props.index]);
    }, [props]);
    let plusbtn = <></>;
    let minusbtn = <></>;
    let upbtn = <></>;
    let downbtn = <></>;
    let trashbtn = <ToolbarCheckButton
        toolTip='Пропускать строки содержащие указанное значение'
        imageOn='trash-on'
        imageOff='trash-off'
        image='cancel'
        size='24'
        value={value.mustSkip}
        onClick={() => {
            let currRow = { ...value };
            currRow.mustSkip = !currRow.mustSkip;
            setValue(currRow);
            props.onChangedValue(props.index, currRow);
        }} />

    if (props.rows.length > 1) {
        minusbtn = <ToolbarButton toolTip='Удалить строку' image='minus' size='24' class='filter-row__button' onClick={() => {
            props.onDeleteRowBtnClick(props.index);
        }} />
    }
    if (props.index > 0) {
        upbtn = <ToolbarButton toolTip='Переместить строку вверх' image='up' size='24' class='filter-row__button' onClick={() => {
            props.onMoveRowUp(props.index);
        }} />
    }
    if (props.index < props.rows.length - 1) {
        downbtn = <ToolbarButton toolTip='Переместить строку вниз' image='down' size='24' class='filter-row__button' onClick={() => {
            props.onMoveRowDown(props.index);
        }} />
    }
    if (props.index === props.rows.length - 1) {
        plusbtn = <ToolbarButton toolTip='Добавить строку' image='plus' size='24' class='filter-row__button' onClick={() => {
            props.onAddRowBtnClick();
        }} />
    }

    return (
        <div className='filter-row'>
            <div className='filter-row__id'>{props.index}</div>
            <Input autoFocus={true} className='filter-row__input' value={value.searchCriteria}
                onChange={(e) => {
                    let newSearchCriteria = e.currentTarget.value;
                    let currRow = props.rows[props.index];
                    currRow.searchCriteria = newSearchCriteria;
                    setValue({ ...currRow });
                    props.onChangedValue(props.index, currRow);
                }}
            />
            {minusbtn}
            {plusbtn}
            {upbtn}
            {downbtn}
            {trashbtn}
        </div>
    );
}


export function FilterPanel(props: IFilterPanel) {
    const [filterTree, setFilterTree] = useState(props.filterTree);
    const [filterFileContent, setFilterFileContent] = useState<IFilterSetFolder[]>([]);
    const [selectedFolder, setSelectedFolder] = useState('');
    const [selectedFilterSet, setSelectedFilterSet] = useState('');
    const dataTreeRef = useRef<IDataTreeAPI>(null);
    const loadLogRowActions = (folderName:string)=>{
        if(folderName){
            ApiWrapper.GetActions(folderName)
            .then(response=>{
                if(response.result){
                    AppGlobal.dispatch({type:'SetLogRowActions',actions:response.result})
                }
            })
            .catch(err=>{
                let s = err;
            });                            
        }        
    }; 
    useEffect(() => {
        ApiWrapper.LoadFilterSetFile() 
            .then((flist) => {
                if (true) {
                    setFilterFileContent(flist);
                    let storedFolder =
                        flist.find(itm => itm.name.toLocaleLowerCase() === AppSessionData.prop('LastSelectedFolder').toLocaleLowerCase());
                    if (storedFolder) {
                        setSelectedFolder(storedFolder.name);
                        AppGlobal.dispatch({type:'SelectFilterSetFolder',folderName:storedFolder.name});
                        loadLogRowActions(storedFolder.name);
                        let storedFset =
                            storedFolder.filterSetList
                                .find(itm => itm.name.toLocaleLowerCase() === AppSessionData.prop('LastSelectedFilterSet').toLocaleLowerCase());
                        if (storedFset) {
                            setSelectedFilterSet(storedFset.name);
                            AppGlobal.dispatch({type:'SelectFilterSetItem',item:storedFset});
                            setFilterTree(storedFset.filterTree);
                        }
                    }
                }
            })
    }, []);
    let folderList = filterFileContent.length > 0 ? filterFileContent.map(itm => itm.name) : [];
    let selectedFolderListItem = (folderList.length > 0 && selectedFolder) ? filterFileContent.find(itm => itm.name === selectedFolder) : undefined;
    let filterSetList: string[] = [];
    let getFilterSet = (fsetName: string, folderName: string = selectedFolder) => {
        let result = undefined;
        let folderItem = filterFileContent.find(itm => itm.name === folderName);
        if (folderItem) {
            result = folderItem.filterSetList.find(itm => itm.name === fsetName);
        }
        return result;
    };
    let saveFolder = () => {
        if(!dataTreeRef.current){
            return;
        }
        let treeData = dataTreeRef.current.serialize();
        let fset = getFilterSet(selectedFilterSet);
        if (fset) {
            fset.filterTree = treeData;
        }
        let folderItem = filterFileContent.find(itm => itm.name === selectedFolder);
        if (folderItem) {
            ApiWrapper.SaveFolder(folderItem)
            .then(response=>{
                let s = 1;
            });
        }
    }


    if (selectedFolderListItem) {
        filterSetList = selectedFolderListItem.filterSetList.map(itm => itm.name);
    } else {
        filterSetList = [];
    }

    return (
        <div className='filter-panel'>
            <div className="border-label-font">Панель набора фильтров</div>
            <div className='filter-rows-toolbar'>
                <SelectAndEditItemList
                    itemList={folderList}
                    caption='Выбор папки'
                    selectedItem={selectedFolder} onSelected={(selFolder) => {
                        setSelectedFolder(selFolder);
                        AppGlobal.dispatch({type:'SelectFilterSetFolder',folderName:selFolder});
                        loadLogRowActions(selFolder);
                        if (!selFolder) {
                            setSelectedFilterSet('');
                        }
                    }}
                    onAdd={(item) => {
                        let newItem: IFilterSetFolder = {
                            name: item,
                            description: '',
                            filterSetList: [{ name: 'default', description: '', filterTree: emptyTreeData }]
                        };
                        filterFileContent.push(newItem);
                        setSelectedFolder(item);
                        AppGlobal.dispatch({type:'SelectFilterSetFolder',folderName:item});
                        loadLogRowActions(item);
                    }}
                    onDelete={(item) => {
                        let newFilterFileContent = filterFileContent.filter(itm => itm.name.toLowerCase() !== item);
                        setFilterFileContent(newFilterFileContent);
                        setSelectedFolder("");
                        AppGlobal.dispatch({type:'SelectFilterSetFolder',folderName:""});
                    }}
                />
                <SelectAndEditItemList
                    itemList={filterSetList}
                    caption='Выбор набора фильтров'
                    selectedItem={selectedFilterSet}
                    onSelected={(selFset) => {
                        setSelectedFilterSet(selFset);
                        let fsetItem = getFilterSet(selFset)
                        if (fsetItem) {
                            AppSessionData.prop('LastSelectedFolder', selectedFolder);
                            AppSessionData.prop('LastSelectedFilterSet', selFset);
                            AppGlobal.dispatch({type:'SelectFilterSetItem',item:fsetItem});
                            setFilterTree(undefined);  
                            setTimeout(() => {
                                setFilterTree(fsetItem?.filterTree);                                
                            }, 0);                             
                        }
                    }}
                    onAdd={(item) => {
                        let newItem: TFilterSet = {
                            name: item,
                            description: '',
                            filterTree: emptyTreeData
                        }
                        let folderItem = filterFileContent.find(itm => itm.name === selectedFolder);
                        if (folderItem) {
                            folderItem.filterSetList.push(newItem);
                            setSelectedFilterSet(item);
                            AppGlobal.dispatch({type:'SelectFilterSetItem',item:newItem});
                        }
                    }}
                    onDelete={(item) => {
                        let folderItem = filterFileContent.find(itm => itm.name === selectedFolder);
                        if (folderItem) {
                            folderItem.filterSetList = folderItem.filterSetList.filter(itm => itm.name !== item);
                        }
                    }}
                />
                <ToolbarButton toolTip='Применить изменения' image='apply' size='48' onClick={() => {
                    loadLogRowActions(selectedFolder);
                    props.onChange();                    
                }} />
                <ToolbarButton toolTip='Сохранить' image='save' size='48' onClick={() => {
                            saveFolder();
                        }} />                

            </div> 
            { (filterTree)
                ?<DataTree ref={dataTreeRef} srcTreeData={filterTree} />
                :<></>
            }
        </div>
    );
}




{/* <div className='filter-row-list'>
{frows.map((itm, idx) => {
    return <FilterPanelRow key={idx}
        rows={frows}
        index={idx}
        onChangedValue={(index, newValue) => {
            frows[index] = newValue;
        }}
        onAddRowBtnClick={() => {
            let newRowSet = [...frows];
            newRowSet.push({ searchCriteria: "", mustSkip: false });
            setFrows(newRowSet);
        }}
        onDeleteRowBtnClick={(ind) => {
            let newRowSet: IFilterPanelRowValue[] = [];
            frows.forEach((r, i) => {
                if (i === ind) {
                    return;
                }
                newRowSet.push(r);
            });
            setFrows(newRowSet);
        }}
        onMoveRowUp={(index) => {
            if (index > 0) {
                let prevRow = frows[index - 1];
                frows[index - 1] = frows[index];
                frows[index] = prevRow;
                setFrows([...frows]);
            }
        }}
        onMoveRowDown={(index) => {
            if (index < frows.length - 1) {
                let nextRow = frows[index + 1];
                frows[index + 1] = frows[index];
                frows[index] = nextRow;
                setFrows([...frows]);
            }

        }}

    />;
})}
</div> */}
