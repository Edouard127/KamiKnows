import {ISetting} from "../core/interface/ISetting";

export function	genCSettingsHTML(options: ISetting) {
    if (options.isCheckBox()) return `<label class='switch'><input type='checkbox' onclick='window.setCSetting("${options.id}", this.checked)'${options.value ? " checked" : ""}><span class='slider'></span></label>`;
    if (options.isSlider()) return `<input type='number' class='sliderVal' id='c_slid_input_${options.id}' min='${options.min}' max='${options.max}' value='${options.value}' onkeypress='window.delaySetCSetting("${options.id}", this)' style='border-width:0px'/><div class='slidecontainer'><input type='range' id='c_slid_${options.id}' min='${options.min}' max='${options.max}' step='${options.step}' value='${options.value}' class='sliderM' oninput='window.setCSetting("${options.id}", this.value)'></div>`;
    if (options.isSelect()) return `<select onchange='window.setCSetting("${options.id}", this.value)' class='inputGrey2'>${Object.entries(options.options).map(entry => `<option value='${entry[0]}'${entry[0] === options.value ? " selected" : ""}>${entry[1]}</option>`).join("")}</select>`;
    if (options.isText()) return `<input type='${options.type}' name='${options.id}' id='c_slid_${options.id}' style="float:right;margin-top:5px;" class='inputGrey2' value='${(options.value || "").replace(/'/g, "")}' oninput='window.setCSetting("${options.id}", this.value)'/>`;
}

