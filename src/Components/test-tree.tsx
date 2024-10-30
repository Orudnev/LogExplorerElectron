import { useMemo,useState,useEffect } from 'react';
import { UncontrolledTreeEnvironment,ControlledTreeEnvironment, Tree, StaticTreeDataProvider, TreeItemIndex,TreeItem } from 'react-complex-tree';
import 'react-complex-tree/lib/style-modern.css';
import { DataTree } from './DataTree/component';


function newTreeNode<T>(newId:TreeItemIndex,childrenIds:any=undefined,data?:T,canMovep=true,canRename=true):TreeItem<T>{
  if (!data){
    data = newId as T;
  }
  let result:TreeItem<T> = {
    index:newId,
    canMove:canMovep,
    canRename:canRename,
    data:data,
    isFolder:childrenIds?true:false,
    children:childrenIds
  }
  return result;
}

const FILTER_OPERATIONS = {
  Contains:'',
  NotContain:'',
  Regex:''
};

export type TFilterOperation = keyof typeof FILTER_OPERATIONS;

export function GetAllFilterOperations():string[]{
  let result = [];
  for(const opr in FILTER_OPERATIONS){
    result.push(opr);
  }
  return result;
}

export interface ITreeItemData {
  operation:TFilterOperation;
  label?:string,
  value:string;
}

const treeDataOld:TreeItem<ITreeItemData>[] = [
  newTreeNode("root",[1,2,3]),
  newTreeNode(1,undefined,{operation:'Contains',label:"blabla",value:"jjjjjj"}),
  newTreeNode(2,[4,5,6],{operation:'Contains',label:"bbbb", value:'мама мыла раму'}),
  newTreeNode(4),
  newTreeNode(5),
  newTreeNode(6),
  newTreeNode(3)
];

