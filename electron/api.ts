import { BrowserWindow } from 'electron';
import * as fs  from 'fs';
import * as path from 'path';
import {deleteFilterSetFolder, processLineByLine, readFilterSetFile, updateFilterSetFolder,updateFilterSetFolderAsync} from './files-helper';
import { ICommonReslult, TApiTwoWayCall, IGetLogRows } from '../src/api-wrapper';
import { ILogRow } from '../src/common-types';

export async function HandleTwoWayCall(event: any, payload: TApiTwoWayCall) {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    if (!win) {
        return;
    }
    switch (payload.method) {
        case 'GetLogRows':
            return GetLogRowsImpl(payload);
    }
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

    let response: ICommonReslult<ILogRow[]> = {
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
            let re = /(debug|info|error).log.(\d\d\d\d)(\d\d)(\d\d)/;
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