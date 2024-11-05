import { useMemo,useState,useImperativeHandle,useEffect, forwardRef } from 'react';
import { UncontrolledTreeEnvironment,ControlledTreeEnvironment, Tree, StaticTreeDataProvider, TreeItemIndex, TreeDataProvider,TreeItem } from 'react-complex-tree';
import 'react-complex-tree/lib/style-modern.css';
import './data-tree.css';
import { GetDtItemEditor, GetDtItemToolbar } from './DTItems';
import { ApplyFilterTreeResult, ITreeItemData } from '../../gui-common-types';
import { ITreeItemSimple } from '../../common-types';
import Badge from '@mui/material/Badge';


export const emptyTreeData:ITreeItemSimple<ITreeItemData>[] = [
  {index:'root',isFolder:true,children:[1,2]},
  {index:1},
  {index:2}
];

function convertTreeItemSimpleArrayToRowObject<T>(srcTreeData:ITreeItemSimple<T>[]){
  let result:any = {};
  srcTreeData.forEach(itm=>{
    let newItem:TreeItem<T> = {
      index:itm.index,
      canMove:true,
      canRename:false,
      isFolder:itm.children?true:false,
      children:itm.children,
      data:itm.data as T
    }
    result[itm.index] = newItem;
  });
  return result; 
}



export interface IDataTreeProps<T>{
  srcTreeData?:ITreeItemSimple<T>[],
  ref:any
}

export interface IDataTreeAPI{
  serialize:()=>ITreeItemSimple<ITreeItemData>[];
}

export const DataTree = forwardRef<IDataTreeAPI,IDataTreeProps<ITreeItemData>>((props,ref)=>{
  const initTreeItems = () => {
    if(props.srcTreeData){
      return convertTreeItemSimpleArrayToRowObject<ITreeItemData>(props.srcTreeData);
    } else {
      return convertTreeItemSimpleArrayToRowObject<ITreeItemData>(emptyTreeData);;
    }
  }
  const [rows,setRows] = useState(initTreeItems());
  const nullRows:any = null;
  useImperativeHandle(ref, () => ({
    serialize: () => {
      let result:ITreeItemSimple<ITreeItemData>[] = [];
      for(let key in rows){
        let newRow = rows[key] as ITreeItemSimple<ITreeItemData>;
        result.push(newRow); 
      }
      return result;
    }
  }));
  const dataProvider = useMemo(
      () =>{
        return new StaticTreeDataProvider(rows, (row, data) => ({            
          ...row,
          data,
        }))},
      [rows]
  );  
  const [selItemIdx,setSelItemIdx] = useState(0);
  const selectedItem:TreeItem<any> = rows[selItemIdx];
  //осталось 2 элемента (1 элемент не выбирается сразу после рендера(баг компонента) , поэтому его не отображаем)
   //поэтому не удаляем второй элемент

  const allowDelete = selectedItem && !selectedItem.isFolder && rows['root'].children.length>2; // если у рута осталось только 2 вложенных элемента
  // то удалять нельзя т.к. первый элемент не используется из за бага 
  // в компоненте react-complex-tree - 1 вложенный элемент рута не выбирается пока не выберешь какой то другой элемент
  // поэтому второй чайлд удалять нельзя
  return (
    <div ref={props.ref} className='dtree'>
      {GetDtItemToolbar(selectedItem,allowDelete,(cmd)=>{
        switch(cmd){
          case 'add':
              let lastIndex = -1;
              //Определяем максимальный индекс (для того, чтобы сгенерировать следующий)
              for(const key in rows){
                 let row = rows[key] as TreeItem<any>;
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
              let newRow:TreeItem<any> = {
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
              let row:TreeItem<any> = rows[key];
              if(row.children){
                let delIndex = row.children.findIndex(itm=>itm == selectedItem.index);
                if(delIndex>-1){
                  let parent:TreeItem<any> = row;
                  if(parent.children){
                    if(parent.index === 'root' && parent.children.length < 3){
                      //осталось 2 элемента (1 элемент не выбирается сразу после рендера(баг компонента) , поэтому его не отображаем)
                      //поэтому не удаляем второй элемент
                      return;
                    }
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
            let fltRowResult = ApplyFilterTreeResult.filter(itm=>itm.treeItemIndex === item.index);
            if(item.index === selItemIdx){
              return (
                <Badge badgeContent={fltRowResult.length} color="info" max={99999}>
                  <span className='item-title-sel'>{lblText}</span>;                
                </Badge>
              ); 
              
            }
            return (
            <Badge badgeContent={fltRowResult.length} color="info" max={99999}>
              <span>{lblText}</span>;              
            </Badge>
            );
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
          renderItem={({ item, title, arrow, depth, context, children }) => {
            if(item.index == 1){
              return (<></>);
            }
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
});





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


