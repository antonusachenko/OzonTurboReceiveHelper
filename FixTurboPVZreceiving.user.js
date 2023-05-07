// ==UserScript==
// @name         Fix TurboPVZ receiving
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  This script gives the convenience of work, which cannot be given by OZON with a capital of 1 billion rubles
// @author       Usachenko Antonuy
// @match        https://pvz.ozon-dostavka.ru/receiving
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ozon-dostavka.ru
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // Constans
    const element = document.getElementsByClassName("logItemList_mw6zT");
    // const config = { attributes: true, childList: true, subtree: true };
    // regex for find number
	const regexUsusal = /'\d*\d-\d\d*'/;
    const regexCUR = /CUR-\d*/;
    const regexMixed = /'\d*\d-\d\d*'|CUR-\d*/;
    const regexResult = /(?<=\').+?(?=\')/;
    var superWindow;
    var superWindowText;
	//
    function DrawSuperWindow(){
        //Draw new element SuperWindow
        superWindow = document.createElement("div");
        superWindow.id = "superNumber";
        superWindow.style.cssText = 'z-index:9999999999;position:fixed;display:table;align-items:center;top:calc(50% - 200px);left:100px;width:550px;height:400px;border-radius: 30px;-moz-border-radius:30px;background-color: #f2f2f2; Display: block;box-shadow: 12px 12px 2px 1px rgba(0, 0, 255, .2);';
        //superWindow.style.cssText = 'Display: none';
        document.body.appendChild(superWindow);
        superWindowText = document.createElement("p");
        superWindow.appendChild(superWindowText);
        superWindowText.style.cssText = 'font-size: 20vh;text-align: center;line-height: 400px;';
        superWindowText.innerHTML = "00-0";
    }
    //
    function Speak(text) {
        const message = new SpeechSynthesisUtterance();
        message.lang = "ru-RU";
        message.text = text;
        window.speechSynthesis.speak(message)
    }
    //
    function UpdateResult() {
		var text = element[0].firstChild.lastChild.innerHTML;
        var match = text.match(regexMixed)[0];
        //alert(result); //debug
        // Refresh superWindow
        //superWindow.style.cssText = 'z-index:9999999999;position:fixed;display:table;align-items:center;top:calc(50% - 200px);left:100px;width:550px;height:400px;border-radius: 30px;-moz-border-radius:30px;background-color: #f2f2f2; Display: block;box-shadow: 12px 12px 2px 1px rgba(0, 0, 255, .2);';
        var result = match.match(regexResult)[0];
        superWindowText.innerHTML = result;
        Speak(result);
    }
    //
    //
    //
    console.log("Plugin ready to work");
    //
    // Create Observer
    var observer = new MutationObserver(UpdateResult);
    console.log("Observer created");
    //
    // Add observer if element exist
    function addObserverIfDesiredNodeAvailable() {
        var elementNode = document.querySelectorAll(".logItemList_mw6zT")[0];
        if(elementNode) {
            var config = {childList: true};
            // Start observing the target node for configured mutations
            observer.observe(elementNode, config);
            console.log("Observer started");
            DrawSuperWindow();
            //add listener for close button
            var closeButtonNode = document.getElementsByClassName("el-drawer__close-btn")[0];
            closeButtonNode.addEventListener("click", function() {
                superWindow.style.cssText = 'Display: none';
            });
            var openButtonNode = document.getElementsByClassName("el-button--primary")[1];
            openButtonNode.addEventListener("click", function() {
                superWindow.style.cssText = 'z-index:9999999999;position:fixed;display:table;align-items:center;top:calc(50% - 200px);left:100px;width:550px;height:400px;border-radius: 30px;-moz-border-radius:30px;background-color: #f2f2f2; Display: block;box-shadow: 12px 12px 2px 1px rgba(0, 0, 255, .2);';
            });
        }
        else{
            //The node we need does not exist yet.
            //Wait 500ms and try again
            window.setTimeout(addObserverIfDesiredNodeAvailable,500);
            console.log("Element not found, restart the function AddObserverIfDesuredNodeAvailable");
        }

    }
    addObserverIfDesiredNodeAvailable();

})();
