import IClient from "../../interface/IClient";
import {ISetting} from "../../interface/ISetting";
import EventEmitter from "events";
import AccountManager from "../../../modules/account-manager";
import RPCHandler from "../../../modules/rpc-handler";
import Swapper from "../../../modules/swapper";
import WindowManager from "../../../modules/window-manager";
import ElectronStore from "electron-store";
import {BrowserWindow} from "electron";
import IpcLoader from "../../../loaders/ipc-loader";

export default abstract class AbstractClient implements IClient {
	abstract browser: BrowserWindow
	abstract readonly config: ElectronStore
	abstract readonly settings: ISetting[]
	abstract readonly account: AccountManager
	abstract readonly ipc: IpcLoader
	abstract readonly rpc: RPCHandler
	abstract swapper: Swapper
	abstract readonly window: WindowManager
	abstract readonly bus: EventEmitter

	protected constructor(config: ElectronStore, settings: ISetting[]) {}

	abstract register(...settings: ISetting[]): IClient
	abstract set(settingId: string, value: string | number | boolean): IClient
	abstract initWindow(url: string, webContents: Electron.WebContents): BrowserWindow
	protected abstract loadWindow(debug: boolean): BrowserWindow
	protected abstract registerPlugins(): void
}

