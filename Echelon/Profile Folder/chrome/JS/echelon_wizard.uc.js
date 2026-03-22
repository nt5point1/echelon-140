// ==UserScript==
// @name			Echelon :: Wizard
// @description 	Opens the Echelon Wizard on first-time installs
// @author			Travis
// @include         main
// ==/UserScript==

waitForElement("#mainPopupSet").then(mainPopupSet => {
    let echelonWizard = MozXULElement.parseXULToFragment(
    `
    <hbox id="echelon-wizard-container">
        <vbox id="echelon-wizard-panel">
            <hbox id="echelon-wizard-arrowcontent" hidden="true">
                <image id="echelon-wizard-arrow" />
            </hbox>
            <browser id="echelon-wizard-content" autoscroll="false" disablehistory="true" disablefullscreen="true" src="about:wizard"/>
        </vbox>
    </hbox>
    `);
    mainPopupSet.append(echelonWizard);
});

function showEchelonWizard() {
    let echelonWizardEl = document.querySelector("#echelon-wizard-container");
    
    echelonWizardEl.setAttribute("animate", "open");
    echelonWizardEl.setAttribute("animating", "true");

    setTimeout(() => {
        echelonWizardEl.removeAttribute("animating")
        echelonWizardEl.setAttribute("animate", "false")
    }, 550);
}

function resetEchelonWizard() {
    // reset selected choices
    PrefUtils.trySetIntPref("Echelon.Appearance.Preset", "0");
    PrefUtils.trySetStringPref("Echelon.Appearance.systemStyle", "");
    PrefUtils.trySetBoolPref("Echelon.Appearance.Blue", false);

    let echelonWizardEl = document.querySelector("#echelon-wizard-container");

    echelonWizardEl.setAttribute("animating", "true");
    echelonWizardEl.setAttribute("animate", "closing");

    setTimeout(() => {
        echelonWizardEl.removeAttribute("animating")
        echelonWizardEl.removeAttribute("animate")
    }, 550);
}

function hideEchelonWizard() {
    let echelonWizardEl = document.querySelector("#echelon-wizard-container");

    echelonWizardEl.setAttribute("animating", "true");
    echelonWizardEl.setAttribute("animate", "closing");

    setTimeout(() => {
        echelonWizardEl.removeAttribute("animating")
        echelonWizardEl.removeAttribute("animate")
    }, 550);
}

// set default echelon settings
function setDefaultSettings() {
    let defaultEchelonConfig = [
        ["Echelon.Appearance.Blue", "bool", true],
        ["Echelon.Appearance.Preset", "int", "0"],
        ["Echelon.Appearance.Style", "int", "0"],
        ["Echelon.Appearance.systemStyle", "string", ""],
        ["Echelon.Appearance.Homepage.Style", "int", "0"],
        ["Echelon.Appearance.overrideHomepagePreset", "bool", false],
        ["Echelon.Appearance.TabsOnTop", "bool", true],
        ["Echelon.Appearance.disableChrome", "bool", true],
        ["Echelon.Homepage.HideCustomSnippets", "bool", false],
        ["Echelon.Option.HideUnifiedExtensions", "bool", false],
        ["Echelon.Option.Branding", "string", "firefox"],

        // General Browser Tweaks
        ["ui.systemUsesDarkMode", "int", "0"],
        ["browser.theme.dark-private-windows", "bool", false],
        ["toolkit.legacyUserProfileCustomizations.stylesheets", "bool", true],
        ["browser.privateWindowSeparation.enabled", "bool", false],
        ["browser.display.windows.non_native_menus", "int", "0"],
        ["widget.non-native-theme.enabled", "bool", false],
        ["browser.tabs.hoverPreview.enabled", "bool", false],
        ["browser.tabs.tabmanager.enabled", "bool", false],
        ["browser.menu.showViewImageInfo", "bool", true],
        ["browser.newtab.preload", "bool", false],

        // r3dfox exclusives
        ["r3dfox.caption.text.color", "bool", false, ["r3dfox", "r3dfox_esr", "plasmafox"]],
        ["r3dfox.colors.enabled", "bool", false, ["r3dfox", "r3dfox_esr", "plasmafox"]],
        ["r3dfox.customizations.enabled", "bool", false, ["r3dfox", "r3dfox_esr", "plasmafox"]],
        ["r3dfox.force.transparency", "bool", false, ["r3dfox", "r3dfox_esr", "plasmafox"]],
        ["r3dfox.transparent.menubar", "bool", false, ["r3dfox", "r3dfox_esr", "plasmafox"]],
        ["r3dfox.translucent.navbar", "bool", false, ["r3dfox", "r3dfox_esr", "plasmafox"]],
        ["r3dfox.aero.fog", "bool", false, ["r3dfox", "r3dfox_esr", "plasmafox"]],

        // nocturne exclusives
        ["nocturne.colors", "int", "0", ["nocturne"]],
        ["nocturne.backgrounds.enabled", "bool", false, ["nocturne"]],
        ["nocturne.transparent.menubar", "bool", false, ["nocturne"]],
        ["nocturne.translucent.navbar", "bool", false, ["nocturne"]],
        ["nocturne.aero.fog", "int", "0", ["nocturne"]]
    ];

    for (const [name, type, value, exclusive] of defaultEchelonConfig) {
        // Skip if this is an exclusive setting and doesn't match current build
        if (exclusive && !exclusive.includes(AppConstants.MOZ_APP_NAME)) continue;

        if (type == "bool") PrefUtils.trySetBoolPref(name, value);
        else if (type == "int") PrefUtils.trySetIntPref(name, value);
        else if (type == "string") PrefUtils.trySetStringPref(name, value);
    }
}

window.addEventListener("load", () => {
    if (!PrefUtils.tryGetBoolPref("Echelon.parameter.isFirstRunFinished")) {
        setDefaultSettings();
        showEchelonWizard();
    }
});