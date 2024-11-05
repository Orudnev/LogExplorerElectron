import React, { useEffect, useState } from 'react';
import {
  Routes,
  Route,
  NavigateFunction,
  useNavigate,
  Navigate,
  Link
} from "react-router-dom";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ru';
import './app.css';
import './images.css';
import { AppSessionData, TAppSettigs } from './Components/AppData';
import { store, TAllActions, IAppState } from './Reducers/index';
import * as Api from './api-wrapper';
import { MainPage } from './Components/main-page';
import { Settings } from './Components/settings';
import { ITreeItemSimple } from './common-types';
import { ITreeItemData } from './gui-common-types';
import { TreeItemIndex } from 'react-complex-tree';


class AppGlobalClass {
  private navfunc: NavigateFunction | undefined = undefined;
  dispatchFunc: any = undefined;
  private CurrentTreeItemIndex:TreeItemIndex = -1;
  constructor() {
    this.getState = this.getState.bind(this);
    this.navigate = this.navigate.bind(this);
  }

  init(navf: NavigateFunction) {
    this.navfunc = navf;
  }

  dispatch(action: TAllActions) {
    store.dispatch(action);
  }

  navigate(url: any) {
    if (this.navfunc) {
      this.navfunc(url);
    }
  }

  getState(): IAppState {
    let st = store.getState();
    return st;
  }

  resetCurrentTreeItemIndex(){
    let appSettings = this.getState().AppReducer;
    let root = appSettings.filterSetItem?.filterTree.find(itm => itm.index === "root");
    if(root && root.children){
      let startIndex = root.children[1];
      this.CurrentTreeItemIndex = startIndex;
    }
  }

  getAppSettings(){
    return this.getState().AppReducer;
  }

  calculatePath(){

  }

  setCurrentTreeItemIndex(newIndex:TreeItemIndex){
    this.CurrentTreeItemIndex = newIndex;
  }

  getCurrentTreeItem():ITreeItemSimple<ITreeItemData>|undefined{
    let item = this.getAppSettings().filterSetItem?.filterTree.find(itm => itm.index === this.CurrentTreeItemIndex);
    return item;
  }

  //Проверяет indForCheck на валидность
  vlidateTreeItemIndex(indForCheck:TreeItemIndex):boolean{
    //indForCheck индекс элемента дерева по которому произошло совпадение условия фильтра
    //CurrentTreeItemIndex - текущий элемент дерева (последний элемент по которому валидация прошла успешно)
    //Валидными считаются следующие элементы дерева относительно indForCheck
    //1.  Если isFirstChildOf(parentIndex=CurrentTreeItemIndex, childIndex=indForCheck)  
    //1.1 = true (indForCheck - первый чайлд элемента CurrentTreeItemIndex) -> Return True
    //1.2 = false Переходим к п.2
    //2   Если isNextNeighbour(currItemIndex=CurrentTreeItemIndex, nextItemIndex = indForCheck)
    //2.1 = true означает, что  "indForCheck"  следует сразу после CurrentTreeItemIndex   -> Return True
    //2.2 = false переходим к п.3
    //3. Создаем переменную CurrentParentIndex = getParent(CurrentTreeItemIndex)
    //4  Если isNextNeighbour(CurrentParentIndex)
    //4.1 == true -> Return True 
    //4.3 == false  переходим к п.5
    //5  Если CurrentParentIndex == 'root', то -> Return False,  иначе переходим к п.6
    //6. CurrentParentIndex = getParent(CurrentParentIndex) посе чего переходим к п.4
    
    const getElm = (index:TreeItemIndex)=>{
      const elm = this.getAppSettings().filterSetItem?.filterTree.find(itm=>itm.index===index);
      return elm;
    }
    const getParent = (index:TreeItemIndex)=>{
      const parent = this.getAppSettings().filterSetItem?.filterTree.find(itm=>itm.children?.find(ch=>ch===index));
      return parent;
    }
    const isFirstChildOf = (parentIndex:TreeItemIndex,childIndex:TreeItemIndex)=>{
      const parentElm = getElm(parentIndex);
      if(parentElm && parentElm.children && parentElm.children.length>0){
        return parentElm.children[0] === childIndex;
      }
      return false;
    }
    const isNextNeighbour = (currItemIndex:TreeItemIndex,nextItmIndexForCheck:TreeItemIndex)=>{
      const parent = getParent(currItemIndex);
      if(parent && parent.children && parent.children.length>0){
        const currElmIndInChildrenList = parent.children.findIndex(itm=>itm === currItemIndex);
        if(parent.children.length > currElmIndInChildrenList+1){
          const nextItmIndex = parent.children[currElmIndInChildrenList+1];
          return nextItmIndexForCheck === nextItmIndex;
        }
      }
      return false;
    }
    //1
    if(isFirstChildOf(this.CurrentTreeItemIndex,indForCheck)){
      return true; //1.2
    }
    //2
    if(isNextNeighbour(this.CurrentTreeItemIndex,indForCheck)){
      return true; //2.1
    }
    //3 
    let currentParent = getParent(this.CurrentTreeItemIndex);
    if(!currentParent){
      return false;
    }
    for(;;){
      //4
      if(isNextNeighbour(currentParent.index,indForCheck)){
        return true; //4.1
      }
      if(currentParent.index === 'root'){
        break;//5
      }
      let newCurrParent = getParent(currentParent.index);
      if(newCurrParent){
        currentParent = newCurrParent;
      } else {
        break;
      }
    }
    return false;//5
  }

}

export const AppGlobal = new AppGlobalClass();


const Root = () => {
  return (
    <div>Root</div>
  );
}

function App() {
  AppGlobal.init(useNavigate());
  //@ts-ignore
  window.appg = AppGlobal;
  

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
    <div>
      <Routes>
        <Route path={"/"} element={<MainPage />} />
        <Route path={"/Settings"} element={<Settings />} />
      </Routes> 
    </div>
    </LocalizationProvider> 
  );
}

export default App;
