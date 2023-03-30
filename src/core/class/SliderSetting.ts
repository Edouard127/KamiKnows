import {SettingType} from "../interface/SettingType";
import AbstractSetting from "./abstract/AbstractSetting";
import {getSettingId} from "../../utils/SettingUtils";
import {genCSettingsHTML} from "../../utils/HTMLgen";
import {ISetting} from "../interface/ISetting";

export default class SliderSetting extends AbstractSetting<SettingType.Slider> {
    override readonly name: string;
    override readonly id: string;
    readonly max: number;
    readonly min: number;
    readonly step: number;
    value: number;
    override readonly category: string;
    override readonly type = SettingType.Slider
    override readonly info: string;
    override readonly needsRestart: boolean;
    override onSet: (v: ISetting<SettingType.Slider>) => void

    protected constructor(
        name: string,
        max: number,
        min: number,
        step: number,
        value: number,
        category: string,
        needsRestart: boolean,
        info?: string,
    ) {
        super(name, getSettingId(name), category, needsRestart, info);
        this.name = name
        this.id = getSettingId(name)
        this.max = max
        this.min = min
        this.step = step
        this.value = value
        this.category = category
        this.info = info
        this.needsRestart = needsRestart
    }

    override html(): string {
        return genCSettingsHTML(this)
    }

    override set(value: number): void {
        this.value = value
        if (this.onSet) this.onSet(this)
    }
}
