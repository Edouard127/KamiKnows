import ElectronStore from "electron-store";
import * as Events from "events";
import {ISetting} from "./ISetting";

export interface IUserscriptMeta {
	author?: string;
	name?: string;
	version?: string;
	description?: string;
}

export interface IUserscriptConfig {
	apiversion?: "1.0";
	locations?: ("all"|"docs"|"game"|"social"|"viewer"|"editor"|"unknown")[]|string[];
	platforms?: ("all")[]|string[];
	settings?: ISettingsCollection;
};
export interface IInjectedContext {
	clientUtils: IClientUtil;
	console: {
		log(...args): void;
	};
}

export interface IUserscript extends IInjectedContext {
	config: IUserscriptConfig;
	meta: IUserscriptMeta;
	load(config: ElectronStore): void;
	unload(): void;
}

export interface IClientUtil {
	events: Events;
	delayIDs: {};
	setCSetting(name: string, value: any): void;
	delaySetCSetting(name: string, value: any, delay: number): void;
	genCSettingsHTML(s: ISetting): string;
	searchMatches(i: ISetting)
	init(): void;
}
