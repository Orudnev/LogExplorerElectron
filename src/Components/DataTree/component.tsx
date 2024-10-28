import { useMemo,useState,useEffect } from 'react';
import { UncontrolledTreeEnvironment,ControlledTreeEnvironment, Tree, StaticTreeDataProvider, TreeItemIndex, TreeDataProvider,TreeItem } from 'react-complex-tree';
import 'react-complex-tree/lib/style-modern.css';
import './data-tree.css';
import { GetDtItemEditor,TDtItemType } from './DTItems';
import { ToolbarButton } from '../toolbar-button';


export interface IDataTreeProps<T>{
    items:TreeItem<T>[]
}


export function DataTree<T>(props:IDataTreeProps<T>){
    const convertItemsToRowObject = (items:TreeItem<T>[])=>{
        let result:any = {};
        for(let i=0;i<items.length;i++){
          let itm = items[i];
          result[itm.index] = itm;  
        }
        return result; 
    }
    const [rows,setRows] = useState(convertItemsToRowObject(props.items));
    const dataProvider = useMemo(
        () =>
          new StaticTreeDataProvider(rows, (row, data) => ({            
            ...row,
            data,
          })),
        [rows]
      );  
    const [selItemIdx,setSelItemIdx] = useState("");
    const selectedItem:TreeItem<T> = rows[selItemIdx];
    return (
      <div className='dtree'>
        <div className='dtree_item-toolbar'>
            <ToolbarButton toolTip='' image='plus' size='24' class = 'toolbar-button' onClick={()=>{}} />
            <ToolbarButton toolTip='' image='plus' size='24' class = 'toolbar-button' onClick={()=>{}} />
            <ToolbarButton toolTip='' image='plus' size='24' class = 'toolbar-button' onClick={()=>{}} />
            <ToolbarButton toolTip='' image='plus' size='24' class = 'toolbar-button' onClick={()=>{}} />
            <ToolbarButton toolTip='' image='plus' size='24' class = 'toolbar-button' onClick={()=>{}} />
        </div>
        <UncontrolledTreeEnvironment       
            canDragAndDrop
            canDropOnFolder
            canReorderItems
            dataProvider={dataProvider}
            getItemTitle={item => item.index.toString()}
            viewState={{
              'tree-1': {
                expandedItems: [],
              },
            }}      
            renderItemTitle={({ title,item,context }) =>{
              return <span>{title}</span>;              
            }}
            renderItemArrow={({ item, context }) =>{
            if(item.isFolder){
              if(context.isExpanded){
                if(item.index === selItemIdx){
                  return <div {...context.arrowProps} className="icon icon-folder-opened-sel"> </div>; 
                } else {
                  return <div {...context.arrowProps} className="icon icon-folder-opened-ord"> </div>; 
                }
              } 
              if(item.index === selItemIdx){
                return <div {...context.arrowProps} className="icon icon-folder-closed-sel"> </div>;  
              } else {
                return <div {...context.arrowProps} className="icon icon-folder-closed-ord"> </div>;  
              }
            }  
            if(item.index === selItemIdx){
              return <div {...context.arrowProps} className="icon icon-leaf-item-sel"> </div>; 
            } else {
              return <div {...context.arrowProps} className="icon icon-leaf-item-ord"> </div>; 
            }
            
            }
           } 
            onFocusItem={(item,treeId,setDomFocus)=>{
              setSelItemIdx(item.index.toString());
            }}           
            renderItem={({ title, arrow, depth, context, children }) => {
              return (
                <li 
                  {...context.itemContainerWithChildrenProps}
                >
                  <div {...context.itemContainerWithoutChildrenProps} {...context.interactiveElementProps}>
                    {arrow}
                    {title}
                  </div>
                  {children}
                </li>
              );              
            }}
            renderTreeContainer={({ children, containerProps }) => <div className='tree-container' {...containerProps}>{children}</div>}
            renderItemsContainer={({ children, containerProps }) => <ul className='tree-item-container' {...containerProps}>{children}</ul>}
        >
            <Tree treeId="tree-1" rootItem="root" />
        </UncontrolledTreeEnvironment>
        <div className='dtree_item-details'>
            {GetDtItemEditor('test',selectedItem)}
        </div>
      </div>
    );
}

