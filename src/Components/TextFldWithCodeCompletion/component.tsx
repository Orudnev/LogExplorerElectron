import TextField from '@mui/material/TextField';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';
import Box from '@mui/material/Box';
import { SxProps } from '@mui/material';
import { useState } from 'react';
import './component.css';

export interface ITextFldWithCodeCompletion{
    id:string;
    value:string;
    onChange?:(newValue:string)=>void;
    choiseList:string[];
}

export function TextFldWithCodeCompletion(props:ITextFldWithCodeCompletion){
    const [lePosition,setLePosition] = useState(0);
    const [leOpen, setleOpen] = useState(false); 
    const [filteredChoiseList,setFilteredChoiseList] = useState<string[]>([]); 
    const [selectedChoiseListItemIndex,setSelectedChoiseListItemIndex] = useState(0); 
    const [selectionStart,setSelectionStart] = useState(-1);
    const styles: SxProps = {
        position: 'absolute',
        top: 40,
        right: 0,
        left: lePosition-15,
        zIndex: 1,
        border: '1px solid',
        p: 1,
        maxWidth:"50%",
        bgcolor: 'background.paper',
    };
    return (
        <ClickAwayListener onClickAway={() => { setleOpen(false);}}>
            <Box className="txfld-with-codecompletion" sx={{ position: 'relative' }}>
                <TextField id={props.id} label='Logical expression' value={props.value}
                    onKeyUp={(e) => {
                        if (e.ctrlKey && e.code === 'Space') {
                            let xoffset = GetTextInputPositionInPixels(e.target as HTMLInputElement);
                            let searchCriteria = GetNearestWord(e.target as HTMLInputElement);
                            if(searchCriteria){
                                let filteredItems = props.choiseList.filter(itm=>itm.includes(searchCriteria));
                                if(filteredItems && filteredItems.length>0){
                                    // Показываем отфильтрованные элементы
                                    setFilteredChoiseList(filteredItems)
                                } else {
                                    // Ничего не показываем
                                    return;
                                }
                            } else {
                                //Показываем все элементы
                                setFilteredChoiseList(props.choiseList);
                            }                    
                            setLePosition(xoffset);
                            setleOpen(true);
                            let ss = (e.target as HTMLInputElement).selectionStart;
                            if(ss){
                                setSelectionStart(ss);
                            }
                        } else{
                            if(leOpen){
                                if(e.key == 'ArrowDown'){
                                    if(selectedChoiseListItemIndex<filteredChoiseList.length-1){
                                        setSelectedChoiseListItemIndex(selectedChoiseListItemIndex+1);
                                    }
                                    if(selectionStart != -1){
                                        (e.target as HTMLInputElement).setSelectionRange(selectionStart,selectionStart);
                                    }
                                    return;    
                                }
                                if(e.key == 'ArrowUp'){
                                    if(selectedChoiseListItemIndex>0){
                                        setSelectedChoiseListItemIndex(selectedChoiseListItemIndex-1);
                                    }
                                    if(selectionStart != -1){
                                        (e.target as HTMLInputElement).setSelectionRange(selectionStart,selectionStart);
                                    }
                                    return;    
                                }              
                                if(e.key == 'Enter'){
                                    let lookupValue = filteredChoiseList[selectedChoiseListItemIndex];
                                    let inputHtml = e.target as HTMLInputElement;
                                    if(inputHtml.selectionStart){
                                        let position = inputHtml.selectionStart;
                                        let newValue = props.value.substring(0,position)+lookupValue+props.value.substring(position);
                                        let newPosiion = position + lookupValue.length;
                                        if(props.onChange){
                                            props.onChange(newValue);
                                            setleOpen(false);
                                            setSelectedChoiseListItemIndex(0);
                                            setTimeout(() => {
                                                (e.target as HTMLInputElement).setSelectionRange(newPosiion,newPosiion);
                                            }, 0);
                                        }
                                    }
                                    return;    
                                } 
                            }
                            if(e.key != 'Control'){
                                setleOpen(false);
                            }

                        }                        
                    }}
                    onChange={(e) => {
                        if (props.onChange) {
                            props.onChange(e.target.value);
                        }
                    }}
                />
                {leOpen
                    ? (
                        <Box sx={styles}>
                            <ChoiseList itemValues={filteredChoiseList} selectedIndex={selectedChoiseListItemIndex} />
                        </Box>)
                    : null
                }
            </Box>
        </ClickAwayListener>        
    );    
}



function ChoiseItem(props:{index:number,value:string,selected:boolean}){
    let clsStr = '';
    if(props.selected){
        clsStr = 'choise-list_item__selected'
    }
    return (
        <div className={clsStr}> {props.value}</div>
    )
}

function ChoiseList(props:{itemValues:string[],selectedIndex:number}){
    return (
        <div className='choise-list'>
            {props.itemValues.map((itm,index)=>
               <ChoiseItem index={index} 
                    value={itm} 
                    selected={index == props.selectedIndex} 
                    />)}
        </div>
    )
}

function GetNearestWord(inputElement:HTMLInputElement){
    if(!inputElement.selectionStart){
        return "";
    }
    let currPosition = inputElement.selectionStart - 1;
    if(inputElement.value.charAt(currPosition) == " "){
        return "";
    }    
    let startPosition = currPosition;
    while(startPosition > 0){
        let ch = inputElement.value.charAt(startPosition);
        if(ch == ' ' ){
            break;
        }
        startPosition--;
    }
    let endPosition = currPosition;
    while(endPosition<inputElement.value.length){
        let ch = inputElement.value.charAt(endPosition);
        if(ch == ' ' ){
            break;
        }
        endPosition++;
    }
    let result = inputElement.value.substring(startPosition,endPosition).trim();
    return result;
}

function GetTextInputPositionInPixels(inputElement:HTMLInputElement){
    const container = inputElement.parentElement;
    let selectionIndex = 0;
    if(inputElement.selectionStart){
        selectionIndex = inputElement.selectionStart;
    }
    const textBeforeCursor = inputElement.value.substring(0, selectionIndex);
    if(container){
        const span = document.createElement('span');
        container.appendChild(span);
        const style = window.getComputedStyle(inputElement);
        span.style.font = style.font;
        span.style.padding = style.padding;
        span.style.border = style.border;
        span.style.whiteSpace = 'pre';
        span.style.visibility = 'hidden';    
        span.textContent = textBeforeCursor;
        const cursorPosition = span.offsetWidth;
        container.removeChild(span);
        return cursorPosition;        
    }
    return 0;
}