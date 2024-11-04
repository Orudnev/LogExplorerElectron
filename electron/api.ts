import { BrowserWindow, app } from 'electron';
import * as fs  from 'fs';
import * as path from 'path';
import {deleteFilterSetFolder, processLineByLine, readFilterSetFile, updateFilterSetFolder,updateFilterSetFolderAsync} from './files-helper';
import { ICommonResult, TApiTwoWayCall, IGetLogRows, ILoadFilterSetFile, ISaveFolder, IGetActions } from '../src/api-wrapper';
import { IFilterSetFolder, ILogRow, ILogRowAction } from '../src/common-types';


export async function HandleTwoWayCall(event: any, payload: TApiTwoWayCall) {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    if (!win) {
        return;
    }
    switch (payload.method) {
        case 'LoadFilterSetFile':
            return LoadFilterSetFileImpl(payload);
        case 'GetLogRows':
            return GetLogRowsImpl(payload);
        case 'SaveFolder':
            return SaveFolderImpl(payload);
        case 'CurrDir':
            return CurrDirImpl(payload);
        case 'GetActions':
            return GetActionsImpl(payload)
    }
}


async function CurrDirImpl(pl:any){
    return app.getAppPath();
}

const defaultFilterSetFolder: IFilterSetFolder[] = [
    { 
        name: 'Default', 
        description: '', 
        filterSetList: [{ name: "TestFilterSet", description: "", filterTree: []}] 
    } 
];


function LoadFilterSetFileImpl(params:ILoadFilterSetFile):IFilterSetFolder[]{
    let filePath = params.fileName;
    if (!fs.existsSync(filePath)) {
      return defaultFilterSetFolder;
    }
    let fileBody = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' });
    let result:IFilterSetFolder[] = JSON.parse(fileBody);
    return result;
}


async function GetLogRowsImpl(params: IGetLogRows) {
    let filePath = "";
    let logFileFolder: string = "";
    let allFiles: string[] = [];
    let tsFrom = params.dFrom.toString();
    let tsTo = tsFrom;
    let tsnFrom = 0;
    let tsnTo = 0;
    let dfrom = new Date();
    let dto = new Date();
    let clearTime = (d: Date) => {
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);
    };
    let logFiles: string[] = [];
    let respList: ILogRow[] = [];
    let severityStr = "debuginfoerror";
    if (params.severityStr) {
        severityStr = params.severityStr.toLowerCase();
    }
    let isSeverityMatched = (sevValue: string) => {
        return severityStr.includes(sevValue);
    }

    let response: ICommonResult<ILogRow[]> = {
        isOk: false,
        result: undefined,
        error: undefined
    }

    if (!params.logFilesFolder) {
        response.error = `Отсутствует параметр folder`;
    }
    if (!params.dFrom) {
        response.error = `Отсутствует параметр dateFrom`;
    }
    if (!response.error) {
        if (params.logFilesFolder) {
            logFileFolder = params.logFilesFolder;
        }
        if (logFileFolder && !fs.existsSync(logFileFolder)) {
            response.error = `Папка ${logFileFolder} не найдена`;
        }
        if (logFileFolder) {
            allFiles = fs.readdirSync(logFileFolder).map(fileName => { return fileName });
        }
        if (allFiles.length === 0) {
            response.error = `Папка ${logFileFolder} пустая`;
        }
        if (params.dTo) {
            tsTo = params.dTo.toString();
        }
        if (tsFrom && tsTo) {
            tsnFrom = parseInt(tsFrom);
            tsnTo = parseInt(tsTo);
        }
        if (isNaN(tsnFrom) || isNaN(tsnTo)) {
            response.error = 'Неверный формат значения в параметрах dateFrom или dateTo (должно быть число)';
        }
    }
    if (!response.error) {
        dfrom = new Date(tsnFrom);
        dto = new Date(tsnTo);
        clearTime(dfrom);
        clearTime(dto);
        logFiles = allFiles.filter(fname => {
            let re = /(debug|Debug|info|error).log.(\d\d\d\d)(\d\d)(\d\d)/;
            let m = fname.match(re);
            if (m?.length !== 5) {
                return false;
            }
            let svr = m[1].toString().toLocaleLowerCase();
            if (!isSeverityMatched(svr)) {
                return false;
            }
            let year = parseInt(m[2]);
            let month = parseInt(m[3]);
            let day = parseInt(m[4]);
            if (isNaN(year) || isNaN(month) || isNaN(day)) {
                return false;
            }
            let monthInd = month - 1;
            let fileDate = new Date(year, monthInd, day);
            let result = dfrom <= fileDate && fileDate <= dto;
            return result;
        });
        for (let i = 0; i < logFiles.length; i++) {
            let fname = logFiles[i];

            let filePath = path.join(logFileFolder, fname);
            let r = await processLineByLine(filePath, respList.length);
            respList = [...respList, ...r];
        }
        respList.sort((a, b) => {
            if (a.Date && b.Date) {
                return a.Date.getTime() - b.Date.getTime();
            }
            if (!a && !b) return 0;
            return a ? 1 : -1;
        });
        respList.forEach((itm, idx) => { itm.id = idx });
        response.result = respList;
        response.isOk = true;
    }
    return response;
}

async function SaveFolderImpl(params:ISaveFolder){
    let fsetFolder:IFilterSetFolder = params.folder;
    let filterSetFileData = LoadFilterSetFileImpl({method:'LoadFilterSetFile',fileName:params.fileName});
    let itemIndex = filterSetFileData.findIndex(itm => itm.name === fsetFolder.name);
    if (itemIndex === -1) {
      filterSetFileData.push(fsetFolder);
    } else { 
      filterSetFileData[itemIndex] = fsetFolder;
    }
    let updatedFileJson = JSON.stringify(filterSetFileData);
    let fpath = path.parse(params.fileName);
    let fdir = fpath.dir;
    if (!fs.existsSync(fdir)) {
      fs.mkdirSync(fdir);
    }    
    fs.writeFileSync(params.fileName, updatedFileJson,{flag:'w'});    
}

async function GetActionsImpl(params:IGetActions){
    let response: ICommonResult<ILogRowAction[]> = {
        isOk: true,
        result: [],
        error: ""
    }
    let allFiles = fs.readdirSync(params.folderPath).map(fileName => { return fileName }); 
    allFiles.forEach(jsFileName=>{
        let fname = jsFileName;
        let filePath = path.join(params.folderPath, fname);  
        try{
            const data = fs.readFileSync(filePath,'utf-8');
            const regex = /^((?:\/\/[^\n]*\n?)*)\s*([\s\S]*)$/m;
            let m = regex.exec(data);
            if(m?.length !== 3){
                response.isOk = false;
                response.error = `Неверный формат файла ${filePath}`;
                return response;
            }
            //@ts-ignore
            let ainfo = JSON.parse(m[1].replaceAll("//",""));
            let srcCode = m[2];
            ainfo.name = path.parse(fname).name;
            const newItem:ILogRowAction = {
                info:ainfo,
                jsSourceCode:srcCode
            };
            response.result?.push(newItem);
        } catch(error){
            response.isOk = false;
            response.error = JSON.stringify(error);
        }
    })
    return response;
}