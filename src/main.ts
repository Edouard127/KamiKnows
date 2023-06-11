import {app, protocol} from "electron";
import Store from "electron-store";
import log from "electron-log";
import yargs from "yargs";
import {cliSwitchHandler} from "./modules/cli-switches";
import KrunkerClient from "./core/class/KrunkerClient";
import {ExportSetting} from "./core/settings/export";
import PathUtils from "./utils/PathUtils";
import path from "path";

Object.assign(console, log.functions)

console.log(`KamiKnows@${app.getVersion()} { Electron: ${process.versions.electron}, Node: ${process.versions.node}, Chromium: ${process.versions.chrome} }`);

if (!app.requestSingleInstanceLock()) app.quit();

const config = new Store();

cliSwitchHandler(app, config);

const krunkerClient = new KrunkerClient(config, ExportSetting)

if (process.platform === "win32") {
	app.setUserTasks([
		{
			program: process.execPath,
			arguments: "--new-window=https://krunker.io/",
			title: "New game window",
			description: "Opens a new game window",
			iconPath: process.execPath,
			iconIndex: 0,
		},
		{
			program: process.execPath,
			arguments: "--new-window=https://krunker.io/social.html",
			title: "New social window",
			description: "Opens a new social window",
			iconPath: process.execPath,
			iconIndex: 0,
		},
	]);
}

protocol.registerSchemesAsPrivileged([
	{
		scheme: "kamiknows-swap",
		privileges: {
			secure: true,
			corsEnabled: true,
			bypassCSP: true
		},
	},
]);

app.once("ready", async () => {
	const home = PathUtils.getHomeFolder()
	await PathUtils.ensureDirs(path.join(home, "kamiknows/swap"), path.join(home, "kamiknows/scripts"));
	protocol.registerFileProtocol("kamiknows-swap", (request, callback) => callback(decodeURI(request.url.replace(/^kamiknows-swap:/u, ""))));
	app.on("second-instance", (_, _argv) => {
		const instanceArgv = yargs.parse(_argv);
		// @ts-ignore
		krunkerClient.initWindow(instanceArgv["new-window"], null)
	});

	// Fix the process running in the background
	app.on('window-all-closed', () => {
		app.quit();
	});

	krunkerClient.initWindow("https://krunker.io/", null)
});
