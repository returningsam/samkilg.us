var pgData = {
    "arm_thing": {
        date: "23.05.2017",
        tags: ["interactive","canvas","random"],
        mobile: true,
        description: "Mouse tracking animation with arms coming from the sides of the screen to find the mouse. Try to avoid the arms or click to toggle colors."
    },
    "box_fill": {
        date: "14.01.2018",
        tags: ["canvas","random","lines"],
        mobile: true,
        description: "Fills the screen in a way that resembles the <a href='https://en.wikipedia.org/wiki/Golden_ratio' target='_blank'>golden ratio</a>. If your window has the same ratio as the golden ratio, the resulting image will also be the golden ratio. Click or resize the window to redraw.",
        bgPos: "right bottom"
    },
    "circles": {
        date: "07.04.2017",
        tags: ["interactive","canvas","physics"],
        mobile: true,
        description: "My 'from-scratch' attempt at some very simple 2d physics with disks. You can move your mouse around to bounce the disks or click to redraw and toggle colors."
    },
    "color_averages": {
        date: "29.01.2016",
        tags: ["simple","canvas"],
        mobile: false,
        description: "Draws a pallete of colors, then 'blurs' the colors together by placing small colored colors at random spots."
    },
    "game_of_life": {
        date: "20.04.2017",
        tags: ["interactive","canvas"],
        mobile: false,
        description: "A canvas based 'Conway's Game of Life' with randomized life rules. Move your mouse around to draw new life, click to clear the screen, and if you're feeling adventurous, check out the developer console for a few more instructions."
    },
    "glitch_cursor": {
        date: "05.12.2017",
        tags: ["simple","interactive","canvas"],
        mobile: false,
        description: "Draws the mouse to the canvas as you move it."
    },
    "glitch_word": {
        date: "12.05.2016",
        tags: ["interactive","text"],
        mobile: false,
        description: "A text animation that 'glitches' the text in waves as your mouse moves over it.",
        bgPos: "top center"
    },
    "gradient_generator": {
        date: "17.10.2017",
        tags: ["interactive","canvas"],
        mobile: false,
        description: "This started as a tool to create custom patterns and gradients. Uses a randomly pruned DFS to fill the screen with colors, then blurs the image to create a gradient. Click and move the mouse to draw. I suggest this order: draw -> fill -> blur."
    },
    "phonetic_typer": {
        date: "03.08.2017",
        tags: ["interactive","API","text"],
        mobile: true,
        description: "Type English words into the left panel and see how you would pronounce them in real time. Uses the <a href='https://www.wordsapi.com' target='_blank'>Words API</a>.",
        bgPos: "top left"
    },
    "sunflares": {
        date: "23.02.2017",
        tags: ["canvas","lines"],
        mobile: true,
        description: "Creates an image that looks like a star. Places random bezier curves that are tangent to the circumference of the circle, then moves them around randomly. Click to redraw with new colors."
    },
    "text_noise_shadow": {
        date: "05.01.2018",
        tags: ["text","canvas"],
        mobile: false,
        description: "Draws a random noise shadow behind some text. Not optimized at the moment, may take a few seconds to finish running."
    },
    "trees": {
        date: "11.02.2015",
        tags: ["simple","canvas","lines"],
        mobile: false,
        description: "One of my earlier experiments. Draws random 'stick-figure' trees with shading to create a sense of depth.",
        bgPos: "bottom center"
    },
    "static_lines": {
        date: "12.01.2018",
        tags: ["simple","canvas","lines"],
        mobile: false,
        description: "Draws a random zig-zag line that goes around the mouse and connects at the other side."
    },
    "3D_text": {
        date: "20.01.2018",
        tags: ["interactive","text","3D"],
        mobile: false,
        description: "3D text using html text elements, css transforms, and some vanilla javascript (no 3D graphics libraries). Click to get new text."
    },
    "corner_site": {
        date: "01.02.2018",
        tags: ["interactive","3D"],
        mobile: false,
        description: "A website in a corner. Move the mouse around to view the two sides of the corner."
    },
    "blob_thing": {
        date: "07.02.2018",
        tags: ["interactive","canvas"],
        mobile: true,
        description: "Draws a ungulating blob around the mouse."
    },
    "doodle_bot": {
        date: "08.02.2018",
        tags: ["interactive","canvas","lines"],
        mobile: true,
        description: "Draws really long random line while (optionally) filling in some parts to create a random doodle. Variables that control the behavior of the line are randomized when you click."
    }
}

