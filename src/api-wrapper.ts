import axios from "axios";
import { IApiResponse, IFilterSetFolder, ILogRow } from "./common-types";

export interface ICommonReslult<TResult>{
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

export type TApiTwoWayCall = IGetLogRows;


async function MakeTwoWayCall(payload:TApiTwoWayCall){
    return (window as any).electronAPI.twoWayCall(payload);
}

class ApiWrapperClass{
    GetLogRows(folder:string,dfr:number,dto:number,sevStr:string):Promise<ICommonReslult<ILogRow[]>>{
        let result = MakeTwoWayCall({method:'GetLogRows',logFilesFolder:folder,dFrom:dfr,dTo:dto,severityStr:sevStr});
        return result;
    } 
}

export const ApiWrapper = new ApiWrapperClass();

const baseUrl= `http://${window.location.hostname}:5000/api/`;

export function Dir(handler:(fileList:string[])=>void){
    let srvUrl = baseUrl+'dir';
    httpGet(srvUrl,undefined,handler);
}

export function LoadFilterSetFile(handler:(resp:IFilterSetFolder[])=>void){
    let srvUrl = baseUrl+'filterSetFile';
    httpGet(srvUrl,undefined,handler);
} 

export function SaveFolder(payload:IFilterSetFolder,handler:(resp:IApiResponse)=>void){
    let srvUrl = baseUrl+'updateFilterSetFolder';
    httpPost(srvUrl,undefined,payload,handler);
}

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