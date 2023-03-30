import {SettingType} from "./SettingType";
import CheckboxSetting from "../class/CheckboxSetting";
import SelectSetting from "../class/SelectSetting";
import SliderSetting from "../class/SliderSetting";
import TextSetting from "../class/TextSetting";

export interface ISetting<Type extends SettingType = SettingType> {
	readonly name: string;
	readonly id: string;
	readonly category: string;
	readonly type: Type;
	readonly info?: string;
	readonly needsRestart?: Boolean;
	onSet: (v: any) => void;
	html(): string;
	set?(value: any): void;
	setFunction(f: (v: ISetting<Type>) => void): ISetting<Type>

	isCheckBox(): this is CheckboxSetting
	isSlider(): this is SliderSetting
	isSelect(): this is SelectSetting
	isText(): this is TextSetting
}
