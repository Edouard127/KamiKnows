import AbstractClient from "./abstract/AbstractClient";
import {ISetting} from "../interface/ISetting";
import EventEmitter from "events";
import AccountManager from "../../modules/account-manager";
import RPCHandler from "../../modules/rpc-handler";
import Swapper from "../../modules/swapper";
import WindowManager from "../../modules/window-manager";
import ElectronStore from "electron-store";
import {app, BrowserWindow, clipboard, dialog, shell} from "electron";
import PathUtils from "../../utils/PathUtils";
import path from "path";
import WindowUtils from "../../utils/WindowUtils";
import UrlUtils from "../../utils/UrlUtils";
import shortcuts from "electron-localshortcut";
import IpcLoader from "../../loaders/ipc-loader";
import LoadPlugin from "../../utils/LoadPlugin";

export default class KrunkerClient extends AbstractClient {
	public override browser: BrowserWindow
	public override readonly config: ElectronStore
	public override readonly settings: ISetting[]
	public override readonly account: AccountManager
	public override readonly ipc: IpcLoader
	public override readonly rpc: RPCHandler
	public override swapper: Swapper
	public override readonly window: WindowManager
	public override readonly bus: EventEmitter

	public constructor(config: ElectronStore, settings: ISetting[]) {
		super(config, settings);
		this.config = config
		this.settings = settings
		this.account = new AccountManager()
		this.rpc = new RPCHandler("1117513370002788512", (config.get("discordRPC", true) as boolean))
		this.ipc = new IpcLoader(this, config)
		this.bus = new EventEmitter()
		this.registerPlugins()
	}

	override register(...settings: ISetting[]): KrunkerClient {
		this.settings.push(...settings)
		return this
	}

	override set<T>(settingId: string, value: T): KrunkerClient {
		const setting = this.settings.find(e => e.id === settingId)
		setting.set(value)
		return this
	}

	override initWindow(url: string, webContents: Electron.WebContents): BrowserWindow {
		const window = new BrowserWindow({
			width: 1600,
			height: 900,
			show: false,
			webPreferences: {
				preload: path.join(__dirname, "../../preload/global.js"),
				enableRemoteModule: false,
				spellcheck: false,
				nodeIntegration: false,
			},
		});

		this.browser = window

		this.loadWindow(true); // I'll fix that later

		if (!webContents) window.loadURL(url);

		return window;
	}

