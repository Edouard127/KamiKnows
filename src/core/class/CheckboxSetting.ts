import {SettingType} from "../interface/SettingType";
import AbstractSetting from "./abstract/AbstractSetting";
import {getSettingId} from "../../utils/SettingUtils";
import {genCSettingsHTML} from "../../utils/HTMLgen";
import {ISetting} from "../interface/ISetting";

export default class CheckboxSetting extends AbstractSetting<SettingType.CheckBox> {
    override readonly name: string;
    override readonly id: string;
    value: boolean;
    override readonly category: string;
    override readonly type = SettingType.CheckBox
    override readonly info: string;
    override readonly needsRestart: boolean;
    override onSet: (v: ISetting<SettingType.CheckBox>) => void

    public constructor(name: string, value: boolean, category: string, needsRestart: boolean, info?: string) {
        super(name, getSettingId(name), category, needsRestart, info);
        this.name = name
        this.id = getSettingId(name)
        this.value = value
        this.category = category
        this.needsRestart = needsRestart
        this.info = info
    }

    override html(): string {
        return genCSettingsHTML(this)
    }

    override set(value: boolean): void {
        this.value = value
        if (this.onSet) this.onSet(this)
    }
}
