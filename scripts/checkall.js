(function($){

  function handleToggle(message, sender, sendResponse) {
    if (message != null) {
      // two types: "CheckAction" & "SelectRequest"
      if (message.type == "CheckAction") {
        handleCheckActionMessage(message);
      } else if (message.type == "SelectRequest") {
        handleSelectRequestMessage(message, sendResponse);
      }
    }
  }
  
  function handleCheckActionMessage(message) {
    if (message.recheck) {
      $('body').data('cbTimeout', $('body').data('cbTimeout') * 2);
    } else {
      $('body').data('cbTimeout', 500);
    }
    $('body').data('cbCheck', message.check);
    
    $('body').prepend('<div id="coverScreen"><div id="waitCaption">Please Wait...</div></div>');
  
    var firstSet = $('li.checkableListItem');
    var container = firstSet.first().closest('div.scrollable');
    var scrollTo = firstSet.last();
    var nextSet = {};
    
    container.scrollTop(scrollTo.offset().top - container.offset().top + container.scrollTop());
    scrollTimeout = setTimeout(function(){
      scrollDown(container, scrollTo, firstSet, nextSet)
    }, $('body').data('cbTimeout'));
  }
  
  function handleSelectRequestMessage(message, sendResponse) {
    if (message.action == "get") {
      var isRequested = $('body').data('isSelectRequested');
      sendResponse({ isSelectRequested : isRequested });
    } else if (message.action == "set") {
      $('body').data('isSelectRequested', message.isSelectRequested);
    }
  }
  
  function scrollDown(container, scrollTo, firstSet, nextSet) {
    nextSet = container.find('li.checkableListItem');
    if (nextSet.length > firstSet.length) {
      firstSet = nextSet;
      scrollTo = firstSet.last();
      container.scrollTop(scrollTo.offset().top - container.offset().top + container.scrollTop());
      
      scrollTimeout = setTimeout(function(){
        scrollDown(container, scrollTo, firstSet, nextSet)
      }, $('body').data('cbTimeout'));
    } else {
      scrollTimeout = setTimeout(function(){ setConditionalCheck(nextSet) }, $('body').data('cbTimeout'));
    }
  }
  
  function setConditionalCheck(finalSet) {
    var filter = ($('body').data('cbCheck')) ? ':not(".selectedCheckable")' : '.selectedCheckable';
    
    var toReverse = finalSet.filter(filter);
    toReverse.click();
    
    finalSet.first().closest('div.profileBrowserDialog').find('input[type="submit"]').click(resetIsSelectRequestedOnSubmit);
    $('#coverScreen').remove();
  }
  
  function handleProfileBrowserLoad() {
    $('body').data('cbTimeout', 500);
  }
  
  function resetIsSelectRequestedOnSubmit() {
    $('body').data('isSelectRequested', false);
  }
  
  $(window).load(function() {
    $('body').data('cbTimeout', 500);
    chrome.extension.onMessage.addListener(handleToggle);
    $('body').on('load', 'div.fbProfileBrowser', handleProfileBrowserLoad);
  });

})(jQuery);