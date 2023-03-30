import {BrowserWindow, ipcMain, app, WebContents} from "electron";
import {Presence} from "discord-rpc";
import ElectronStore from "electron-store";
import KrunkerClient from "../core/class/KrunkerClient";

export default class IpcLoader {
	public krunker: KrunkerClient
	public config: ElectronStore

	public constructor(client: KrunkerClient, config: ElectronStore) {
		this.krunker = client
		this.config = config
	}

	public load() {
		ipcMain.handle("get-app-info", () => ({
			name: app.name,
			version: app.getVersion(),
			documentsDir: app.getPath("documents")
		}));

		ipcMain.on("get-path", (event, name) => (event.returnValue = app.getPath(name)));

		ipcMain.handle("set-bounds", (event, bounds) => BrowserWindow
			.fromWebContents(event.sender)
			.setBounds(bounds));

		ipcMain.handle("get-settings", (event, bounds) => this.krunker.settings)
	}

	public initRpc() {
		let lastSender: WebContents = null;
		ipcMain.handle("rpc-activity", async(event, activity: Presence) => {
			if (this.krunker.rpc.enabled) {
				if (lastSender !== event.sender) {
					if (lastSender) lastSender.send("rpc-stop");
					lastSender = event.sender;
					lastSender.on("destroyed", () => { lastSender = null });
				}
				await this.krunker.rpc.update(activity)
			}
		});

		this.krunker.rpc.start().catch()
		app.on("quit", async() => await this.krunker.rpc.end().catch());
	}
}
