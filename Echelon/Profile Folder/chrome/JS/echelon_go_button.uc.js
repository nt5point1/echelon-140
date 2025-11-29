// ==UserScript==
// @name			Echelon :: Go Button
// @description 	Adds a Go button to the stop-reload item.
// @author			aubymori
// @include			main
// ==/UserScript==

{
    var { waitForElement } = ChromeUtils.importESModule("chrome://userscripts/content/echelon_utils.sys.mjs");
    waitForElement = waitForElement.bind(window);

    waitForElement("#stop-reload-button").then((e) => {
        let goButton = window.MozXULElement.parseXULToFragment(`
            <toolbarbutton id="go-button" class="toolbarbutton-1" onclick="gURLBar.handleCommand(event);" tooltiptext="Go to the address in the Location Bar" label="Go">
                <image class="toolbarbutton-icon" label="Go"/>
            </toolbarbutton>
        `);
        e.insertBefore(goButton, e.querySelector("#stop-button"));
		
        let goButtonElement = e.querySelector("#go-button");
		goButtonElement.addEventListener("click", (event) => {
			gURLBar.handleCommand(event);
		});
    });


    let urlbar = null;

    function onUrlbarFocusChange(list)
    {
        if (urlbar.hasAttribute("focused"))
        {
            urlbar.parentNode.setAttribute("focused", "true");
        }
        else
        {
            urlbar.parentNode.removeAttribute("focused");
        }
    }

    waitForElement("#urlbar").then(e => {
        urlbar = e;
        let observer = new MutationObserver(onUrlbarFocusChange);
        observer.observe(e, { attributes: true, attributeFilter: ["focused"] });
    });
}