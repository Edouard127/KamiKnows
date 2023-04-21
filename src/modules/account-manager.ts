import WindowManager from "./window-manager"
import {IAccount} from "../core/interface/IAccount";

const HTML = {
	BTN_INNER: '<div id="accManagerBtn" class="button buttonB bigShadowT" onmouseenter="playTick()" style="display:block;width:300px;text-align:center;padding:15px;font-size:23px;pointer-events:all;padding-bottom:22px;margin-left:-5px;margin-top:5px">Alt-Manager</div>',
	ALT_MENU: '<div id="altAccounts"></div><div id="buttons"><div class="accountButton" id="altAdd">Add new account</div></div>',
	FORM: '<input id="accName" type="text" placeholder="Enter Username" class="accountInput" style="margin-top:25px;" value=""><input id="accPass" type="password" placeholder="Enter Password" class="accountInput"><div id="accResp" style="margin-top:10px;font-size:18px;color:rgba(0,0,0,0.5);"><span style="color:rgba(0,0,0,0.8)"></span></div><div class="accountButton" id="addAccountButtonB" style="">Add Account</div></div></div>',
	STYLE: "#altAdd,#addAccountButtonB{width:100%; color:white}.altAccountsLISTED{margin-right:10px;padding:0!important;background:0 0!important;box-shadow:unset!important; height:auto}.altdeletebtn{display:inline-block;padding:10px 13px;color:#fff;background-color:#ff4747;border-radius:0 4px 4px 0;box-shadow:inset 0 -7px 0 0 #992b2b}.altlistelement{display:inline-block;padding:10px 15px 10px 17px;color:#fff;background-color:#ffc147;border-radius:4px 0 0 4px;box-shadow:inset 0 -7px 0 0 #b08531}.deleteColor{color:#000!important;background-color:#313131!important}"
};


export default class AccountManager {
	public manager: WindowManager
	public add: WindowManager

	public init() {
		this.manager = new WindowManager("accManagerBtn");
		this.add = new WindowManager("altAdd");

		!localStorage.getItem("altAccounts") && localStorage.setItem("altAccounts", "[]");
	}

	public addAccount(account: IAccount) {
		if (account.username.replace(/\s/, "") === "" || account.password.replace(/\s/, "") === "") return alert("Username and Password fields must not be empty.");
		let users = JSON.parse(localStorage.getItem("altAccounts")) as IAccount[]
		if (users.find((e: IAccount) => e.username === account.username)) return alert("This Username has already been added.");
		localStorage.setItem("altAccounts", JSON.stringify(
			users.concat(account)
		));
		this.add.hide();
		return this.openPopup();
	};


	public deleteAccount(name: string) {
		localStorage.setItem("altAccounts", JSON.stringify(
			JSON.parse(localStorage.getItem("altAccounts")).filter((e: IAccount) => e.username !== name)
		));
		this.manager.hide();
		this.openPopup();
	};


	public login(account: IAccount) {
		//@ts-ignore
		(window).logoutAcc();
		(<HTMLInputElement>document.getElementById("accName")).value = account.username;
		(<HTMLInputElement>document.getElementById("accPass")).value = account.password;
		(<HTMLInputElement>document.getElementById("accName")).style.display = "none";
		(<HTMLInputElement>document.getElementById("accPass")).style.display = "none";
		//@ts-ignore
		(window).loginAcc();
		//@ts-ignore
		(window).loginAcc();
		(<HTMLInputElement>document.getElementsByClassName("accountButton")[0]).style.display = "none";
		//@ts-ignore
		console.log(window.loginAcc)
	};

	public openPopup() {
		this.manager.setContent(HTML.ALT_MENU);
		this.manager.toggle();
		this.watcher();
	};

	public watcher() {
		let storage = JSON.parse(localStorage.getItem("altAccounts"));

		document.getElementById("altAdd").addEventListener("click", () => {
			this.manager.hide();
			this.add.setContent(HTML.FORM);
			this.add.show();
			document.getElementById("addAccountButtonB").addEventListener("click", () => (
				this.addAccount({
					username: (<HTMLInputElement>document.getElementById("accName")).value,
					password: (<HTMLInputElement>document.getElementById("accPass")).value
				})
			));
		});

		storage.forEach((e: IAccount) => {
			const div = document.createElement("div");
			div.innerHTML = `<span class="altlistelement" onmouseenter="playTick()">${e.username}</span><span class="altdeletebtn" onmouseenter="playTick()">X</span>`;
			div.className = "button altAccountsLISTED";
			document.getElementById("altAccounts").appendChild(div);
		});

		document.querySelectorAll(".altlistelement").forEach(i => i.addEventListener("click", (e) => {
			//@ts-ignore
			let selected = storage.find(obj => obj.username === (e.target).innerText);
			this.login({
				username: selected.username,
				password: (!!selected.format && selected.format === "b64")
				? Buffer.from(String(selected.password), "base64").toString("ascii")
				: selected.password
			});
			this.manager.hide();
		}));

		document.querySelectorAll(".altdeletebtn").forEach(i => i.addEventListener("click", (e) => {
			// @ts-ignore
			let tar = e.target.previousElementSibling.innerText;
			confirm(`Do you really want to remove the account "${tar}" from the Alt-Manager?`) && this.deleteAccount(tar);
		}));
	};

	public injectStyles() {
		document.head.appendChild(Object.assign(document.createElement("style"), { innerText: HTML.STYLE }));
		let tar = document.getElementById("customizeButton");

		let tmp = document.createElement("div");
		tmp.innerHTML = HTML.BTN_INNER.trim();

		tar.parentNode.insertBefore(tmp.firstChild, tar.nextSibling);
		document.getElementById("accManagerBtn").addEventListener("click", () => this.openPopup());
	}
}

