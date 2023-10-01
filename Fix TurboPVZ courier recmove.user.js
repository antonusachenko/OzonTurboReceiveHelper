// ==UserScript==
// @name         Fix TurboPVZ courier recmove
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This script provides the convenience of work, which OZON cannot provide with a capital of more than 400 billion rubles.
// @author       Usachenko Antony
// @match        https://pvz.ozon-dostavka.ru/courier/recommendations
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ozon-dostavka.ru
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const receiveMessageBlock = document.getElementsByClassName("portalTargetContainer_ptBjF");
    const receiveMessage = document.getElementsByClassName("bigAddress_8+kv+");
    const receiveForkClassName = ".portalTargetContainer_ptBjF";

    // regex for find number
    const regexMixed = /\d{1,5}-\d{1,3}|CUR|\-\d+\/\d+/g;


    // fields
    var superWindow;
    var superWindowText;
    var innerHTML;
    var prevMatch;

    var isRecieveActive;


    // ------------ Start ------------

    console.log("Plugin ready to work");

    // Try to start Observer
    addObserverIfDesiredNodeAvailable();
    DrawSuperWindow();

    // ----------- Functions ------------

    function DrawSuperWindow(){

            //Draw new element SuperWindow
            superWindow = document.createElement("div");
            superWindow.id = "superNumber";
            document.body.appendChild(superWindow);
            superWindowText = document.createElement("p");
            superWindow.appendChild(superWindowText);
            superWindowText.style.cssText = 'font-size: 16vh; text-align: center;line-height: 180px;';
            superWindowText.innerHTML = "00-0";
            //HideSuperWindows();
            ShowSuperWindow();
    }

    function Speak(text) {

        const message = new SpeechSynthesisUtterance();
        message.lang = "ru-RU";
        message.text = text;
        window.speechSynthesis.speak(message)
    }

    function ShowSuperWindow(){
        superWindow.style.cssText = 'position: fixed; left: 25px; bottom: 75px; display:table;  align-items:center;  width:450px; height:100px; background: rgb(215, 231, 245); z-index:9999999999; border: solid;  border-width: 30px; border-color: rgb( 255, 255, 255 );';

    }
    function HideSuperWindows(){
        superWindow.style.cssText = 'Display: none';
    }

    function ObserverDetect(){
        console.log("REFRESH WAS DETECT");
        if(receiveMessage[0] != null){
                innerHTML = receiveMessage[0].innerHTML;
                console.log("innerHTML below: ");
                console.log(innerHTML);
                UpdateResult();
        }
    }

    function UpdateResult() {
        var match = innerHTML.match(regexMixed)[0];
        console.log("match: " + match);
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

                if(match == match.match(/\-\d+\/\d+/)){
                    // Refresh superWindow
                    console.log("Refresh superWindow and speech text");
                    let result = match;
                    superWindowText.innerHTML = result;
                    prevMatch = match;
                    //
                    let text1 = result.match(/\d+(?=\/)/);
                    let text2 = result.match(/[^\/]*$/);
                    let textResult;
                    if( text1 == null | text1 == ""){
                        textResult = text2;
                    }
                    else{
                        textResult = text1 + " дробь " + text2;
                    }
                    //
                    Speak(textResult);
                }
            }
            else{
                console.log("match equal to prev match, do nothing");

            }

        }

    }

    // ------ Create Observers ---------

    var observer = new MutationObserver(ObserverDetect);
    //
    console.log("Observer created");
    // Add observer if desired element exist
    function addObserverIfDesiredNodeAvailable() {
        var elementNode = document.querySelectorAll(receiveForkClassName)[0]; //was detect block
        if(elementNode) {
            var config = {childList: true};
            // Start observing the target node for configured mutations
            observer.observe(elementNode, config);
            console.log("Observer started");
        }
        else{
            // The node we need does not exist yet.
            // Wait 500ms and try again
            window.setTimeout(addObserverIfDesiredNodeAvailable,500);
            console.log("Element not found, restart the function AddObserverIfDesuredNodeAvailable in 0.5 sec");
        }
    }
})();