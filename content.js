console.log('vkmb')

// works at least for vk.com 2015-08-16
// for pre 2016 design
/*function tryVkClick(btn, t) {
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
}*/

function tryVkClick(btn, t) {
  console.log("vkmb tryVkClick v2 ("+btn+", "+t+")")
  setTimeout(function() {
    var top_audio = document.getElementById('top_audio').classList.contains('active')
    var sel1
    if (btn == 'play' || btn == 'prev' || btn == 'next')
      sel1 = '.audio_page_player_ctrl.audio_page_player_'+btn
    else
      sel1 = '.audio_page_player_btn.audio_page_player_'+btn
    var sel2 = '.top_audio_player_btn.top_audio_player_'+btn
    var el1 = document.querySelector(sel1)
    var el2 = document.querySelector(sel2)
    if (el1) {
      el1.click()
    } else if (top_audio && el2) {
      el2.click()
    } else {
      document.getElementById('top_audio').click();
      if (t < 5000) {
        tryVkClick(btn, t * 2 + 100) // 20 140 380 860 1820 ~4000
      } else {
        // still no button... operation failed, so just hide playlist
        document.getElementById('top_audio').click()
      }
    }
  }, t)
}

function vkClick(btn) {
  if (btn=='play' || btn=='pause' || btn=='prev' || btn=='next') {
    tryVkClick(btn)
  } else if (btn=='shuffle') {
    tryVkClick(btn)
  } else if (btn=='repeat') {
    tryVkClick(btn)
  } else if (btn=='add') {
    tryVkClick(btn)
  }
}

function isPlaying() {
  return document.querySelector('.top_audio_player_playing') !== null
  //return document.querySelector('#head_play_btn').className.indexOf('playing') > -1
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
    /*if (action == 'play') {
      getAudioPlayer().play()
    } else if (action == 'pause') {
      getAudioPlayer().pause()
    }*/
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