const longTreeJsonStr = '{"items":{"root":{"index":"root","canMove":true,"isFolder":true,"children":["Fruit","Meals","Desserts","Drinks"],"data":"root","canRename":true},"Fruit":{"index":"Fruit","canMove":true,"isFolder":true,"children":["Apple","Orange","Lemon","Berries","Banana"],"data":"Fruit","canRename":true},"Apple":{"index":"Apple","canMove":true,"isFolder":false,"data":"Apple","canRename":true},"Orange":{"index":"Orange","canMove":true,"isFolder":false,"data":"Orange","canRename":true},"Lemon":{"index":"Lemon","canMove":true,"isFolder":false,"data":"Lemon","canRename":true},"Berries":{"index":"Berries","canMove":true,"isFolder":true,"children":["Red","Blue","Black"],"data":"Berries","canRename":true},"Red":{"index":"Red","canMove":true,"isFolder":true,"children":["Strawberry","Raspberry"],"data":"Red","canRename":true},"Strawberry":{"index":"Strawberry","canMove":true,"isFolder":false,"data":"Strawberry","canRename":true},"Raspberry":{"index":"Raspberry","canMove":true,"isFolder":false,"data":"Raspberry","canRename":true},"Blue":{"index":"Blue","canMove":true,"isFolder":true,"children":["Blueberry"],"data":"Blue","canRename":true},"Blueberry":{"index":"Blueberry","canMove":true,"isFolder":false,"data":"Blueberry","canRename":true},"Black":{"index":"Black","canMove":true,"isFolder":true,"children":["Blackberry"],"data":"Black","canRename":true},"Blackberry":{"index":"Blackberry","canMove":true,"isFolder":false,"data":"Blackberry","canRename":true},"Banana":{"index":"Banana","canMove":true,"isFolder":false,"data":"Banana","canRename":true},"Meals":{"index":"Meals","canMove":true,"isFolder":true,"children":["America","Europe","Asia","Australia"],"data":"Meals","canRename":true},"America":{"index":"America","canMove":true,"isFolder":true,"children":["SmashBurger","Chowder","Ravioli","MacAndCheese","Brownies"],"data":"America","canRename":true},"SmashBurger":{"index":"SmashBurger","canMove":true,"isFolder":false,"data":"SmashBurger","canRename":true},"Chowder":{"index":"Chowder","canMove":true,"isFolder":false,"data":"Chowder","canRename":true},"Ravioli":{"index":"Ravioli","canMove":true,"isFolder":false,"data":"Ravioli","canRename":true},"MacAndCheese":{"index":"MacAndCheese","canMove":true,"isFolder":false,"data":"MacAndCheese","canRename":true},"Brownies":{"index":"Brownies","canMove":true,"isFolder":false,"data":"Brownies","canRename":true},"Europe":{"index":"Europe","canMove":true,"isFolder":true,"children":["Risotto","Spaghetti","Pizza","Weisswurst","Spargel"],"data":"Europe","canRename":true},"Risotto":{"index":"Risotto","canMove":true,"isFolder":false,"data":"Risotto","canRename":true},"Spaghetti":{"index":"Spaghetti","canMove":true,"isFolder":false,"data":"Spaghetti","canRename":true},"Pizza":{"index":"Pizza","canMove":true,"isFolder":false,"data":"Pizza","canRename":true},"Weisswurst":{"index":"Weisswurst","canMove":true,"isFolder":false,"data":"Weisswurst","canRename":true},"Spargel":{"index":"Spargel","canMove":true,"isFolder":false,"data":"Spargel","canRename":true},"Asia":{"index":"Asia","canMove":true,"isFolder":true,"children":["Curry","PadThai","Jiaozi","Sushi"],"data":"Asia","canRename":true},"Curry":{"index":"Curry","canMove":true,"isFolder":false,"data":"Curry","canRename":true},"PadThai":{"index":"PadThai","canMove":true,"isFolder":false,"data":"PadThai","canRename":true},"Jiaozi":{"index":"Jiaozi","canMove":true,"isFolder":false,"data":"Jiaozi","canRename":true},"Sushi":{"index":"Sushi","canMove":true,"isFolder":false,"data":"Sushi","canRename":true},"Australia":{"index":"Australia","canMove":true,"isFolder":true,"children":["PotatoWedges","PokeBowl","LemonCurd","KumaraFries"],"data":"Australia","canRename":true},"PotatoWedges":{"index":"PotatoWedges","canMove":true,"isFolder":false,"data":"PotatoWedges","canRename":true},"PokeBowl":{"index":"PokeBowl","canMove":true,"isFolder":false,"data":"PokeBowl","canRename":true},"LemonCurd":{"index":"LemonCurd","canMove":true,"isFolder":false,"data":"LemonCurd","canRename":true},"KumaraFries":{"index":"KumaraFries","canMove":true,"isFolder":false,"data":"KumaraFries","canRename":true},"Desserts":{"index":"Desserts","canMove":true,"isFolder":true,"children":["Cookies","IceCream"],"data":"Desserts","canRename":true},"Cookies":{"index":"Cookies","canMove":true,"isFolder":false,"data":"Cookies","canRename":true},"IceCream":{"index":"IceCream","canMove":true,"isFolder":false,"data":"IceCream","canRename":true},"Drinks":{"index":"Drinks","canMove":true,"isFolder":true,"children":["PinaColada","Cola","Juice"],"data":"Drinks","canRename":true},"PinaColada":{"index":"PinaColada","canMove":true,"isFolder":false,"data":"PinaColada","canRename":true},"Cola":{"index":"Cola","canMove":true,"isFolder":false,"data":"Cola","canRename":true},"Juice":{"index":"Juice","canMove":true,"isFolder":false,"data":"Juice","canRename":true}}}';

const longTree = JSON.parse(longTreeJsonStr);

export function TestTree(){
  return (
    <DataTree items={treeDataOld} />
  );
}