var pgDataArr;

var colTags = ["title","tags","date"];

function mobileCheck() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

/******************************************************************************/
/*************************** LIST SEARCH **************************************/
/******************************************************************************/

var curSearch = {
    "title": {
        value: "",
        searchFunc: filterByTitle
    },
    "tags": {
        value: "",
        searchFunc: filterByTags
    },
    "mobile": {
        searchFunc: filterByMobile
    },
    "date": {
        value: ""
    }
};

function filterByTitle(pgDataKey) {
    var show = false;
    if (curSearch["title"].value.length == 0 || pgDataKey.toLowerCase().indexOf(curSearch["title"].value.toLowerCase()) > -1)
        show = true;
    return show;
}

function filterByTags(pgDataKey) {
    var curCheckVal = document.getElementById("tags_" + pgDataKey).innerHTML;
    var show = false;
    if (curSearch["tags"].value.length == 0 || curCheckVal.toLowerCase().indexOf(curSearch["tags"].value.toLowerCase()) > -1)
        show = true;
    return show;
}

function filterByMobile(pgDataKey) {
    return pgData[pgDataKey].mobile;
}

function filterOptions() {
    lastPreview = curPreview;
    curPreview = null;
    hidePreview();
    var pgDataKeys = Object.keys(pgData);

    for (var i = 0; i < pgDataKeys.length; i++) {
        curDataKey = pgDataKeys[i];

        var show = true;
        for (var j = 0; j < colTags.length; j++)
            if (curSearch[colTags[j]].searchFunc)
                show = show && curSearch[colTags[j]].searchFunc(curDataKey);

        if (mobileCheck() && !filterByMobile(curDataKey)) show = false;

        for (var j = 0; j < colTags.length; j++) {
            var curColTag = colTags[j];
            var curEl = document.getElementById(colTags[j] + "_" + curDataKey);
            if (show) curEl.style.display = null;
            else curEl.style.display = "none";
        }
    }
}

function handleSearch(ev) {
    var colTag = ev.target.id.split("_")[0];
    curSearch[colTag].value = ev.target.value;
    filterOptions();
}

function initSearchInputs() {
    for (var i = 0; i < colTags.length; i++) {
        var searchEl = document.getElementById(colTags[i] + "_search");
        if (searchEl) searchEl.addEventListener("keyup", handleSearch);
    }
}

/******************************************************************************/
/*************************** DATE FILTER **************************************/
/******************************************************************************/

var curDateSort = "newest";
var curSortFunc = sortNewest;

function parseDate(date) {
    var tokens = date.split(".");
    var dateObj = new Date();
    dateObj.setDate(parseInt(tokens[0]));
    dateObj.setMonth(parseInt(tokens[1])-1);
    dateObj.setFullYear(parseInt(tokens[2]));
    return dateObj;
}

function stringifyDate(date) {
    return date.getDate() + "." + date.getMonth() + "." + date.getFullYear();
}

function sortNewest(a,b) {
    return parseDate(b.date)-parseDate(a.date);
}

function sortOldest(a,b) {
    return parseDate(a.date)-parseDate(b.date);
}

function sortListOptions() {
    pgDataArr.sort(curSortFunc);
    for (var i = 0; i < pgDataArr.length; i++) {
        var curTitle = pgDataArr[i].title;
        for (var j = 0; j < colTags.length; j++) {
            var curColTag = colTags[j];
            var curEl = document.getElementById(curColTag + "_" + curTitle);
            curEl.style.order = (i*2);
        }
    }
}

function handleDateFilterClick(ev) {
    var tokens = ev.target.id.split("_");
    curDateSort = tokens[tokens.length-1];

    if (curDateSort == "newest") {
        document.getElementById("filterToggle_date_newest").classList.add("active");
        document.getElementById("filterToggle_date_oldest").classList.remove("active");
        curSortFunc = sortNewest;
    }
    else {
        document.getElementById("filterToggle_date_newest").classList.remove("active");
        document.getElementById("filterToggle_date_oldest").classList.add("active");
        curSortFunc = sortOldest;
    }

    filterOptions();
    sortListOptions();
}

