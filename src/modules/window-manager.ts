import Store from "electron-store"
import { baseStyles } from "./styles-injection"

const config = new Store();

export default class WindowManager {
	public readonly callerId: string;
	public readonly hideOnShow: boolean;
	public shown: boolean

	public constructor(callerId: string, hideKrunkerWindowsOnShow: boolean = true) {
		this.callerId = callerId;
		this.hideOnShow = hideKrunkerWindowsOnShow;
		this.shown = false;

		if (!document.getElementById("kamiknows-windowHolder")) {
			let w = document.createElement("div");
			w.setAttribute("id", "kamiknows-windowHolder");
			w.setAttribute("style", "display: none;");
			w.innerHTML = '<div id="kamiknows-menuWindow"></div>';
			document.getElementsByTagName("body")[0].appendChild(w);

			let s = document.createElement("style");
			s.setAttribute("class", this.randomStr(10));
			s.setAttribute("id", this.randomStr(10));
			s.innerHTML = baseStyles;
			if (config.get("enableMenuTimer")) s.innerHTML += require("./styles-injection").menuTimerStyles;
			document.getElementsByTagName("body")[0].appendChild(s);

			document.getElementsByTagName("body")[0].addEventListener("click", e => {
				// @ts-ignore
				(!e.path.find(p => p.id === "kamiknows-menuWindow" || p.id === this.callerId)) && this.hide();
			});
		}
	}

	public randomStr(length: number) {
		return [...Array(length)].map(() => Math.random().toString(36)[2]).join("");
	};

	public setContent(content: string) {
		document.getElementById("kamiknows-menuWindow").innerHTML = content;
	}

	public show() {
		if (this.hideOnShow) document.getElementById("windowHolder").setAttribute("style", "display: none;");
		document.getElementById("kamiknows-windowHolder").setAttribute("style", "display: block;");
		this.shown = true;
	}

	public hide() {
		document.getElementById("kamiknows-windowHolder").setAttribute("style", "display: none;");
		this.shown = false;
	}

	public toggle() {
		this.shown ? this.hide() : this.show();
	}

}