// export function TestTree(){
//       const items = useMemo(()=>{
//         let result:any = {};
//         for(let i=0;i<treeDataOld.length;i++){
//           let itm = treeDataOld[i];
//           result[itm.index] = itm;  
//         }
//         return result; 
//       },[]);
//       const dataProvider = useMemo(
//         () =>
//           new StaticTreeDataProvider(items, (item, data) => ({            
//             ...item,
//             data,
//           })),
//         [items]
//       );  
//       const [selItemIdx,setSelItemIdx] = useState("");
//       return (
//         <UncontrolledTreeEnvironment       
//             canDragAndDrop
//             canDropOnFolder
//             canReorderItems
//             dataProvider={dataProvider}
//             getItemTitle={item => item.index.toString()}
//             viewState={{
//               'tree-1': {
//                 expandedItems: [],
//               },
//             }}      
//             renderItemTitle={({ title,item,context }) =>{
//               if(item.index === selItemIdx){
//                 return <span style = {{border:"solid 1px red",backgroundColor:"#ffc8b8"} }>{title}</span>;
//               }
//               return <span>{title}</span>;              
//             }}
//             renderItemArrow={({ item, context }) =>{
//             if(item.isFolder){
//               if(context.isExpanded){
//                 return <span {...context.arrowProps}> {folderOpened} </span>; 
//               } 
//               return <span {...context.arrowProps}> {folderClosed} </span>; 
//             }  
//             return <span {...context.arrowProps}> {leafItem} </span>; 
//             }
//            } 
//             onFocusItem={(item,treeId,setDomFocus)=>{
//               setSelItemIdx(item.index.toString());
//             }}           
//             renderItem={({ title, arrow, depth, context, children }) => {
//               return (
//                 <li
//                   {...context.itemContainerWithChildrenProps}
//                   style={{
//                     margin: 0,
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'flex-start',
//                   }}
//                 >
//                   <div className='renderItem' {...context.itemContainerWithoutChildrenProps} {...context.interactiveElementProps}>
//                     {arrow}
//                     {title}
//                   </div>
//                   {children}
//                 </li>
//               );              
//             }}
//             renderTreeContainer={({ children, containerProps }) => <div className='renderTreeCont' {...containerProps}>{children}</div>}
//             renderItemsContainer={({ children, containerProps }) => <ul className='renderItmCont' {...containerProps}>{children}</ul>}
//         >
//             <Tree treeId="tree-1" rootItem="root" treeLabel="Tree Example"  />
//         </UncontrolledTreeEnvironment>
//       );
// }