	protected override loadWindow(debug: boolean): BrowserWindow {
		const contents = this.browser.webContents;

		if (debug) WindowUtils.openDevToolsWithFallback(this.browser, {mode: "right"})

		this.browser.removeMenu();
		this.browser.once("ready-to-show", () => {
			const windowType = UrlUtils.locationType(contents.getURL());

			this.browser.on("maximize", () => this.config.set(`windowState.${windowType}.maximized`, true));
			this.browser.on("unmaximize", () => this.config.set(`windowState.${windowType}.maximized`, false));
			this.browser.on("enter-full-screen", () => this.config.set(`windowState.${windowType}.fullScreen`, true));
			this.browser.on("leave-full-screen", () => this.config.set(`windowState.${windowType}.fullScreen`, false));

			const windowStateConfig = this.config.get(`windowState.${windowType}`, {});
			// @ts-ignore
			if (windowStateConfig.maximized) this.browser.maximize();
			// @ts-ignore
			if (windowStateConfig.fullScreen) this.browser.setFullScreen(true);

			this.ipc.load()
			this.ipc.initRpc()

			this.browser.show();
		});

		const isMac = process.platform === "darwin";
		shortcuts.register(this.browser, [isMac ? "Command+Option+I" : "Control+Shift+I", "F12"], () =>
			WindowUtils.openDevToolsWithFallback(this.browser, {mode: "right"})
		);
		shortcuts.register(this.browser, isMac ? "Command+Left" : "Alt+Left", () =>
			contents.canGoBack() && contents.goBack()
		);
		shortcuts.register(this.browser, isMac ? "Command+Right" : "Alt+Right", () =>
			contents.canGoForward() && contents.goForward()
		);
		shortcuts.register(this.browser, "CommandOrControl+Shift+Delete", () => {
			contents.session.clearCache().then(() => {
				app.relaunch();
				app.quit();
			});
		});
		shortcuts.register(this.browser, "Escape", () =>
			contents.executeJavaScript("document.exitPointerLock()", true)
		);
		shortcuts.register(this.browser, "Control+F1", () => {
			this.config.clear();
			app.relaunch();
			app.quit();
		});
		shortcuts.register(this.browser, "Shift+F1", () => this.config.openInEditor());

		this.browser.once("ready-to-show", () => {
			let windowType = UrlUtils.locationType(contents.getURL());

			this.browser.on("maximize", () => this.config.set(`windowState.${windowType}.maximized`, true));
			this.browser.on("unmaximize", () => this.config.set(`windowState.${windowType}.maximized`, false));
			this.browser.on("enter-full-screen", () => this.config.set(`windowState.${windowType}.fullScreen`, true));
			this.browser.on("leave-full-screen", () => this.config.set(`windowState.${windowType}.fullScreen`, false));

			const windowStateConfig = this.config.get(`windowState.${windowType}`, {});
			// @ts-ignore
			if (windowStateConfig.maximized) this.browser.maximize();
			// @ts-ignore
			if (windowStateConfig.fullScreen) this.browser.setFullScreen(true);
		});

		contents.on("dom-ready", () => {
			UrlUtils.locationType(contents.getURL()) === "game" &&
			shortcuts.register(this.browser, "F6", () => this.browser.loadURL("https://krunker.io/"))
		});

		contents.on("new-window", (event, url, frameName, disposition, options) => {
			event.preventDefault();
			if (UrlUtils.locationType(url) === "external") shell.openExternal(url);
			else if (UrlUtils.locationType(url) !== "unknown") {
				if (frameName === "_self") contents.loadURL(url);
				else this.initWindow(url, null);
			}
		});

		contents.on("will-navigate", (event, url) => {
			event.preventDefault();
			if (UrlUtils.locationType(url) === "external") shell.openExternal(url);
			else if (UrlUtils.locationType(url) !== "unknown") contents.loadURL(url);
		});

		contents.on("will-prevent-unload", (event) => {
			if (
				!dialog.showMessageBoxSync({
					buttons: ["Leave", "Cancel"],
					title: "Leave site?",
					message: "Changes you made may not be saved.",
					noLink: true,
				})
			)
				event.preventDefault();
		});

		shortcuts.register(this.browser, "F5", () => contents.reload());
		shortcuts.register(this.browser, "Shift+F5", () => contents.reloadIgnoringCache());
		shortcuts.register(this.browser, "F11", () => this.browser.setFullScreen(!this.browser.isFullScreen()));
		shortcuts.register(this.browser, "CommandOrControl+L", () => clipboard.writeText(contents.getURL()));
		shortcuts.register(this.browser, "CommandOrControl+N", () => this.initWindow("https://krunker.io/", null));
		shortcuts.register(this.browser, "CommandOrControl+Shift+N", () => this.initWindow(contents.getURL(), null))
		shortcuts.register(this.browser, "CommandOrControl+Alt+R", () => {
			app.relaunch();
			app.quit();
		});

		const swapDir = this.config.get("resourceSwapper", true) as boolean; // I'll fix this later
		if (swapDir) {
			const home = PathUtils.getHomeFolder()
			PathUtils.ensureDirs(path.join(home, "kamiknows/swap"));
			this.swapper = new Swapper(this.browser, path.join(home, "kamiknows/swap"))
			this.swapper.init()
		}

		return this.browser;
	}

	protected override async registerPlugins() {
		const plugins = await LoadPlugin(this)
		plugins.forEach(p => {
			p.settings.forEach(s => s.setFunction(p.run))
			this.register(...p.settings)
		})
	}
}
