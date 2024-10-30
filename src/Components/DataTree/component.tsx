import { useMemo,useState,useEffect } from 'react';
import { UncontrolledTreeEnvironment,ControlledTreeEnvironment, Tree, StaticTreeDataProvider, TreeItemIndex, TreeDataProvider,TreeItem } from 'react-complex-tree';
import 'react-complex-tree/lib/style-modern.css';
import './data-tree.css';
import { GetDtItemEditor, GetDtItemToolbar } from './DTItems';
import { ITreeItemData } from '../test-tree';


export interface IDataTreeProps<T>{
    items:TreeItem<T>[];
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
        () =>{
          console.log("************** dataprovider **************");
          return new StaticTreeDataProvider(rows, (row, data) => ({            
            ...row,
            data,
          }))},
        [rows]
      );  
    const [selItemIdx,setSelItemIdx] = useState(0);
    const selectedItem:TreeItem<T> = rows[selItemIdx];
    const allowDelete = selectedItem && !selectedItem.isFolder && rows['root'].children.length>1;
    return (
      <div className='dtree'>
        {GetDtItemToolbar(selectedItem,allowDelete,(cmd)=>{
          switch(cmd){
            case 'add':
                let lastIndex = -1;
                //Определяем максимальный индекс (для того, чтобы сгенерировать следующий)
                for(const key in rows){
                   let row = rows[key] as TreeItem<ITreeItemData>;
                   if(isNaN(row.index as any)){
                      continue;
                   }
                   let currIndex = row.index as number;
                   if(currIndex>lastIndex){
                    lastIndex = currIndex;
                   }
                }
                //генерируем следующий индекс
                lastIndex++;
                const emptyData:ITreeItemData = {
                  operation:'Contains',
                  label:'New element',
                  value:''
                } 
                let newRow:TreeItem<ITreeItemData> = {
                  index:lastIndex,
                  isFolder:false,
                  data:emptyData,
                  children:undefined
                }
                const newRows = {...rows};
                newRows[lastIndex] = newRow;
                let parent = newRows['root'];
                if (selectedItem){
                  parent = newRows[selectedItem.index];
                }
                if(parent.isFolder){
                  parent.children?.push(lastIndex);
                } else {
                    parent.children = [lastIndex];
                }
                parent.isFolder = true;
                setRows(newRows);
                break;
            case 'delete':
              const nr:any = {};
              let newSelectedIndex = -1;
              for(const key in rows){
                let row:TreeItem<ITreeItemData> = rows[key];
                if(row.children){
                  let delIndex = row.children.findIndex(itm=>itm == selectedItem.index);
                  if(delIndex>-1){
                    let parent:TreeItem<ITreeItemData> = row;
                    if(parent.children){
                      parent.children.splice(delIndex,1);
                      if(parent.children.length>0){
                        if(parent.children.length>delIndex){
                          newSelectedIndex = parent.children[delIndex] as number;  
                        } else {
                          newSelectedIndex = parent.children[parent.children.length-1] as number;
                        }                        
                      } else {
                        parent.isFolder = false;
                        newSelectedIndex = parent.index as number;
                      }
                    }
                  }
                }
                if(selectedItem.index != key){
                  nr[key] = row;
                }
              }
              setRows(nr);
              if(newSelectedIndex>-1){
                setSelItemIdx(newSelectedIndex);
              }
              break;
            case 'clearSelection':
              setSelItemIdx(0);
              break;
            default: 
          }
        })}
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
              let lblText = title;
              let datat:ITreeItemData = item.data;
              if(datat && datat.label){
                lblText = datat.label;
              }
              if(item.index === selItemIdx){
                return <span className='item-title-sel'>{lblText}</span>;                
              }
              return <span>{lblText}</span>;              
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
              setSelItemIdx(item.index as number);
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
            {GetDtItemEditor('filter',selectedItem,
            (item,newValue)=>{
              item.data = newValue;
              setRows({...rows});
            })}
        </div>
      </div>
    );
}



// (item,newIndex)=>{
//   let newRows:any = {};
//   for(const key in rows){
//     if(item.index === key){
//       newRows[newIndex] = rows[key];
//       newRows[newIndex].index = newIndex;
//     } else {
//       newRows[key] = rows[key];                  
//     }
//   } 
//   setRows(newRows);
//   setSelItemIdx(newIndex);              
// },