const rightArrowB64 = 'PHN2ZyB2aWV3Qm94PSIwIDAgNTAwIDY3MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpieD0iaHR0cHM6Ly9ib3h5LXN2Zy5jb20iPgogIDxwYXRoIGQ9Ik0gMzYzLjg2NSAzODguNTQzIEwgNTU1LjQ0OCA3NTYuMDgyIEwgMTY0LjQ2MyA3NTYuMDgyIEwgMzYzLjg2NSAzODguNTQzIFoiIHN0eWxlPSJzdHJva2U6IHJnYigwLCAwLCAwKTsgZmlsbDogcmdiKDM0LCA0MCwgNDkpOyB0cmFuc2Zvcm0tb3JpZ2luOiAzNTkuOTU1cHggNTcyLjMxM3B4OyIgdHJhbnNmb3JtPSJtYXRyaXgoMCwgMSwgLTEsIDAsIC05Mi44NTE1NjI1LCAtMjUwLjEyMzEzODQyNzczNCkiIGJ4OnNoYXBlPSJ0cmlhbmdsZSAxNjQuNDYzIDM4OC41NDMgMzkwLjk4NSAzNjcuNTM5IDAuNTEgMCAxQDk2NmJjMTM3Ii8+Cjwvc3ZnPg==';
const dnArrowB64 = 'PHN2ZyB2aWV3Qm94PSIwIDAgNTAwIDY3MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpieD0iaHR0cHM6Ly9ib3h5LXN2Zy5jb20iPgogIDxwYXRoIGQ9Ik0gLTI1MC4xOTQgLTUwNS45NTkgTCAtNTguNjExIC0xMzguNDIgTCAtNDQ5LjU5NiAtMTM4LjQyIEwgLTI1MC4xOTQgLTUwNS45NTkgWiIgc3R5bGU9InN0cm9rZTogcmdiKDAsIDAsIDApOyBmaWxsOiByZ2IoMzQsIDQwLCA0OSk7IHRyYW5zZm9ybS1vcmlnaW46IC0yNTQuMTA0cHggLTMyMi4xOXB4OyIgdHJhbnNmb3JtPSJtYXRyaXgoLTEsIDAsIDAsIC0xLCA1MDguMjA2OTcwMjE0ODQsIDY0NC4zNzkwMjgzMjAzMTMpIiBieDpzaGFwZT0idHJpYW5nbGUgLTQ0OS41OTYgLTUwNS45NTkgMzkwLjk4NSAzNjcuNTM5IDAuNTEgMCAxQDhlMzMxYTY3Ii8+Cjwvc3ZnPg==';
const blankList = 'PHN2ZyBoZWlnaHQ9IjIwMHB4IiB3aWR0aD0iMjAwcHgiIHZlcnNpb249IjEuMSIgaWQ9Il94MzJfIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgZmlsbD0iIzAwMDAwMCI+PGcgaWQ9IlNWR1JlcG9fYmdDYXJyaWVyIiBzdHJva2Utd2lkdGg9IjAiPjwvZz48ZyBpZD0iU1ZHUmVwb190cmFjZXJDYXJyaWVyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjwvZz48ZyBpZD0iU1ZHUmVwb19pY29uQ2FycmllciI+IDxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+IC5zdDB7ZmlsbDojMDAwMDAwO30gPC9zdHlsZT4gPGc+IDxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0zNzguNDA5LDBIMjA4LjI5NGgtMTMuMTc1bC05LjMxNSw5LjMxNEw1Ny4wMTYsMTM4LjEwMmwtOS4zMTQsOS4zMTR2MTMuMTc2djI2NS41MTMgYzAsNDcuMzYxLDM4LjUyOCw4NS44OTYsODUuODk2LDg1Ljg5NmgyNDQuODExYzQ3LjM2LDAsODUuODg4LTM4LjUzNSw4NS44ODgtODUuODk2Vjg1Ljg5NUM0NjQuMjk4LDM4LjUyOCw0MjUuNzY5LDAsMzc4LjQwOSwweiBNNDMyLjQ5NCw0MjYuMTA0YzAsMjkuODc3LTI0LjIxNSw1NC4wOTItNTQuMDg0LDU0LjA5MkgxMzMuNTk4Yy0yOS44NzcsMC01NC4wOTItMjQuMjE1LTU0LjA5Mi01NC4wOTJWMTYwLjU5MWg4My43MTcgYzI0Ljg4NSwwLDQ1LjA3LTIwLjE3OSw0NS4wNy00NS4wN1YzMS44MDRoMTcwLjExNmMyOS44NywwLDU0LjA4NCwyNC4yMTQsNTQuMDg0LDU0LjA5MVY0MjYuMTA0eiI+PC9wYXRoPiA8L2c+IDwvZz48L3N2Zz4=';
const folderClosedB64 = 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSIxMyIgeTE9IjQiIHgyPSIxMyIgeTI9IjIwIiBpZD0iZ3JhZGllbnQtMSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IHJnYigyNTIsIDI0MSwgMTk3KTsiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjogcmdiKDI0MywgMjIxLCA5Mik7Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8ZyBpZD0iU1ZHUmVwb19iZ0NhcnJpZXIiIHN0cm9rZS13aWR0aD0iMCIvPgogIDxnIGlkPSJTVkdSZXBvX3RyYWNlckNhcnJpZXIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgogIDxyZWN0IHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0id2hpdGUiLz4KICA8cGF0aCBkPSJNIDQuMDY5IDE5Ljc3OCBMIDQgNi40NzIgQyA0IDYuMTYyIDQuMDcyIDUuODU1IDQuMjExIDUuNTc4IEwgNSA0IEwgMTAgNCBMIDExIDYgTCAyMSA2IEMgMjEuNTUyIDYgMjIgNi40NDggMjIgNyBMIDIyIDkgTCAyMiAxOCBDIDIyIDE5LjEwNSAyMS4xMDUgMjAgMjAgMjAgTCA0LjE4MiAxOS44NjIiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHlsZT0iZmlsbDogdXJsKCZxdW90OyNncmFkaWVudC0xJnF1b3Q7KTsiLz4KPC9zdmc+';
const folderOpenedB64 = 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSIxMSIgeTE9IjkiIHgyPSIxMSIgeTI9IjIwIiBpZD0iZ3JhZGllbnQtMCIgc3ByZWFkTWV0aG9kPSJwYWQiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMC45ODQ3NiwgLTAuMTczOTE5LCAwLjE2MzMsIDAuOTI0NjMxLCAtMy4wOTgzNjMsIDMuNDIwNTAzKSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IHJnYigyNDksIDI0MSwgMjAwKTsiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjogcmdiKDI0NywgMjM5LCAxMTUpOyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjEzIiB5MT0iNCIgeDI9IjEzIiB5Mj0iMjAiIGlkPSJncmFkaWVudC0xIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjogcmdiKDI1MiwgMjQxLCAxOTcpOyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiByZ2IoMjQzLCAyMjEsIDkyKTsiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxnIGlkPSJTVkdSZXBvX2JnQ2FycmllciIgc3Ryb2tlLXdpZHRoPSIwIi8+CiAgPGcgaWQ9IlNWR1JlcG9fdHJhY2VyQ2FycmllciIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CiAgPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSJ3aGl0ZSIvPgogIDxwYXRoIGQ9Ik00IDlWNi40NzIxNEM0IDYuMTYxNjUgNC4wNzIyOSA1Ljg1NTQyIDQuMjExMTUgNS41Nzc3MUw1IDRIMTBMMTEgNkgyMUMyMS41NTIzIDYgMjIgNi40NDc3MiAyMiA3VjlWMThDMjIgMTkuMTA0NiAyMS4xMDQ2IDIwIDIwIDIwSDE4IiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3R5bGU9ImZpbGw6IHVybCgmcXVvdDsjZ3JhZGllbnQtMSZxdW90Oyk7Ii8+CiAgPHBhdGggZD0iTTE3LjIzNjIgOUgyLjMwOTI1QzEuNjQ5ODggOSAxLjE3MDk5IDkuNjI2OTggMS4zNDQ0OSAxMC4yNjMxTDMuNTk4MDYgMTguNTI2MkMzLjgzNTM3IDE5LjM5NjQgNC42MjU2OSAyMCA1LjUyNzU5IDIwSDE5LjY5MDhDMjAuMzUwMSAyMCAyMC44MjkgMTkuMzczIDIwLjY1NTUgMTguNzM2OUwxOC4yMDEgOS43MzY4OEMxOC4wODIzIDkuMzAxODIgMTcuNjg3MiA5IDE3LjIzNjIgOVoiIHN0cm9rZT0iIzAwMDAwMCIgc3R5bGU9ImZpbGw6IHVybCgmcXVvdDsjZ3JhZGllbnQtMCZxdW90Oyk7IHBhaW50LW9yZGVyOiBmaWxsOyIvPgo8L3N2Zz4=';
const rightArrow = <img src={'data:image/svg+xml;base64,'+rightArrowB64} style={{height:'16px', marginRight:'5px'}} />;
const folderClosed = <img src={'data:image/svg+xml;base64,'+folderClosedB64} style={{height:'16px', marginRight:'5px'}} />;
const folderOpened = <img src={'data:image/svg+xml;base64,'+folderOpenedB64} style={{height:'16px', marginRight:'5px'}} />;
const dnArrow    = <img src={'data:image/svg+xml;base64,'+dnArrowB64} style={{height:'16px', marginRight:'5px'}} />;
const leafItem   = <img src={'data:image/svg+xml;base64,'+blankList} style={{height:'16px', marginRight:'5px'}} />;

// export function TestTree(){
//   const [treeItems,setTreeItems] = useState<any>(longTree.items);
//   const [focusedItem, setFocusedItem] = useState<TreeItemIndex>();
//   const [expandedItems, setExpandedItems] = useState<any>([]);
//   const [selectedItems, setSelectedItems] = useState<any>([]);

//   return (
//     <ControlledTreeEnvironment
//       items={treeItems}
//       getItemTitle={item => item.data}
//       viewState={{
//         ['tree-2']: {
//           focusedItem,
//           expandedItems,
//           selectedItems,
//         },
//       }}
//       onFocusItem={item => setFocusedItem(item.index)}
//       onExpandItem={item => setExpandedItems([...expandedItems, item.index])}
//       onCollapseItem={item =>
//         setExpandedItems(expandedItems.filter((expandedItemIndex:any) => expandedItemIndex !== item.index))
//       }
//       onSelectItems={items => setSelectedItems(items)}
      
//       canDragAndDrop={true}
//       canReorderItems={true}
//       canDropOnFolder={true}
    
//     >
//       <Tree treeId="tree-2" rootItem="root" treeLabel="Tree Example" />
//     </ControlledTreeEnvironment>
//   );
// }
