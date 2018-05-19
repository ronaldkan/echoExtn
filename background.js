chrome.browserAction.onClicked.addListener(function(activeTab){
    chrome.tabs.create({ url: chrome.runtime.getURL("main.html") } );
  });

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
        contentObj.startContainer = request.range.startContainer;
        contentObj.startOffset = request.range.startOffset;
        contentObj.endContainer = request.range.endContainer;
        contentObj.endOffset = request.range.endOffset;
        console.log('hit create highlight');
        console.log('show object', contentObj)
        $.post("http://40.74.71.24/content", contentObj, function(data, status) { 
              console.log(data);
          });  
    }
    //   if (request.greeting == "hello")
        // sendResponse({farewell: "goodbye"});
    });