import {SettingType} from "../../interface/SettingType";
import {ISetting} from "../../interface/ISetting";
import CheckboxSetting from "../CheckboxSetting";
import SelectSetting from "../SelectSetting";
import SliderSetting from "../SliderSetting";
import TextSetting from "../TextSetting";

export default abstract class AbstractSetting<T extends SettingType> implements ISetting<T> {
	abstract readonly name: string;
	abstract readonly id: string;
	abstract readonly category: string;
	abstract readonly type: T;
	abstract readonly info?: string;
	abstract readonly needsRestart: boolean;
	abstract onSet: (v: ISetting<T>) => void;

	protected constructor(name: string, id: string, category: string, needsRestart: boolean, info?: string) {}

	abstract html(): string
	abstract set(value: any): void

	public setFunction(f: (v: ISetting<T>) => void): ISetting<T> {
		this.onSet = f
		return this
	}

	public isCheckBox(): this is CheckboxSetting {
		return this.type === SettingType.CheckBox
	}

	public isSlider(): this is SliderSetting {
		return this.type === SettingType.Slider
	}

	public isSelect(): this is SelectSetting {
		return this.type === SettingType.Select
	}

	public isText(): this is TextSetting {
		return this.type === SettingType.Text
	}
}


