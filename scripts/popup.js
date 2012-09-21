(function($){
  
  $(document).ready(function() {
  
    var isGetForDocumentReady = true;
    
    function handleQueryForSelectRequestedBoolean(message) {
      if (message != null) {
        if (isGetForDocumentReady) {
          isGetForDocumentReady = false;
          finishDocumentReady(message.isSelectRequested);
        } else {
          finishCheckLinkClick(message.isSelectRequested);
        }
      }
    }
    
    function finishDocumentReady(isSelectRequested) {
      if (isSelectRequested) {
        $('#checkLink span').text('Not all selected (try again)');
      }
      $('#checkLink').click(handleCheckLinkClick);
      $('#uncheckLink').click(handleUncheckLinkClick);
    }
    
    function finishCheckLinkClick(isSelectRequested) {
      chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendMessage(tab.id,
          {
            type : "CheckAction",
            check : true,
            recheck : isSelectRequested
          }
        );
      });
      
      fireSetSelectRequestedBoolean(true);
      
      window.close();
    }
    
    function fireGetSelectRequestedBoolean() {
      chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendMessage(tab.id,
          {
            type : "SelectRequest",
            action : "get"
          },
          function(response) {
            handleQueryForSelectRequestedBoolean(response);
          }
        );
      });
    }
    
    function fireSetSelectRequestedBoolean(isRequested) {
      chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendMessage(tab.id,
          {
            type : "SelectRequest",
            action : "set",
            isSelectRequested : isRequested
          }
        );
      });
    }
    
    function handleCheckLinkClick() {
      fireGetSelectRequestedBoolean();
    }
    
    function handleUncheckLinkClick() {
      fireSetSelectRequestedBoolean(false);
      
      chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendMessage(tab.id,
          {
            type : "CheckAction",
            check : false,
            recheck : false
          }
        );
      });
      
      $('#checkLink span').text('Select all');
      
      window.close();
    }
  
    $(document).ready(function() {
      fireGetSelectRequestedBoolean();
    });
    
  });

})(jQuery);