function initDateFilter() {
    document.getElementById("filterToggle_date_newest")
        .addEventListener("click",handleDateFilterClick);
    document.getElementById("filterToggle_date_oldest")
        .addEventListener("click",handleDateFilterClick);
}

/******************************************************************************/
/*************************** LIST ITEM ****************************************/
/******************************************************************************/

function initList() {
    var pgDataKeys = Object.keys(pgData);
    for (var j = 0; j < colTags.length; j++) {
        var colElement = document.getElementById("listCol_" + colTags[j]);

        for (var i = 0; i < pgDataKeys.length; i++) {
            var listItem = document.createElement("p");
            listItem.id = colTags[j] + "_" + pgDataKeys[i];
            listItem.classList.add("noselect");
            listItem.addEventListener("mouseenter", listItemHoverEnable);
            listItem.addEventListener("mouseleave", listItemHoverDisable);
            listItem.addEventListener("click", handleTogglePreview);
            listItem.style.order = (i+1)*2;

            if (colTags[j] == "title") listItem.innerHTML = pgDataKeys[i];
            else if (colTags[j] == "tags") {
                listItem.innerHTML = pgData[pgDataKeys[i]][colTags[j]].join(",");
            }
            else listItem.innerHTML = pgData[pgDataKeys[i]][colTags[j]];

            colElement.appendChild(listItem);
        }
    }
}

function listItemHoverEnable(ev) {
    var itemTag = ev.target.id.split("_").splice(1).join("_");
    for (var i = 0; i < colTags.length; i++) {
        var curEl = document.getElementById(colTags[i] + "_" + itemTag);
        curEl.style.textDecoration = "underline";
    }
}

function listItemHoverDisable(ev) {
    var itemTag = ev.target.id.split("_").splice(1).join("_");
    for (var i = 0; i < colTags.length; i++) {
        var curEl = document.getElementById(colTags[i] + "_" + itemTag);
        curEl.style.textDecoration = null;
    }
}

/******************************************************************************/
/*************************** LIST ITEM PREVIEW ********************************/
/******************************************************************************/

var previewHold = false;

var listItemPreview;
var curPreview;

function getParent(el,pClass) {
    while (!el.parentNode.classList.contains(pClass) && el.parentNode != document.body)
        el = el.parentNode;
    return el;
}

function insertAfter(before,after) {
    before.parentNode.insertBefore(after,before.nextSibling);
}

function showPreview(tag) {
    previewHold = true;
    curPreview = tag;

    var titleEl = document.getElementById("title_" + tag);
    var titleOrder = parseInt(titleEl.style.order);

    var previewImage = document.createElement("div");
    previewImage.id = "previewImage_" + tag;
    previewImage.className = "previewEl previewImage";
    previewImage.style.order = titleOrder + 1;
    previewImage.style.backgroundImage = "url('/playground/previews/" + tag + ".gif')";
    previewImage.style.backgroundPosition = pgData[tag].bgPos;
    previewImage.addEventListener("click",previewButtonHandler);
    insertAfter(titleEl,previewImage);

    var tagsEl = document.getElementById("tags_" + tag);
    var dateEl = document.getElementById("date_" + tag);

    var previewTags = document.createElement("div");
    previewTags.className = "previewEl previewDescription";
    previewTags.id = "previewTags_" + tag;
    previewTags.style.order = titleOrder + 1;

    if (pgData[tag].description)
        previewTags.innerHTML = "<p>" + pgData[tag].description + "</p>";
    else previewTags.innerHTML = "<p>" + tempDescription + "</p>";

    insertAfter(tagsEl,previewTags);

    var previewDate = document.createElement("div");
    previewDate.className = "previewEl previewOptions";
    previewDate.id = "previewDate_" + tag;
    previewDate.style.order = titleOrder + 1;

    var previousPreviewButton = document.createElement("p");
    previousPreviewButton.className = "previewNavButton";
    previousPreviewButton.id = "previewButton_previous"
    previousPreviewButton.innerHTML = "previous";
    previousPreviewButton.addEventListener("click",handlePreviewNav);

    var viewPreviewButton = document.createElement("p");
    viewPreviewButton.id = "previewButton_view"
    viewPreviewButton.innerHTML = "view";
    viewPreviewButton.addEventListener("click",previewButtonHandler);

    var codePreviewButton = document.createElement("p");
    codePreviewButton.id = "previewButton_code";
    codePreviewButton.innerHTML = "source code";
    codePreviewButton.addEventListener("click",previewButtonHandler);

    var nextPreviewButton = document.createElement("p");
    nextPreviewButton.className = "previewNavButton";
    nextPreviewButton.id = "previewButton_next"
    nextPreviewButton.innerHTML = "next";
    nextPreviewButton.addEventListener("click",handlePreviewNav);

    previewDate.appendChild(previousPreviewButton);
    previewDate.appendChild(viewPreviewButton);
    previewDate.appendChild(codePreviewButton);
    previewDate.appendChild(nextPreviewButton);

    insertAfter(dateEl,previewDate);

    setTimeout(function () {

        var prevHeight = ((60*4)-2) + "px";

        previewTags.classList.add("active");

        previewDate.classList.add("active");

        previewImage.classList.add("active");
        previewHold = false;
        // titleEl.scrollIntoView({behavior: "smooth", block: "nearest", inline: "nearest"});
        hidePreview();
    }, 50);
}

