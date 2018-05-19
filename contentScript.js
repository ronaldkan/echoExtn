var hwReplacements, highlightColor;
var hwBannedTags = ["STYLE", "SCRIPT", "NOSCRIPT", "TEXTAREA"];


$('<button type="button"></button>').addClass('echo-float-button').appendTo('body');
$('<i></i>').addClass('fa fa-comments-o echo-float-button-icon').appendTo($('.echo-float-button'));

$(document).on('click','.echo-float-button', function () {
    console.log('clicking');
    if (document.body.classList.contains('body-shift')) {
        $(".echo_chat").remove();
        document.body.classList.remove("body-shift");
    }
    else {
        document.body.classList.add("body-shift");
        $.get(chrome.extension.getURL('/chat.html'), function (data) {
            $(data).appendTo('body');
        });
    }
});


function toggleScreen() {
    event.preventDefault();
    console.log('yipiyi');
    return false;
}

function applyReplacementRule(node) {
    // Ignore any node whose tag is banned
    if (!node || $.inArray(node.tagName, hwBannedTags) !== -1) { return; }

    try {
        $(node).contents().each(function (i, v) {
            // Ignore any child node that has been replaced already or doesn't contain text
            if (v.isReplaced || v.nodeType !== Node.TEXT_NODE) { return; }

            // Apply each replacement in order
            hwReplacements.then(function (replacements) {
                if (replacements.words) {
                    replacements.words.forEach(function (replacement) {
                        //if( !replacement.active ) return;
                        var matchedText = v.textContent.match(new RegExp(replacement, "i"));

                        if (matchedText) {
                            // Use `` instead of '' or "" if you want to use ${variable} inside a string
                            // For more information visit https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
                            highlightColor.then(function (item) {
                                var color = (item.color.startsWith("#")) ? item.color : "#" + item.color;
                                var replacedText = node.innerHTML.replace(new RegExp(`(${replacement})`, "i"), `<span style="background-color: ${color}">$1</span>`);

                                node.innerHTML = replacedText;
                            });
                        }
                    });
                }
            }).catch(function (reason) {
                console.log("Handle rejected promise (" + reason + ") here.");
            });

            v.isReplaced = true;
        });
    } catch (err) {
        // Basically this means that an iframe had a cross-domain source
        if (err.name !== "SecurityError") { throw err; }
    }
}

function storeWords(wordList) {
    chrome.storage.local.set({ "words": wordList }, function () {
        // autoReload.then(function (value) {
        // if(value.autoReload) {
        //     window.location.reload();
        // }
        // });
    });
}

function storeColor(hexCode) {
    chrome.storage.local.set({ "color": hexCode }, function () { });
}

hwReplacements = new Promise(function (resolve, reject) {
    chrome.storage.local.get("words", function (items) {
        resolve(items);
    });
});

highlightColor = new Promise(function (resolve, reject) {
    chrome.storage.local.get("color", function (item) {
        resolve(item);
    });
});

// autoReload = new Promise(function (resolve, reject) {
//     chrome.storage.local.get("autoReload", function (items) {
//         resolve(items);
//     });
// });

function getWordList() {
    var words = [];

    $(".wordList li").each(function (index, element) {
        words.push(element.textContent.trim());
    });

    return words;
}

chrome.extension.onMessage.addListener(function (message, sender, callback) {
    console.log(message);
    if (message.wordToHighlight) {
        hwReplacements.then(function (wordList) {
            if (wordList.words) {
                wordList.words.push(message.wordToHighlight);
                storeWords(wordList.words);
            } else {
                var words = [message.wordToHighlight];
                storeWords(words);
            }
        });
    }
});

$(function () {
    $("body *").map(function (i, v) { applyReplacementRule(v); });

    hwReplacements.then(function (replacements) {
        if (replacements.words) {
            replacements.words.forEach(function (replacement, index) {
                $(".wordList").append(`<li>${replacement} <i class="fa fa-trash right" aria-hidden="true"></i></li>`);
            });
        }
    }).catch(function (reason) {
        console.log("Handle rejected promise (" + reason + ") here.");
    });

    highlightColor.then(function (item) {
        if (item.color) {
            $(".jscolor").val(item.color);
            var color = (item.color.startsWith("#")) ? item.color : "#" + item.color;
            $(".highlight").css("background-color", color);
        }
    });

    // autoReload.then(function (value) {
    //     if(value.autoReload) {
    //         $("#autoReloadCheck").prop("checked", true);
    //     } else {
    //         $("#autoReloadCheck").prop("checked", false);
    //     }
    // });

    $(document).on("click", ".fa-trash", function () {
        $(this).parent().remove();
        storeWords(getWordList());
    });

    $(".jscolor").change(function (e) {
        storeColor($(".jscolor").val());
    });

    // $("#autoReloadCheck").change(function (e) {
    //     var checked;
    //     if($(this).is(":checked")) {
    //         checked = true;
    //     } else {
    //         checked = false;
    //     }

    //     chrome.storage.local.set({ "autoReload": checked }, function () { });
    // });
});

// Add bubble to the top of the page.
var bubbleDOM = document.createElement('div');
bubbleDOM.setAttribute('class', 'selection_bubble');
document.body.appendChild(bubbleDOM);

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
        var replaceText = window.getSelection().toString();
        $("span.popup-tag").css("display","block");
        $("span.popup-tag").css("top",event.clientY + 10);
        $("span.popup-tag").css("left",event.clientX);
        // $("span.popup-tag").html('<button class="highlightBtn">highlight</button>');
        
        range = window.getSelection().getRangeAt(0);
        // range.deleteContents();
        // var div = document.createElement("div");
        // div.innerHTML = '<span style="background-color:yellow;">' + replaceText + '</span>';
        // var frag = document.createDocumentFragment(), child;
        // while ((child = div.firstChild)) {
        //     frag.appendChild(child);
        // }
        // range.insertNode(frag);
    }
}, false);

$(document).on('click', '.highlightBtn', function() {
    console.log('hello');
    console.log(startNode);
    console.log(endNode);
    range = document.createRange();
    range.setStart(startNode, startOffset);
    range.setEnd(endNode, endOffset);
    range.deleteContents();
});


document.body.innerHTML += '<span class="popup-tag"><button class="highlightBtn">highlight</button></span>';

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.method == "getSelection")
        console.log(window.getSelection().toString());
});