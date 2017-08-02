// in this module we execute commands from background script

console.log('vkmb')

// simulate click
function sim_click(btn) {
  //console.log('vkmb sim_click on',btn);
  let e1 = document.createEvent('MouseEvents');
  let e2 = document.createEvent('MouseEvents');
  let e3 = document.createEvent('MouseEvents');
  let e4 = document.createEvent('MouseEvents')
  e1.initEvent('mouseover', true, false);
  e2.initEvent('mousedown', true, false);
  e3.initEvent('mouseup', true, false)
  e4.initEvent('mouseout', true, false);
  btn.dispatchEvent( e1 );
  btn.dispatchEvent( e2 );
  btn.dispatchEvent( e3 )
  btn.dispatchEvent( e4 );
  btn.click();
}

function tryVkClick(btn, t, close) {
  t |= 0
  //console.log("vkmb tryVkClick v3 ("+btn+", "+t+")")
  setTimeout(function() {
    var top_audio = document.getElementById('top_audio_player')
    var player_loaded = window.top_audio_layer_place.children.length > 0
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
    } else if (player_loaded && el2) {
      el2.click()
      if (close) sim_click(top_audio);
    } else {
      sim_click(top_audio);
      if (t < 5000) {
        tryVkClick(btn, t + 50, true)
      } else {
        // still no button... operation failed, so just hide playlist
        sim_click(top_audio);
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
function do_action(req) {
  var action = req.action
  var playing = isPlaying()
  if (req.action == 'activate') {
    console.log('vkmb: activate')
    console.log('vkmb: current page is playing - ', playing)
    if (playing) {
      chrome.runtime.sendMessage({activate: true})
    }
  } else if (
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
      result: do_action(request),
      audio: isAudioTab(),
      tabid: request.tabid
    })
  }
)

// "change" design a little
//document.querySelector('body').style.backgroundColor = 'white'
var sheet = document.styleSheets[0]
//sheet.insertRule('.emoji_smile_wrap { display: none }')
sheet.insertRule('.public_help_steps_module { display: none }')
//sheet.insertRule('.im-chat-input--attach { right: 4px }')

