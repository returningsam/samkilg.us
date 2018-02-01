const key      = "UId3m2uPUXmshfAqc2JoAXEXw2oNp1kR3OwjsnnYSlW5DTaW0A";
const BASE_URL = "https://wordsapiv1.p.mashape.com/words/";

var screenWidth;
var screenHeight;

var inputTokens;
var outputTokens;

var knownTranslations = {};

var toTranslate = [];

function updatePronounciation(word,trans) {
    if (word) {
        for (var i = 0; i < outputTokens.length; i++)
            if (outputTokens[i] == word)
                if (trans != null) outputTokens[i] = trans;
    }
    document.getElementById('output').innerHTML = outputTokens.join(" ");
}

function getPronounciation(word) {
    var url = BASE_URL + word;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText)["pronunciation"];
            if (data) {
                var trans
                if (typeof data == "string")
                    trans = data;
                else {
                    var options = Object.keys(data);
                    trans = data[options[0]];
                }
                toTranslate.pop(toTranslate.indexOf(word));
                updatePronounciation(word,trans);
            }
            else {
                updatePronounciation(word,null);
            }
        }
    };
    xhttp.open("GET", url, true);
    xhttp.setRequestHeader("X-Mashape-Key",key);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.send();
}

function translate(word) {
    if (toTranslate.indexOf(word) > -1)
        return;

    if (knownTranslations[word]) {
        updatePronounciation(word,knownTranslations[word]);
        return;
    }

    toTranslate.push(word);
    getPronounciation(word);
    updatePronounciation();
}

var transUpdateTimeout;

function updateTranslation() {
    if (transUpdateTimeout) clearTimeout(transUpdateTimeout);
    transUpdateTimeout = setTimeout(function () {
        var text     = document.getElementById('input').value;
        inputTokens  = text.split(/\s+/);
        outputTokens = text.split(/\s+/);
        for (var i = 0; i < inputTokens.length; i++)
            translate(inputTokens[i])
    }, 500);
}

function fixOrientation() {
    if (screenWidth >= screenHeight) {
        document.body.className = "split_v";
    }
    else {
        document.body.className = "split_h";
    }
}

function resize() {
    screenWidth  = window.innerWidth;
    screenHeight = window.innerHeight;
    fixOrientation();
}

function init() {
    resize();
    document.body.addEventListener('keyup',updateTranslation);
}

window.onload = init;
window.onresize = resize;
