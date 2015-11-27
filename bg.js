// here we receive commands and retranslate em to correspounding tabs

// we save id of tab that returned true and send that information to all tabs next time
// it makes action processing more stateful
var lastTab = 0
var selectedTab
var audioTab
var ntabs = 0
var cmd = ''
var responses
var tabFound

function broadcastCmd(tabs) {
  if (tabs.length != 0) {
    ntabs += tabs.length
    var prevTab = lastTab
    console.log("vkmb: last active tab was " + prevTab)
    for (i = 0; i < tabs.length; i++) {
      tabid = tabs[i].id
      console.log('vkmb: send command to tab ' + tabid)
      if (tabs[i].active) {
        console.log('vkmb: selected tab: '+tabid)
        selectedTab = tabid
      }
      chrome.tabs.sendMessage(
        tabid, {
          tabid: tabid,
          action: cmd,
          numtabs: tabs.length,
          lastactive: (prevTab == tabid)
        },
        function (response) {
          responses += 1
          if (typeof response != 'undefined') {
            if (response.result) {
              console.log("vkmb: set last active tab to " + response.tabid)
              lastTab = response.tabid
              tabFound = true
            } else if (response.audio) {
              if (audioTab == 0) {
                audioTab = response.tabid
                console.log('audio tab found')
              } else if (audioTab != 0) {
                audioTab = -1 // several audio tabs
                console.log('there are several audio tabs')
              }
            }
          }
        }
      )
    }
  }
}

function waitResponses(t) {
  console.log("waitReponses("+t+")")
  if ((responses >= ntabs) || (t > 1000)) {
    if (!tabFound) {
      if ((audioTab != 0) && (audioTab != -1)) {
        console.log('resend cmd to audio tab')
        lastTab = audioTab
        // resend the command to audio tab
        chrome.tabs.query({url: 'http://vk.com/*'}, broadcastCmd)
        chrome.tabs.query({url: 'https://vk.com/*'}, broadcastCmd)
      } else if (selectedTab != 0) {
        console.log('resend cmd to selected tab')
        lastTab = selectedTab
        // resend the command to selected tab
        chrome.tabs.query({url: 'http://vk.com/*'}, broadcastCmd)
        chrome.tabs.query({url: 'https://vk.com/*'}, broadcastCmd)
      }
    }
  } else {
    if (!tabFound) setTimeout(function(){waitResponses(t+100)}, 100)
  }
}

chrome.commands.onCommand.addListener(function(command) {
  console.log('vkmb: command:', command)
  cmd = command
  ntabs = 0
  responses = 0
  selectedTab = 0
  tabFound = false
  audioTab = 0
  // process http and https separately
  // tabs.count==1 case will not work in that case but its simpler
  chrome.tabs.query({url: 'http://vk.com/*'}, broadcastCmd)
  chrome.tabs.query({url: 'https://vk.com/*'}, broadcastCmd)
  if (!tabFound) setTimeout(function(){waitResponses(100)}, 100)
})


