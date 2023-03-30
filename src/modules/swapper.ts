import {BrowserWindow} from "electron";
import {readdirSync, writeFileSync} from "fs";
import path from "path"

export default class Swapper {
	public readonly window: BrowserWindow
	public readonly swapDir: string
	public urls: string[]

	public constructor(window: BrowserWindow, swapDir: string) {
		this.window = window;
		this.swapDir = swapDir;
		this.urls = [];
	}

	public recursiveSwapNormal(prefix: string = "") {
		console.log(this.swapDir)
		readdirSync(path.join(this.swapDir, prefix), {withFileTypes: true}).forEach(dirent => {
			if (dirent.isDirectory()) this.recursiveSwapNormal(`${prefix}/${dirent.name}`);
			else {
				let pathname = `${prefix}/${dirent.name}`;
				this.urls.push(
					...(/^\/(?:models|scares|sound|textures|videos)\//.test(pathname)
							? [
								`*://*.krunker.io${pathname}`,
								`*://*.krunker.io${pathname}?*`,
							] : []
					)
				);
			}
		});
	};

	public init() {
		this.recursiveSwapNormal();
		this.window.webContents.session.webRequest.onBeforeRequest({ urls: this.urls }, (details, callback) => {
			const fullpath = new URL(details.url).pathname;
			const resultPath = fullpath.startsWith('/assets/') ? path.join(this.swapDir, fullpath.substring(7)) : path.join(this.swapDir, fullpath);

			// Redirect to the local resource.
			callback({ redirectURL: `kamiknows-swap:/${resultPath}` });
		})

		this.window.webContents.session.webRequest.onHeadersReceived(({ responseHeaders }, callback) => {
			for (const key in responseHeaders) {
				const lowercase = key.toLowerCase();

				// If the credentials mode is 'include', callback normally or the request will error with CORS.
				if (lowercase === 'access-control-allow-credentials' && responseHeaders[key][0] === 'true') return callback(responseHeaders);

				// Response headers may have varying letter casing, so we need to check in lowercase.
				if (lowercase === 'access-control-allow-origin') {
					delete responseHeaders[key];
					break;
				}
			}

			return callback({
				responseHeaders: {
					...responseHeaders,
					'access-control-allow-origin': ['*']
				}
			});
		});
	}
}
