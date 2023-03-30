import {App} from "electron";
import ElectronStore from "electron-store";
import yargs from "yargs"

export const cliSwitchHandler = (app: App, config: ElectronStore) => {
	const angleBackend = config.get("angleBackend", "default") as string;
	const colorProfile = /** @type {string} */ (config.get("colorProfile", "default")) as string;

	app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");

	if (config.get("acceleratedCanvas", true)) app.commandLine.appendSwitch("disable-accelerated-2d-canvas");
	if (config.get("softwareRasterization", true)) app.commandLine.appendSwitch("disable-software-rasterizer")
	if (config.get("2dCanvasClipAA", true)) app.commandLine.appendSwitch("disable-2d-canvas-clip-aa")
	if (config.get("disableFrameRateLimit", true)) {
		app.commandLine.appendSwitch("disable-frame-rate-limit");
		app.commandLine.appendSwitch("disable-gpu-vsync");
	}
	if (config.get("inProcessGPU", false)) app.commandLine.appendSwitch("in-process-gpu");
	if (angleBackend !== "default") app.commandLine.appendSwitch("use-angle", angleBackend);
	if (colorProfile !== "default") app.commandLine.appendSwitch("force-color-profile", colorProfile);

	// @ts-ignore
	yargs.parse(
		(config.get("chromiumFlags", "") as string),
		// @ts-ignore
		(_, argv) => Object.entries(argv).slice(1, -1).forEach(entry => app.commandLine.appendSwitch(entry[0], entry[1]))
	);
};