function removePreviews() {
    setTimeout(function () {
        var remEl = document.getElementById("previewImage_" + lastPreview);
        while (remEl) {
            remEl.parentNode.removeChild(remEl);
            remEl = document.getElementById("previewImage_" + lastPreview);
        }

        remEl = document.getElementById("previewTags_" + lastPreview);
        while (remEl) {
            remEl.parentNode.removeChild(remEl);
            remEl = document.getElementById("previewTags_" + lastPreview);
        }

        remEl = document.getElementById("previewDate_" + lastPreview);
        while (remEl) {
            remEl.parentNode.removeChild(remEl);
            remEl = document.getElementById("previewDate_" + lastPreview);
        }
        setTimeout(function () {
            previewHold = false;
        }, 1);
    }, 300);
}

function hidePreview() {
    previewHold = true;
    var remEl = document.getElementById("previewImage_" + lastPreview);
    if (remEl) remEl.classList.remove("active");

    remEl = document.getElementById("previewTags_" + lastPreview);
    if (remEl) remEl.classList.remove("active");

    remEl = document.getElementById("previewDate_" + lastPreview);
    if (remEl) remEl.classList.remove("active");

    removePreviews();
}

function togglePreview(tag) {
    if (previewHold) return;

    lastPreview = curPreview;
    if (curPreview != tag) showPreview(tag);
    else {
        curPreview = null;
        hidePreview();
    }
}

function handleTogglePreview(ev) {
    var target = getParent(ev.target,"listCol");
    var tag = target.id.split("_").splice(1).join("_");
    togglePreview(tag)
}

/******************************************************************************/
/*************************** PREVIEW NAVIGATION *******************************/
/******************************************************************************/

const BASE_GITHUB_LINK = "https://github.com/returningsam/website-of-mine/tree/master/public/playground/";

function previewButtonHandler(ev) {
    var targToks = ev.target.id.split("_");
    if (targToks[targToks.length-1] == "view" || targToks[0] == "previewImage")
        window.open("/playground/" + curPreview,"_blank");
    else
        window.open(BASE_GITHUB_LINK + curPreview,"_blank");
}

function previousPreview() {
    var curOrder = parseInt(document.getElementById("title_" + curPreview).style.order) / 2;
    if (curOrder == 0) return;
    var nextTag = pgDataArr[curOrder-1].title;

    while (document.getElementById("title_" + nextTag).style.display == "none" && curOrder > 1) {
        curOrder--;
        nextTag = pgDataArr[curOrder-1].title;
    }
    if(curOrder > 0) togglePreview(nextTag);
}

