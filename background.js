function addHighlightableExpression(info, tab) {
    console.log("info", info);
    var contentObj = new Object();
        contentObj.author = "username";
        contentObj.address = info.pageUrl;
        contentObj.detail = info.selectionText;

        console.log("contentObj", contentObj);
        $.post("http://40.74.71.24/content", contentObj, function(data, status) { 
            alert('posted');
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