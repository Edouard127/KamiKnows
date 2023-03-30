import {ICore} from "./ICore";
import {ISetting} from "./ISetting";
import KrunkerClient from "../class/KrunkerClient";

export interface IPlugin extends ICore {
    settings: ISetting[]
    readonly client: KrunkerClient
    run(arg0: ISetting<any>): void
}
