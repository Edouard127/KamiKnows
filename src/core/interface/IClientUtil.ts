export default interface IClientUtil {
	events: Event;
	settings: {
		name: string;
		id: string;
		cat: string;
		type: string;
		options: {[key: string]: string};
		value: boolean | string;
		placeHolder: string;
		needsRestart: boolean;
		info: string;
		html(): string;
		set(v: string): void;
	};
	delayIDs: {};
	setCSetting(name: string, value: any): void;
	delaySetCSetting(name: string, value: any, delay: number): void
	init(): void
}
