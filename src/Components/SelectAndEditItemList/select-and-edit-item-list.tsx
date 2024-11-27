import './select-and-edit-item-list.css';
import React, { useEffect, useState, useRef, Children } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ToolbarButton } from '../toolbar-button';
import { Input } from '@mui/base/Input';
import Popover from '@mui/material/Popover';


interface ISelectedItemData{
    label:string;
    description?:string;
}

interface ISelectFromList {
    itemList: ISelectedItemData[];
    selectedItem: string;
    caption: string;
    onChange: (selItem: string) => void;
    id?:string;
}

export function SelectFromList(props: ISelectFromList) {
    const [selectedItem, setSelectedItem] = React.useState(props.selectedItem);
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const items: any[] = [];
    items.push(<MenuItem value="" onMouseOver={()=>{
        setAnchorEl(null)
    }} ><em>Очистить</em></MenuItem>);
    props.itemList.forEach((itm, index) => {
        let newItem = <MenuItem key={index} value={itm.label} 
                        onMouseOver={(e)=>{
                            if(itm.description){
                                console.log(itm.description);
                                let evt = e;
                                setAnchorEl(evt.currentTarget);  
                                //setAnchorEl(e.currentTarget);
                            } else {
                                //setAnchorEl(null);
                            }
                        }}
                       >{itm.label}</MenuItem>;
        items.push(newItem);
    });
    let selectedItemDescription:string|undefined = "";
    if (anchorEl) {
        let mouseOverElmCaption = anchorEl.innerText;
        let mouseOverItemData = props.itemList.find(itm => itm.label === mouseOverElmCaption);
        if (mouseOverItemData) {
            selectedItemDescription = mouseOverItemData.description;
        }           
    }
    useEffect(() => { 
        setSelectedItem(props.selectedItem) 
    }, [props.itemList,props.selectedItem]);
    const id = anchorEl?"description":undefined;
    return (
        <FormControl id={props.id} fullWidth={false}  sx={{ m: 1, minWidth: 250 }} size="small">
            <InputLabel id="demo-select-small-label">{props.caption}</InputLabel>
            <Select className='myselect'
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={selectedItem}
                label={props.caption}
                onChange={(ev) => {
                    setSelectedItem(ev.target.value);
                    props.onChange(ev.target.value);
                }} >
                {items}
                {anchorEl
                    ? <div className='popup-description' style={{top:anchorEl.offsetTop+10+"px",left:180+"px"}} >{selectedItemDescription}</div>
                    :<div/>
                }
            </Select>
        </FormControl >
    );
}

export interface ISelectAndEditItemList {
    itemList: string[];
    caption: string;
    selectedItem: string;
    onSelected: (selItem: string) => void;
    onAdd:(item:string) => void;
    onDelete:(item:string)=>void;
}

type TSelectFilterFolterMode = 'Select' | 'AddNewItem';
export function SelectAndEditItemList(props: ISelectAndEditItemList) {
    const caption = "Выбор папки";
    const [newItemName, setNewItemName] = React.useState('');
    const [mode, setMode] = useState<TSelectFilterFolterMode>('Select');
    const [selectedItem, setSelectedItem] = React.useState("");
    const [itmList, setItmList] = useState<ISelectedItemData[]>(props.itemList.map(itm=>{return {label:itm}}));
    const [errorText, setErrorText] = useState('');
    useEffect(() => {
        setItmList(props.itemList.map(itm=>{return {label:itm}}));
    }, [props.itemList, props.selectedItem])
    if (mode === 'Select') {
        return (
            <div className='sel-edit-itmlist'>
                <div className="form-control-wrapper">
                    <SelectFromList itemList={itmList} selectedItem={props.selectedItem} caption={props.caption} onChange={(selItem) => {
                        setSelectedItem(selItem);
                        props.onSelected(selItem);
                    }} />
                </div>
                <div className='toolbar'>
                    <ToolbarButton toolTip='Добавить новый элемент списка' image='plus' size='32' class='toolbar__button' onClick={() => {
                        setMode('AddNewItem');
                    }} />
                    {selectedItem
                        ? (
                            <ToolbarButton toolTip={`Удалить элемент ${selectedItem}`} image='minus' size='32' class='toolbar__button' onClick={() => {
                                let newItemList = itmList.filter(itm => itm.label !== selectedItem);
                                setItmList([...newItemList]);
                                props.onDelete(selectedItem);
                                setSelectedItem('');
                            }} />
                        )
                        : (
                            <></>
                        )}
                </div>
            </div>
        );
    }
    if (mode === 'AddNewItem') {
        return (
            <div className='sel-edit-itmlist'>
                <div className='mode-add-newitem'>
                    <Input autoFocus={true} className='select-edit-input' value={newItemName}
                        onFocus={() => { setErrorText("") }}
                        onChange={(e) => {
                            let newValue = e.currentTarget.value;
                            setNewItemName(newValue);
                        }}
                    />
                    <div className={`error-text ${errorText ? 'error-text_show' : 'error-text_hide'}`}>{errorText ? errorText : "no errors"}</div>
                    <div className='toolbar-modeAddNew'>
                        <ToolbarButton toolTip='Создать новую папку' image='apply' size='32' class='toolbar__button' onClick={() => {
                            let alreadyExists = itmList.some(itm => itm.label.toLowerCase() === newItemName.toLocaleLowerCase());
                            if (alreadyExists) {
                                setErrorText('Такой элемент уже есть');
                            } else {
                                itmList.push({label: newItemName});
                                setItmList([...itmList]);
                                setMode('Select');
                                setSelectedItem(newItemName);
                                setNewItemName('');
                                props.onAdd(newItemName);
                            }
                        }} />
                        <ToolbarButton toolTip={`Отменить`} image='cancel' size='32' class='toolbar__button' onClick={() => {
                            setNewItemName('');
                            setMode('Select');
                        }} />
                    </div>
                </div>
            </div>
        );
    }
    return (<></>);
}