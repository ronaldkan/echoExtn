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
    }
    else if (request.doSendMessage === true) {
        
    }
    else {
        var contentObj = new Object();
        console.log('background range', request);
        contentObj.author = "username";
        contentObj.address = sender.tab.url;
        contentObj.detail = request.hightlightedText;
        console.log('hit create highlight');
        console.log('show object', contentObj)
        $.post("https://echoes.japanwest.cloudapp.azure.com/content", contentObj, function(data, status) { 
            console.log(data);
        });  
    }
    //   if (request.greeting == "hello")
        // sendResponse({farewell: "goodbye"});
    });