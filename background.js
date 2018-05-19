chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

    if (request.loadHighlights === true){
        var items = new Array();

        var contentObj = new Object();
            contentObj.address = request.link;
    
        $.post(request.url, contentObj, function(data) {
            for (var i = 0; i < data.content.length; i++) {
                items.push(data.content[i].detail);
            }
            sendResponse({data: items});
        })
        return true;
    }else {
        var contentObj = new Object();
        contentObj.author = "username";
        contentObj.address = sender.tab.url;
        contentObj.detail = request.hightlightedText;
  
        $.post("http://40.74.71.24/content", contentObj, function(data, status) { 
              console.log(data);
          });  
    }
    //   if (request.greeting == "hello")
        // sendResponse({farewell: "goodbye"});
    });

function addHighlightableExpression(info, tab) {
    console.log("info", info);
    var contentObj = new Object();
        contentObj.author = "username";
        contentObj.address = info.pageUrl;
        contentObj.detail = info.selectionText;

        console.log("contentObj", contentObj);
        $.post("http://40.74.71.24/content", contentObj, function(data, status) { 
            console.log(data);
        });

    chrome.tabs.query({
        "active": true,
        "currentWindow": true
    }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            "wordToHighlight": info.selectionText
        });
    });
}

var contexts = ["selection"];

for (var i = 0; i < contexts.length; i++) {
    var context = contexts[i];
    var title = "Highlight expression";
    var id = chrome.contextMenus.create({
        "title": title,
        "contexts": [context],
        "onclick": addHighlightableExpression
    });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    var items = new Array();

    var contentObj = new Object();
        contentObj.address = request.link;

    $.post(request.url, contentObj, function(data) {
        for (var i = 0; i < data.content.length; i++) {
            items.push(data.content[i].detail);
        }
        sendResponse({data: items});
    })
    return true;
});