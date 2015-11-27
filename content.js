console.log('vkmb')

// audioPlayer.prevTrack()
// audioPlayer.nextTrack()
// audioPlayer.playTrack()
// audioPlayer.pauseTrack()
// audioPlayer.shuffleAudios(true)

// works at least for vk.com 2015-08-16
function tryVkClick(btn, t) {
  console.log("vkmb tryVkClick("+btn+", "+t+")")
  setTimeout(function() {
    if (document.getElementById('pd_'+btn)) {
        document.getElementById('pd_'+btn).click();
        document.getElementById('head_music').click();
    } else {
      if (t < 5000) {
        tryVkClick(btn, t * 2 + 100) // 20 140 380 860 1820 ~4000
      } else {
        // still no button... operation failed, so just hide playlist
        document.getElementById('head_music').click()
      }
    }
  }, t)
}

// works at least for vk.com 2015-08-16
function vkClick(btn) {
  if (document.getElementById('ac_'+btn)) {
    document.getElementById('ac_'+btn).click();
  } else if (document.getElementById('pd_'+btn)) {
    document.getElementById('pd_'+btn).click();
  } else {
    document.getElementById('head_music').click();
    // wait for playlist to be ready and then click
    tryVkClick(btn, 20)
  }
}

function isPlaying() {
  return document.querySelector('#head_play_btn').className.indexOf('playing') > -1
}

function isAudioTab() {
  return document.location.toString().match('vk.com/audio') != null
}

// executes action
// return true if action was executed
function doAction(req) {
  var action = req.action
  var playing = isPlaying()
  if (
    (req.numtabs == 1) ||
    (
      ((req.action == 'play') && req.lastactive && !playing) ||
      (playing && (
        (action == 'prev') || (action == 'next') ||
        (action == 'pause') || (action == 'add') ||
        (action == 'repeat') || (action == 'shuffle')
      ))
    )
  ) {
    if (req.lastactive) console.log("vkmb: tab was active");
    console.log('vkmb: '+req.action)
    if (action == 'pause') {
      vkClick('play')
    } else {
      vkClick(action)
    }
    return true
  } else {
    console.log("vkmb: do nothing")
    return false
  }
}

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log('vkmb: request: ', request)
    sendResponse({
      result: doAction(request),
      audio: isAudioTab(),
      tabid: request.tabid
    })
  }
)



