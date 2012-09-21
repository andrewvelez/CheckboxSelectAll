(function($){
  
  $(document).ready(function() {
    var element = $('#toggleLink');
    $('#toggleLink').click(function() {
      chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendMessage(tab.id, { isToggle : true });
      });
    });
  });

})(jQuery);