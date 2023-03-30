import {ISetting} from "./ISetting";
import EventEmitter from "events";
import AccountManager from "../../modules/account-manager";
import RPCHandler from "../../modules/rpc-handler";
import Swapper from "../../modules/swapper";
import WindowManager from "../../modules/window-manager";
import ElectronStore from "electron-store";
import {BrowserWindow, WebContents} from "electron";
import IpcLoader from "../../loaders/ipc-loader";

export default interface IClient {
	browser: BrowserWindow
	readonly config: ElectronStore
	readonly settings: ISetting[]
	readonly account: AccountManager
	readonly ipc: IpcLoader
	readonly rpc: RPCHandler
	swapper: Swapper
	readonly window: WindowManager
	readonly bus: EventEmitter

	// Allow for dynamic setting import :3
	register(...settings: ISetting[]): IClient
	set(settingId: string, value: string | number | boolean): IClient

	initWindow(url: string, webContents: WebContents): BrowserWindow
}
