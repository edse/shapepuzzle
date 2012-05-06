// polyfill for animation frame
( function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
  }
  if(!window.requestAnimationFrame) {
    console.log('!window.requestAnimationFrame');
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 22 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }
  if(!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
}());

if(Modernizr.fullscreen){
  function RunPrefixMethod(obj, method) {
    var pfx = ["webkit", "moz", "ms", "o", ""];
    var p = 0, m, t;
    while (p < pfx.length && !obj[m]) {
      m = method;
      if (pfx[p] == "") {
        m = m.substr(0,1).toLowerCase() + m.substr(1);
      }
      m = pfx[p] + m;
      t = typeof obj[m];
      if (t != "undefined") {
        pfx = [pfx[p]];
        return (t == "function" ? obj[m]() : obj[m]);
      }
      p++;
    }
  
  }
}

// GAME START
var game = new Game();
var interval = null;
var gameInterval = null;
game.debug = false;
window.m = {
  game : game
};
window.m.interv = function() {
  interval = setTimeout("window.m.game.mouse.moving = false; document.getElementById('moving').value = false; window.m.intervClear();", 500);
}
window.m.intervClear = function() {
  clearInterval(interval)
}
window.m.stopGame = function() {
  clearInterval(gameInterval);
  
  game.started = false;
  window.m.stopSFX();
  window.m.stopBGM();
  window.cancelAnimationFrame(game.interval);

  $('#home').addClass('active');

  $('#play').show();
  $('.control').hide();
  
  $('#canvas, #canvas_bg').hide();
  $('.content').show();

}
window.m.startGame = function() {
  gameInterval = setInterval(function() { game.remaining_time--; },1000);
  game.started = true;
  //resizeGame();
  window.m.startSFX();
  window.m.startBGM();
  loop();
  $('#home').removeClass('active');
  $('#canvas, #canvas_bg, .control').show();
  $('.content, #play, #exitfullscreen, #bgm, #sfx, #autosnap').hide();
}
window.m.pauseGame = function() {
  clearInterval(gameInterval);
  game.started = false;
  window.cancelAnimationFrame(game.interval);

  $('#play').show();
  $('.control').hide();  
}
window.m.stopSFX = function() {
  window.m.game.drip.volume = 0.0;
  window.m.game.twang.volume = 0.0;
  window.m.game.drip.pause();
  window.m.game.twang.pause();
  $('#sfxoff').hide();
  $('#sfx').show();
}
window.m.startSFX = function() {
  window.m.game.drip.volume = 1.0;
  window.m.game.twang.volume = 1.0;
  $('#sfxoff').show();
  $('#sfx').hide();
}
window.m.stopBGM = function() {
  window.m.game.bgm.volume = 0.0;
  window.m.game.bgm.pause();
  $('#bgmoff').hide();
  $('#bgm').show();
}
window.m.startBGM = function() {
  window.m.game.bgm.volume = 1.0;
  window.m.game.bgm.play();
  $('#bgmoff').show();
  $('#bgm').hide();
}
window.m.autoSnap = function() {
  window.m.game.auto_snap = true;
  $('#autosnapoff').show();
  $('#autosnap').hide();
}
window.m.autoSnapOff = function() {
  window.m.game.auto_snap = false;
  $('#autosnapoff').hide();
  $('#autosnap').show();
}
window.m.fullscreen = function() {
  RunPrefixMethod(game.canvas, "RequestFullScreen");
}
window.m.exitfullscreen = function() {
  RunPrefixMethod(document, 'CancelFullScreen');
}

function start() {
  window.m.startGame();
}
function stop() {
  window.m.stopGame();
}
function pause() {
  window.m.pauseGame();
}

function loop() {
  game.interval = window.requestAnimationFrame(loop, game.canvas);

  game.render();

  var elapsed = game.getTimer() - game.time;
  game.time = game.getTimer();
  //elapsed = Math.min(20, Math.max(-20, elapsed));
  if(elapsed > game.maxElapsedTime)
    game.maxElapsedTime = elapsed;

  game.context.textAlign = 'left';
  game.context.fillStyle = "rgba(255, 255, 255, 1)";
  game.context.font = "bold 12px Arial";
  game.context.fillText("scale: " + game.scale, 50, 90);
  game.context.fillText("loaded items: " + game.loaded_items, 50, 100);
  game.context.fillText(">>> " + elapsed, 50, 110);
  game.context.fillText("maxElapsedTime>>> " + game.maxElapsedTime, 50, 120);
  game.context.fillText(game.remaining_time, 50, 130);
  game.context.fillText("auto-snap: "+game.auto_snap, 50, 140);

}
function itemLoaded(g){
  g.loaded_items++;
}

function mediaSupport(mimetype, container) {
  var elem = document.createElement(container);
  if(typeof elem.canPlayType == 'function'){
    var playable = elem.canPlayType(mimetype);
    if((playable.toLowerCase() == 'maybe')||(playable.toLowerCase() == 'probably')){
      return true;
    }
  }
  return false;
}
/*
//Handle the melody
  if(mediaSupport('audio/ogg; codecs=vorbis', 'audio') ||
    mediaSupport('audio/mpeg', 'audio')) {
*/

function resizeGame() {
    document.getElementById('canvas').width = window.innerWidth;
    document.getElementById('canvas').height = window.innerHeight;
    console.log("canvas: "+window.innerWidth+", "+window.innerHeight)
    //game.init();
}

window.addEventListener('resize', resizeGame, false);
window.addEventListener('orientationchange', resizeGame, false);

//

$(function() {
  $("#test").popover({
    animation: true,
    placement: 'right',
    delay: { show: 200, hide: 2000 }
  });
  
  $(".popover-test").popover();
  $(".tooltip-test").tooltip();
  
  $("#promo").alert();
  
  //$('#modal-success').modal();
    
  $("#next").click(function() {
    game.nextStage();
    $('#modal-success').modal('hide');
  });
  
});
