//variables used
var youtubeIconUrl = "YT.png";
var divHeaderTitle = "YouTube Controller";
var notab = "Youtube is not open in any tab.";
var noShow = "Nothing is playing in this tab.";
var divHeaderRow = null;
var youTubeIcon = "";
var nowPlayingRow = null;
var nextSong = null;
var nextSongRow = null;
var rowWrapper = null;
var noOfOpenYoutubeTabs = 0;
var openTabsWrapper = null;
var currentsong = null;

/**
 * /Function to get youtube tabs information once the document is ready
 */
$(document).ready(function () {
    getYoutubeTabs();
});
/**
 * call series of function to clear and produce UI
 */
function getYoutubeTabs() {
    clearPopupWindowDivElements();
    setupHeaderDiv();
    tabsWorker();
}
/**
    * Clear popup windows Divs
    * Reset noOfOpenYoutubeTabs information
    */
function clearPopupWindowDivElements() {
    $("#divData").empty();
    $("#divHeader").empty();
    $("#tabsInfo").empty();
    noOfOpenYoutubeTabs = 0;
}
/**
     * Create and setup header youtube icon and title
     */
function setupHeaderDiv() {
    youTubeIcon = $('<div class="youtubeIconDiv"><img src=' + youtubeIconUrl + ' class="youtubeImg"><div>');
    divHeaderRow = $('<div class="youtubeHeaderDiv"><h3 class="headerText">' + divHeaderTitle + '</h3></div>');
    $("#divHeader")
        .append(youTubeIcon)
        .append(divHeaderRow);
}
/**
 *  Create and setup no of open you tube inforamtion
 */
function setupOpenTabsInfoDiv() {
    openTabsWrapper = $('<div class="alert alert-info"><strong>Total Open YouTube Tabs : ' + noOfOpenYoutubeTabs + '</strong></div>');
    $("#tabsInfo")
        .append(openTabsWrapper);
}
/**
    * Main function to retrieve tabs information
    * Create respective UI Elemenets 
    * Generate row for Current song, next song, play|pause, next button click events
    * Bind them to divData
    */
function tabsWorker() {
    chrome.tabs.getAllInWindow(null, function (tabs) {
        //lopping through each tab to check if youtube is open or not
        $.each(tabs, function (index, value) {
            var url = value.url;
            if (url.match("https://www.youtube.com/watch")) {
                noOfOpenYoutubeTabs++;
                var active = value.active;
                var tabId = value.id;

                var playPauseButton = $('<button/>',
                    {
                        text: 'Play | Pause',
                        class: "btn btn-primary btn-sm playPauseButton",
                        click: function () {
                            chrome.tabs.executeScript(tabId,
                                {
                                    code: "var x = document.getElementsByClassName('ytp-play-button ytp-button');  x[0].click();"
                                }, function (results) { });
                        }
                    });

                var nextButton = $('<button/>',
                    {
                        text: 'Next Song',
                        class: 'btn btn-primary btn-sm nextButton',
                        click: function () {
                            chrome.tabs.executeScript(tabId,
                                {
                                    code: "var x = document.getElementsByClassName('ytp-next-button ytp-button');  x[0].click();"
                                }, function (results) {
                                    setTimeout(getYoutubeTabs, 4000);
                                });
                        }
                    });

                chrome.tabs.executeScript(tabId,
                    {
                        code: "var previewData = document.querySelectorAll('.ytp-next-button')[0].getAttribute('data-tooltip-text'); previewData;"
                    }, function (results) {

                        nextSong = results[0];
                        nowPlayingRow = $('<div><h5 class="nowPlayingText">Now Playing : ' + value.title + '<h5></div>');
                        nextSongRow = $('<div><h5 class="nextPlayingText">Next Song : ' + nextSong + '</h5></div>');
                        rowWrapper = $('<div class="infoWrapper"></div>');

                        rowWrapper
                            .append(nowPlayingRow)
                            .append(nextSongRow)
                            .append(playPauseButton)
                            .append(nextButton);

                        $("#divData")
                            .append(rowWrapper);
                    }
                );
            }
            else if (url.match("https://www.youtube.com/")) {
                noOfOpenYoutubeTabs++;
                rowWrapper = $('<div class="infoWrapper"></div>');
                rowWrapper.append(noShow);
                $("#divData")
                    .append(rowWrapper);
            }
        });
        setupOpenTabsInfoDiv(noOfOpenYoutubeTabs);
    });
}