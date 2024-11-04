import { ILogRowAction } from "./common-types";

export interface IRAAparams{
    actionRecord:ILogRowAction;
    register:(name:string,description:string)=>boolean;
}