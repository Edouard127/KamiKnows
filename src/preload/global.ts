// @ts-nocheck

import KrunkerClient from "../core/class/KrunkerClient";

require("v8-compile-cache");

import UrlUtils from "../utils/UrlUtils";
import {ipcRenderer} from "electron"
import log from "electron-log";
import start from "./game"
import {ExportSetting} from "../core/settings/export";
import ElectronStore from "electron-store";

const config = new ElectronStore()

Object.assign(console, log.functions);
localStorage.setItem("logs", "true");

const windowType = UrlUtils.locationType(location.href);
const delayIDs = {}

const tempClient = new KrunkerClient(config, ExportSetting)
start(tempClient.settings)


window.prompt = (message, defaultValue) => ipcRenderer.sendSync("prompt", message, defaultValue);
window["setCSetting"] = (name: string, value: any) => {
	const entry = ExportSetting.find(e => e.id === name)
	const newValue = entry.isSlider() ? Math.max(entry.min, Math.min(value, entry.max)) : value

	config.set(name, newValue);
	entry.set(newValue)

	let element = (<HTMLInputElement>document.getElementById("c_slid_" + entry.id));
	if (element) element.value = newValue;

	element = (<HTMLInputElement>document.getElementById("c_slid_input_" + entry.id));
	if (element) element.value = newValue;
}
window["delaySetCSetting"] = (name: string, target: any, delay: number = 600) => {
	if (delayIDs[name]) clearTimeout(delayIDs[name]);
	delayIDs[name] = setTimeout(() => {
		this.setCSetting(name, target.value);
		delete delayIDs[name];
	}, delay);
}
window["init"] = () => {
	tempClient.settings.forEach(entry => {
		const savedVal = config.get(entry.id, null);

		if (entry.isSlider()) entry.set(Math.max(entry.min, Math.min(entry.value, entry.max)))
		if (entry.isCheckBox()) entry.set(savedVal)
		if (entry.isText() || entry.isSelect()) entry.set(savedVal)
	})
}

if (windowType === "game") require("./game");

let rpcIntervalId;

function setFocusEvent() {
	window.addEventListener("focus", () => {
		let rpcActivity = {
			largeImageKey: "idkr-logo",
			largeImageText: "idkr client",
			endTimestamp: 0,
			state: "",
		};

		function sendRPCGamePresence() {
			try {
				const gameActivity = (window)["getGameActivity"]();

				Object.assign(rpcActivity, {
					state: gameActivity.map,
					details: gameActivity.mode
				});

				if (gameActivity.time) rpcActivity.endTimestamp = Date.now() + gameActivity.time * 1000;
				ipcRenderer.invoke("rpc-activity", rpcActivity);
			}
			catch (error) {
				ipcRenderer.invoke("rpc-activity", Object.assign(rpcActivity, {
					state: "Playing",
					startTimestamp: Math.floor(Date.now() / 1000)
				}));
			}
		}

		let isIntervalSet = false;
		switch (windowType) {
			case "game": {
				sendRPCGamePresence();
				if (rpcIntervalId) clearInterval(rpcIntervalId);
				rpcIntervalId = setInterval(sendRPCGamePresence, 5e3);
				isIntervalSet = true;
				break;
			}
			case "docs":
				rpcActivity.state = "Reading Docs";
				break;
			case "social":
				rpcActivity.state = "In the Hub";
				break;
			case "viewer":
				rpcActivity.state = "In the Texture Viewer";
				break;
			case "editor":
				rpcActivity.state = "In the Editor";
				break;
			default:
				rpcActivity.state = "Unknown";
				break;
		}

		if (!isIntervalSet) {
			ipcRenderer.invoke("rpc-activity", Object.assign(rpcActivity, {
				startTimestamp: Math.floor(performance.timeOrigin / 1000)
			}));
		}
	}, { once: true });
}

ipcRenderer.on("rpc-stop", () => {
	setFocusEvent();
	if (rpcIntervalId) clearInterval(rpcIntervalId);
});

setFocusEvent();

window.addEventListener("unload", () => {
	ipcRenderer.invoke("rpc-activity", {
		state: "Idle",
		startTimestamp: Math.floor(Date.now() / 1000),
		largeImageKey: "idkr-logo",
		largeImageText: "idkr client"
	});
});
