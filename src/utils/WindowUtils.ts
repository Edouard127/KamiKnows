import {BrowserWindow, OpenDevToolsOptions} from "electron"

export default class WindowUtils {
	static openDevToolsWithFallback(window: BrowserWindow, options: OpenDevToolsOptions) {
		let assumeFallback = true;
		window.webContents.openDevTools(options);
		window.webContents.once("devtools-opened", () => { assumeFallback = false; });

		setTimeout(() => {
			if (assumeFallback) {
				// Fallback if openDevTools fails
				window.webContents.closeDevTools();

				const devtoolsWindow = new BrowserWindow();
				devtoolsWindow.setMenuBarVisibility(false);

				window.webContents.setDevToolsWebContents(devtoolsWindow.webContents);
				window.webContents.openDevTools({ mode: "detach" });
				window.once("closed", () => devtoolsWindow.destroy());
			}
		}, 500);
	}
}
