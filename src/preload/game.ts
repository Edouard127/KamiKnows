// @ts-nocheck

import KrunkerClient from "../core/class/KrunkerClient";

export default function start(client: KrunkerClient) {
	// Workaround to avoid getting client popup
	/** @type {object} */
	// @ts-ignore
	(window)["OffCliV"] = true;

	document.addEventListener("DOMContentLoaded", async() => {
		let windowsObserver = new MutationObserver(async() => {
			windowsObserver.disconnect();
			(window)["closeClient"] = close;
			(window)["init"]()
			const settingsWindow = (window)["windows"][0];

			settingsWindow.tabs.basic.push({ name: "KamiKnows", categories: [] })
			settingsWindow.tabs.advanced.push({ name: "KamiKnows", categories: [] })

			// Patch getSettings to fix custom tab bug + settings not displaying issue
			let origGetSettings = settingsWindow.getSettings;
			settingsWindow.getSettings = (...args) => origGetSettings.call(settingsWindow, ...args).replace(/^<\/div>/, "") + getCSettings()
		});
		windowsObserver.observe(document.getElementById("instructions"), { childList: true });

		client.account.init()
		client.account.injectStyles()
	});

	function getCSettings() {
		let tempHTML = "";
		let previousCategory = null;
		client.settings.forEach(entry => {
			if (previousCategory !== entry.category) {
				if (previousCategory) tempHTML += "</div>";
				previousCategory = entry.category;
				tempHTML += `<div class='setHed' id='setHed_${btoa(entry.category)}' onclick='window.windows[0].collapseFolder(this)'><span class='material-icons plusOrMinus'>keyboard_arrow_down</span> ${entry.category}</div><div id='setBod_${btoa(entry.category)}'>`;
			}
			tempHTML += `<div class='settName'${entry.needsRestart
				? ' title="Requires Restart"'
				: ""
			}>${entry.name}${entry.needsRestart
				? ' <span style="color: #eb5656">*</span>'
				: ""
			} ${entry.html()}</div>`;
		})

		return tempHTML ? tempHTML + "</div>" : "";
	}
}