function nextPreview() {
    var curOrder = parseInt(document.getElementById("title_" + curPreview).style.order) / 2;
    if (curOrder > pgDataArr.length-2) return;
    var nextTag = pgDataArr[curOrder+1].title;
    while (document.getElementById("title_" + nextTag).style.display == "none" && curOrder < pgDataArr.length-2) {
        curOrder++;
        nextTag = pgDataArr[curOrder+1].title;
    }
    // console.log(nextTag);
    if(curOrder < pgDataArr.length-1) togglePreview(nextTag);
}

function handlePreviewNav(ev) {
    var direction = ev.target.id.split("_")[1];
    // console.log(direction);
    if (direction == "next") nextPreview();
    else previousPreview();
}

function handleArrowClick(ev) {
    // console.log(ev);
    if (curPreview) {
        if (ev.keyCode == 40) {
            nextPreview();
            ev.preventDefault();
            return false;
        }
        else if (ev.keyCode == 38) {
            previousPreview();
            ev.preventDefault();
            return false;
        }
    }
}

/******************************************************************************/
/*************************** GRAIN ********************************************/
/******************************************************************************/

function initGrain() {
    var gCanv = document.getElementById("grainCanv");
    var gCtx = gCanv.getContext("2d");
    gCanv.width  = window.innerWidth  * 2;
    gCanv.height = window.innerHeight * 2;
    gCtx.clearRect(0,0,gCanv.width,gCanv.width);
    var imgData = gCtx.createImageData(gCanv.width,gCanv.height);
    for (var i = 0; i < imgData.data.length; i+=4) {
        imgData.data[i]   = chance.integer({min: 0, max: 200});
        imgData.data[i+1] = chance.integer({min: 0, max: 200});
        imgData.data[i+2] = chance.integer({min: 0, max: 200});
        imgData.data[i+3] = chance.integer({min: 0, max: 25});
    }
    gCtx.putImageData(imgData, 0, 0);
    // console.log("grain done");
}

/******************************************************************************/
/*************************** ALIGNMENT STUFF **********************************/
/******************************************************************************/

function fixAlignment() {
    var descTextEl = document.getElementById("mainTop");
    var alignCol = document.getElementById("listCol_tags");
    descTextEl.style.maxWidth = ((alignCol.clientWidth + alignCol.offsetLeft) - (descTextEl.offsetLeft)) + "px"
}

/******************************************************************************/
/*************************** NAME ANIMATION ***********************************/
/******************************************************************************/

var nameLinkElement;
const DEFAULT_NAME_VALUE = "Samuel Kilgus";
const HOVER_NAME_VALUE   = "Sæmju'ɛl Kɪlɡəs";

function enableNameHover() {nameLinkElement.innerHTML = HOVER_NAME_VALUE;}
function disableNameHover() {nameLinkElement.innerHTML = DEFAULT_NAME_VALUE;}

function initNameHoverAnimation() {
    nameLinkElement = document.getElementById("nameLink");
    nameLinkElement.addEventListener("mouseenter",enableNameHover);
    nameLinkElement.addEventListener("mouseleave",disableNameHover);
}

/******************************************************************************/
/*************************** INITILIZATION ************************************/
/******************************************************************************/

function initData() {
    pgDataArr = [];
    var allKeys = Object.keys(pgData);
    for (var i = 0; i < allKeys.length; i++) {
        var obj = pgData[allKeys[i]];
        obj.title = allKeys[i];
        pgDataArr.push(obj);
    }
    // console.log(pgDataArr);
}

function init() {
    initData();
    initGrain();
    initList();
    initSearchInputs();
    initDateFilter();
    fixAlignment();
    sortListOptions();
    setTimeout(filterOptions, 10);

    if (!mobileCheck()) {
        initNameHoverAnimation();
        document.body.addEventListener("keydown",handleArrowClick);
    }
    else {
        var mobileMessage = document.createElement("p");
        mobileMessage.innerHTML = "NOTE: Many of the projects may have been filtered out because they do not work on mobile devices. I suggest returning to this site on your computer to see more amazing projects.";
        document.getElementById("mainTop").appendChild(mobileMessage);
    }
}

function resize() {
    fixAlignment();
    hidePreview();
}

window.onload = init;
window.onresize = resize;
