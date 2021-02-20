// Background script executed as soon as
//   the ext is installed/refreshed
//console.log('hello from background');
var count = 0;
chrome.tabs.onActivated.addListener(tab => {
    if(count == 0){
        //alert('hello! have a nice day!')
    }
    count++;
})


chrome.alarms.onAlarm.addListener(function(alarm) {
  alert("Please Drink Some Water!!!");
});

// Implementing foreground script: (in active tab = null)
// chrome.tabs.executeScript(tab_to_insert_in, file_name, callback_fn)
chrome.tabs.executeScript(null, {file: 'foreground.js'}, 
                                () => console.log('foreground'));