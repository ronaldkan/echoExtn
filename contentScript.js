var hwReplacements;
var replaceText;
var selectionRangeClone;
var hwBannedTags = ["STYLE", "SCRIPT", "NOSCRIPT", "TEXTAREA"];


$('<button type="button"></button>').addClass('echo-float-button').appendTo('body');
$('<i></i>').addClass('fa fa-comments-o echo-float-button-icon').appendTo($('.echo-float-button'));
$.get(chrome.extension.getURL('/chat.html'), function (data) {
    $(data).addClass('hide').appendTo('body');
});

$(document).on('click','.echo-float-button', function () {
    console.log('clicking');
    if (document.body.classList.contains('body-shift')) {
        $(".echo_chat").addClass('hide').removeClass('show');
        document.body.classList.remove("body-shift");
    }
    else {
        $(".echo_chat").addClass('show').removeClass('hide');
        document.body.classList.add("body-shift");
    }
});

function toggleScreen() {
    event.preventDefault();
    console.log('yipiyi');
    return false;
}

// function applyReplacementRule(node) {
//     // Ignore any node whose tag is banned
//     if (!node || $.inArray(node.tagName, hwBannedTags) !== -1) { return; }

//     try {
//         $(node).contents().each(function (i, v) {
//             // Ignore any child node that has been replaced already or doesn't contain text
//             if (v.isReplaced || v.nodeType !== Node.TEXT_NODE) { return; }

//             // Apply each replacement in order
//             hwReplacements.then(function (replacements) {
//                 if (replacements.words) {
//                     replacements.words.forEach(function (replacement) {
//                         //if( !replacement.active ) return;
//                         var matchedText = v.textContent.match(new RegExp(replacement, "i"));

//                         if (matchedText) {
//                             // Use `` instead of '' or "" if you want to use ${variable} inside a string
//                             // For more information visit https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
//                             highlightColor.then(function (item) {
//                                 var color = (item.color.startsWith("#")) ? item.color : "#" + item.color;
//                                 var replacedText = node.innerHTML.replace(new RegExp(`(${replacement})`, "i"), `<span style="background-color: ${color}">$1</span>`);

//                                 node.innerHTML = replacedText;
//                             });
//                         }
//                     });
//                 }
//             }).catch(function (reason) {
//                 console.log("Handle rejected promise (" + reason + ") here.");
//             });

//             v.isReplaced = true;
//         });
//     } catch (err) {
//         // Basically this means that an iframe had a cross-domain source
//         if (err.name !== "SecurityError") { throw err; }
//     }
// }

// hwReplacements = new Promise(function (resolve, reject) {

//     chrome.runtime.sendMessage({loadHighlights: true, url : "http://40.74.71.24/content", link: window.location.href}, function(response) {
//         chrome.storage.local.set({"words" : response.data}, function(result) {

//         });
//         chrome.storage.local.get("words", function (items) {
//             resolve(items);
//         });
//     });

// });

// highlightColor = new Promise(function (resolve, reject) {
//     chrome.storage.local.get("color", function (item) {
//         resolve(item);
//     });
// });

$(function () {
    $("body *").map(function (i, v) { applyReplacementRule(v); });
});

// Add bubble to the top of the page.
// var bubbleDOM = document.createElement('div');
// bubbleDOM.setAttribute('class', 'selection_bubble');
// document.body.appendChild(bubbleDOM);

function replaceSelectionWithHtml(html) {
    var range;
    if (window.getSelection && window.getSelection().getRangeAt) {
        range = window.getSelection().getRangeAt(0);
        range.deleteContents();
        var div = document.createElement("div");
        div.innerHTML = html;
        var frag = document.createDocumentFragment(), child;
        while ((child = div.firstChild)) {
            frag.appendChild(child);
        }
        range.insertNode(frag);
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        range.pasteHTML(html);
    }
}
var startNode = undefined;
var endNode = undefined;
var startOffset = undefined;
var endOffset = undefined;
// Lets listen to mouseup DOM events.
document.addEventListener('mouseup', function (e) {
    var range;

    if (window.getSelection().toString().length === 0) {
        $("span.popup-tag").css("display", "none");
        return;
    }
    if (window.getSelection && window.getSelection().getRangeAt) {
        replaceText = window.getSelection().toString();
        selectionRangeClone = window.getSelection().getRangeAt(0).cloneRange();
        console.log('rangeclone', selectionRangeClone);
        
        $("span.popup-tag").css("display","block");
        $("span.popup-tag").css("top",e.clientY + 12 + window.scrollY );
        $("span.popup-tag").css("left",e.clientX + 20);
        
        range = window.getSelection().getRangeAt(0);
        console.log(window.getSelection().toString());
        range.deleteContents();
        var div = document.createElement("div");
        div.innerHTML = '<span>' + replaceText + '</span>';
        var frag = document.createDocumentFragment(), child;
        while ( (child = div.firstChild) ) {
            frag.appendChild(child);
        }
        range.insertNode(frag);
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        range.pasteHTML('<span style="font-weight:bold;">' + replaceText +'</span>');
    }
}, false);

$(document).on('click', '.highlightBtn', function(e) {
    $("span.popup-tag").css("display","none");
    var selectedText = window.getSelection().getRangeAt(0).extractContents();
    var span= document.createElement("span");
    span.style.backgroundColor = "yellow";
    span.appendChild(selectedText);
    window.getSelection().getRangeAt(0).insertNode(span);
    console.log('replacing text -', replaceText);
    window.getSelection().empty();
    chrome.runtime.sendMessage({"loadHighlights": false, "hightlightedText": replaceText, "range": selectionRangeClone}, function(response) {
        // console.log(response);
      });
});

document.body.innerHTML += '<span class="popup-tag"><button class="highlightBtn">highlight</button></span>';

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.method == "getSelection")
        console.log(window.getSelection().toString());
});
