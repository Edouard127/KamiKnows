import {SettingType} from "../interface/SettingType";
import AbstractSetting from "./abstract/AbstractSetting";
import {getSettingId} from "../../utils/SettingUtils";
import {genCSettingsHTML} from "../../utils/HTMLgen";
import {ISetting} from "../interface/ISetting";

export default class SelectSetting extends AbstractSetting<SettingType.Select> {
    override readonly name: string;
    override readonly id: string;
    value: string;
    readonly options: {[key: string]: string};
    override readonly category: string;
    override readonly type = SettingType.Select
    override readonly info?: string;
    override readonly needsRestart: boolean;
    override onSet: (v: ISetting<SettingType.Select>) => void

    public constructor(name: string, value: string, options: {[key: string]: string}, category: string, needsRestart: boolean, info?: string) {
        super(name, getSettingId(name), category, needsRestart, info);
        this.name = name
        this.id = getSettingId(name)
        this.value = value
        this.options = options
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
