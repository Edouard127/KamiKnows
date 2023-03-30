import TextSetting from "../class/TextSetting";
import CheckboxSetting from "../class/CheckboxSetting";
import {CategoryType} from "../interface/CategoryType";
import SelectSetting from "../class/SelectSetting";

export const ExportSetting = [
    new CheckboxSetting("Disable Frame Rate Limit", true, CategoryType.Performance, true, "Disabling Vsync can improve the frame rate of a game or application by allowing the GPU to render frames as quickly as possible, without waiting for the monitor to refresh, but can also introduce screen tearing."),
    new CheckboxSetting("Accelerated Canvas", true, CategoryType.Performance, true, "Enables the use of the GPU to perform 2d canvas rendering instead of using software rendering."),
    new CheckboxSetting("2D Canvas Clip AA", false, CategoryType.Performance, true, "Disabling 2D canvas clip AA can improve performance by reducing the computational load required to perform anti-aliasing, resulting in faster rendering times and lower CPU usage."),
    new CheckboxSetting("Software Rasterization", false, CategoryType.Performance, true, "Software rasterization is a process of rendering 3D graphics using the CPU, while disabling it can improve performance by using the GPU to render the graphics instead."),
    new SelectSetting("Angle Backend", "default", {
        "default": "Default",
        gl: "OpenGL (Windows, Linux, MacOS)",
        d3d11: "D3D11 (Windows-Only)",
        d3d9: "D3D9 (Windows-Only)",
        d3d11on12: "D3D11on12 (Windows, Linux)",
        vulkan: "Vulkan (Windows, Linux)",
        metal: "Metal (MacOS-Only)"
    }, CategoryType.Performance, true,
        "Choose the graphics backend for ANGLE. D3D11 is used on most Windows computers by default. Using the OpenGL driver as the graphics backend may result in higher performance, particularly on NVIDIA GPUs. It can increase battery and memory usage of video playback."),
    new SelectSetting("Color Profile", "default", {
        "default": "Default",
        "srgb": "sRGB",
        "display-p3-d65": "Display P3 D65",
        "color-spin-gamma24": "Color spin with gamma 2.4"
    }, CategoryType.Chromium, true, "Forces color profile."),
    new CheckboxSetting("In Process GPU", false, CategoryType.Chromium, true, "Run the GPU process as a thread in the browser process. Using this may help with window capture. Known to have issues with some Linux machines."),
    new TextSetting("Chromium Flags", "--disable-gpu-program-cache --enable-gpu-benchmarking ", CategoryType.Chromium, true, "Additional Chromium flags."),
    new CheckboxSetting("Show Exit Button", true, CategoryType.Interface, false, "Show the exit button at the left bottom")
        .setFunction((setting) => {
            if (!setting.isCheckBox()) return
            const btn = document.getElementById("clientExit");
            if (btn) btn.style.display = setting.value ? "flex" : "none";
        }),
    new CheckboxSetting("Show AltManager Button", true, CategoryType.Interface, false, "Show the alt-manager button under the player customisation button")
        .setFunction((setting) => {
            if (!setting.isCheckBox()) return
            const btn = document.getElementById("accManagerBtn");
            if (btn) btn.style.display = setting.value ? "block" : "none";
        }),
    new CheckboxSetting("Enable Menu Timer", true, CategoryType.Interface, true),
    new CheckboxSetting("Discord Rich Presence", true, CategoryType.Interface, false),
    new CheckboxSetting("Resource Swapper", false, CategoryType.Interface, false)
]
