chrome.runtime.onInstalled.addListener(function() {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
      chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostEquals: 'mstr.lightning.force.com', pathContains: "/r/Case"},
        })       
        ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
      }]);
    });
  });