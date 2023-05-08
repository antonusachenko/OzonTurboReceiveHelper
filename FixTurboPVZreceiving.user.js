// ==UserScript==
// @name         Fix TurboPVZ receiving
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  This script gives the convenience of work, which cannot be given by OZON with a capital of 1 billion rubles
// @author       Usachenko Antony
// @match        https://pvz.ozon-dostavka.ru/receiving
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ozon-dostavka.ru
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // Constans
    const receiveDetectBlock = document.getElementsByClassName("receivingDrawerWrapper_WAXaA");
    const receiveHeaderBlock = document.getElementsByClassName("receivingDrawerHeader_pwTz7");
    const receiveMessageBlock = document.getElementsByClassName("logItemList_mw6zT");
    const receiveDetectBlockClassName = ".receivingDrawerWrapper_WAXaA";
    const receiveHeaderBlockClassName = ".receivingDrawerHeader_pwTz7";
    const receiveMessageBlockClassName = ".logItemList_mw6zT";
    // regex for find number
	const regexUsusal = /'\d*\d-\d\d*'/g;
    const regexCUR = /'CUR-\d*'/g;
    const regexMixed = /'\d{1,5}-\d{1,3}'|'CUR-\d*'/g;
    const regexResultFilter = /(?<=\').+?(?=\')/g;
    // fields
    var superWindow;
    var superWindowText;
    var innerHTML;
    var prevMatch;
    var CanRepeatSpeech = true;
	//

    //
    // ------------ Start ------------
    //
    console.log("Plugin ready to work");
    //
    //
    // Try to start Observer
    addObserverIfDesiredNodeAvailable();
    //
    //
    //
    //
    //
    //
    // ----------- Functions ------------
    //
    //
    function DrawSuperWindow(){
        //Draw new element SuperWindow
        superWindow = document.createElement("div");
        superWindow.id = "superNumber";
        ShowSuperWindow();
        document.body.appendChild(superWindow);
        superWindowText = document.createElement("p");
        superWindow.appendChild(superWindowText);
        superWindowText.style.cssText = 'font-size: 20vh;text-align: center;line-height: 400px;';
        superWindowText.innerHTML = "00-0";
    }
    //
    function Speak(text) {
        var text1 = text.match(/\d+(?=\-)/);
        var text2 = text.match(/[^-]*$/);
        var textResult;
        if( text1 == null | text1 == ""){
            textResult = text2;
        }
        else{
            textResult = text1 + " тире " + text2;
        }
        const message = new SpeechSynthesisUtterance();
        message.lang = "ru-RU";
        message.text = textResult;
        window.speechSynthesis.speak(message)
    }
    //
    function ShowSuperWindow(){
        superWindow.style.cssText = 'z-index:9999999999;position:fixed;display:table;align-items:center;top:calc(50% - 200px);left:100px;width:750px;height:400px;border-radius: 30px;-moz-border-radius:30px;background-color: #f2f2f2; Display: block;box-shadow: 12px 12px 2px 1px rgba(0, 0, 255, .2);';
    }
    function HideSuperWindows(){
        superWindow.style.cssText = 'Display: none';
    }
    //
    function ObserverDetect(){
        console.log("REFRESH WAS DETECT");
        //
		innerHTML = receiveMessageBlock[0].firstChild.lastChild.innerHTML;
        UpdateResult();
    }
    //
    //
    function UpdateResult() {
        var match = innerHTML.match(regexMixed)[0];
        //
        if (match == null || match == 'Undefined'){
            // Try recognition again
            window.setTimeout(ObserverDetect,100);
            console.log("match not found");
        }
        else{
            console.log("clear match info: " + match);
            //
            if(match != prevMatch){
                // Refresh superWindow
                console.log("Refresh superWindow and speech text");
                var result = match.match(regexResultFilter)[0];
                superWindowText.innerHTML = result;
                prevMatch = match;
                Speak(result);
                CanRepeatSpeech = false;
                window.setTimeout(ResetTimer, 5000);
            }
            else{
                console.log("match equal to prev match, do nothing");

            }

        }

    }
    //
    // Create Observer
    var observer = new MutationObserver(ObserverDetect);
    console.log("Observer created");
    // Add observer if desired element exist
    function addObserverIfDesiredNodeAvailable() {
        var elementNode = document.querySelectorAll(receiveMessageBlockClassName)[0]; //was detect block
        if(elementNode) {
            var config = {childList: true};
            // Start observing the target node for configured mutations
            observer.observe(elementNode, config);
            console.log("Observer started");
            // Draw super window
            DrawSuperWindow();
            // Add listener for close button
                var closeButtonNode = document.getElementsByClassName("el-drawer__close-btn")[0];
                closeButtonNode.addEventListener("click", function() {
                HideSuperWindows();
            });
            // Add listener for open Autorecevier button
                var openButtonNode = document.getElementsByClassName("el-button--primary")[1];
                openButtonNode.addEventListener("click", function() {
                ShowSuperWindow();
            });
        }
        else{
            // The node we need does not exist yet.
            // Wait 500ms and try again
            window.setTimeout(addObserverIfDesiredNodeAvailable,500);
            console.log("Element not found, restart the function AddObserverIfDesuredNodeAvailable in 0.5 sec");
        }
    }
    //
    function ResetTimer(){
        CanRepeatSpeech = true;
    }
    //
});

})();
