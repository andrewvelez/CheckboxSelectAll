(function($){

  function handleToggle(message, sender, sendResponse) {
    if (message != null && message.isToggle) {
      $('body').append('<div id="coverScreen"><div id="waitCaption">Please Wait...</div></div>');
    
      var firstSet = $('li.checkableListItem');
      var container = firstSet.first().closest('div.scrollable');
      var scrollTo = firstSet.last();
      var nextSet = {};
      
      container.scrollTop(scrollTo.offset().top - container.offset().top + container.scrollTop());
      scrollTimeout = setTimeout(function(){
        scrollDown(container, scrollTo, firstSet, nextSet)
      }, 500);
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
      }, 500);
    } else {
      scrollTimeout = setTimeout(function(){ setChecked(nextSet) }, 500);
    }
  }
  
  function setChecked(finalSet) {
    if (finalSet.is('.selectedCheckable')) {
      finalSet.click();
    } else {
      var unchecked = finalSet.filter(':not(".selectedCheckable")');
      unchecked.click();
    }
    
    $('#coverScreen').remove();
    finalSet.first().closest('div[role="dialog"]').find('input[type="submit"]').click();
  }
  
  $(document).ready(function() {
    chrome.extension.onMessage.addListener(handleToggle);
  });

})(jQuery);