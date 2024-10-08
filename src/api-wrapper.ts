import axios from "axios";
import { IApiResponse, IFilterSetFolder,IFilterSet, ILogRow } from "./common-types";
import { AppSessionData } from "./Components/AppData";

export interface ICommonResult<TResult>{
    isOk:boolean;
    result?: TResult;
    error?: string;
}

export interface IGetLogRows{
    method:'GetLogRows';
    logFilesFolder:string;
    dFrom:number;
    dTo:number;
    severityStr:string;
}

export interface ILoadFilterSetFile{
    method:'LoadFilterSetFile';
    fileName:string;
}

export interface ISaveFolder{
    method:'SaveFolder';
    fileName:string;
    folder:IFilterSetFolder;
}

export interface ICurrDir{
    method:'CurrDir';
}

export type TApiTwoWayCall = IGetLogRows|ILoadFilterSetFile|ISaveFolder|ICurrDir;


async function MakeTwoWayCall(payload:TApiTwoWayCall){
    return (window as any).electronAPI.twoWayCall(payload);
}

class ApiWrapperClass{
    GetLogRows(folder:string,dfr:number,dto:number,sevStr:string):Promise<ICommonResult<ILogRow[]>>{
        let result = MakeTwoWayCall({method:'GetLogRows',logFilesFolder:folder,dFrom:dfr,dTo:dto,severityStr:sevStr});
        return result;
    } 

    LoadFilterSetFile():Promise<IFilterSetFolder[]>{
        let result = MakeTwoWayCall({method:'LoadFilterSetFile',fileName:AppSessionData.prop('FilterSetFile')});
        return result;        
    }

    SaveFolder(fld:IFilterSetFolder):Promise<ICommonResult<void>>{        
        let result = MakeTwoWayCall({method:'SaveFolder',fileName:AppSessionData.prop('FilterSetFile'),folder:fld});
        return result;        
    }
}

export const ApiWrapper = new ApiWrapperClass();

const baseUrl= `http://${window.location.hostname}:5000/api/`;

export function Dir(handler:(fileList:string[])=>void){
    let srvUrl = baseUrl+'dir';
    httpGet(srvUrl,undefined,handler);
}

// export function LoadFilterSetFile(handler:(resp:IFilterSetFolder[])=>void){
//     let srvUrl = baseUrl+'filterSetFile';
//     httpGet(srvUrl,undefined,handler);
// } 

// export function SaveFolder(payload:IFilterSetFolder,handler:(resp:IApiResponse)=>void){

//     let srvUrl = baseUrl+'updateFilterSetFolder';
//     httpPost(srvUrl,undefined,payload,handler);
// }

function httpGet(addr:string,params:any,handler:any){
    axios({
        url:addr, 
        method:'GET',
        params:params
    })
    .then((response)=>{
        if(handler){
            handler(response.data);
        }
    })
    .catch(err=>{
        let s= 1;
    });
}

function httpPost(addr:string,params:any,payload:any,handler:any){
    axios({
        url:addr, 
        method:'POST',
        params:params,
        data:payload
    })
    .then((response)=>{
        if(handler){
            handler(response.data);
        }
    })
    .catch(err=>{
        let s= 1;
    });    
}