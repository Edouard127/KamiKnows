import {SettingType} from "../interface/SettingType";
import AbstractSetting from "./abstract/AbstractSetting";
import {getSettingId} from "../../utils/SettingUtils";
import {genCSettingsHTML} from "../../utils/HTMLgen";
import {ISetting} from "../interface/ISetting";

export default class TextSetting extends AbstractSetting<SettingType.Text> {
    override readonly name: string;
    override readonly id: string;
    value: string;
    override readonly category: string;
    override readonly type = SettingType.Text
    override readonly info: string;
    override readonly needsRestart: boolean;
    override onSet: (v: ISetting<SettingType.Text>) => void

    public constructor(name: string, value: string, category: string, needsRestart: boolean, info?: string) {
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

    override set(value: string): void {
        this.value = value
        if (this.onSet) this.onSet(this)
    }
}
