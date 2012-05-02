function Game(canvas) {
  this.debug = true;

  //init
  this.canvas = document.getElementById('canvas');
  this.context = this.canvas.getContext('2d');
  
  //canvas resize
  this.canvas.width = Math.round(window.innerWidth);
  this.canvas.height = Math.round(window.innerHeight);
  console.log("canvas: "+this.canvas.width+", "+this.canvas.height)
      
  this.items_to_load = 4;
  this.loaded_items = 0;
  this.loaded = false;
  this.interval = null;
  this.maxElapsedTime = 0;
  this.start_time = 0;

  this.loadAssets();
}

Game.prototype.loadAssets = function() {
  console.log('start loading...')
  
  //IMAGE
  /*
  this.img = new Image();
  this.img.src = "img/01.png";
  this.img.onload = this.loaded_items++;

  //IMAGE
  this.img_bg = new Image();
  this.img_bg.src = "img/bg.jpg";
  this.img_bg.onload = this.loaded_items++;
  */

  //AUDIO
  this.drip = document.createElement('audio');
  var source= document.createElement('source');
  if(this.drip.canPlayType('audio/mpeg;')) {
    source.type= 'audio/mpeg';
    source.src= 'audio/drip.mp3';
  }else {
    source.type= 'audio/ogg';
    source.src= 'audio/drip.ogg';
  }
  this.drip.appendChild(source);
  this.drip.addEventListener('canplaythrough', itemLoaded(this), false);
  
  //AUDIO
  this.twang = document.createElement('audio');
  var source= document.createElement('source');
  if(this.twang.canPlayType('audio/mpeg;')) {
    source.type= 'audio/mpeg';
    source.src= 'audio/twang.mp3';
  }else {
    source.type= 'audio/ogg';
    source.src= 'audio/twang.ogg';
  }
  this.twang.appendChild(source);
  this.twang.addEventListener('canplaythrough', itemLoaded(this), false);

  //AUDIO
  this.bgm = document.createElement('audio');
  var source= document.createElement('source');
  if(this.bgm.canPlayType('audio/mpeg;')) {
    source.type= 'audio/mpeg';
    source.src= 'audio/01_Alex_Must_Once_Upon_a_Time.mp3';
  }else {
    source.type= 'audio/ogg';
    source.src= 'audio/01_Alex_Must_Once_Upon_a_Time.ogg';
  }
  this.bgm.appendChild(source);
  this.bgm.addEventListener('canplaythrough', itemLoaded(this), false);
  this.bgm.play();
  
  //AUDIO
  this.chimes = document.createElement('audio');
  var source= document.createElement('source');
  if(this.chimes.canPlayType('audio/mpeg;')) {
    source.type= 'audio/mpeg';
    source.src= 'audio/chimes.mp3';
  }else {
    source.type= 'audio/ogg';
    source.src= 'audio/chimes.ogg';
  }
  this.chimes.appendChild(source);
  this.chimes.addEventListener('canplaythrough', itemLoaded(this), false);
  
  //BUTTON
  this.full_btn = document.createElement("input");
  this.full_btn.setAttribute("type", "button");
  this.full_btn.setAttribute("value", "FULLSCREEN on");
  this.full_btn.setAttribute("id", "full_btn");
  this.full_btn.onclick = function() {
    if(this.value == "FULLSCREEN off"){
      document.webkitCancelFullScreen();
      document.mozCancelFullScreen();
      this.value = "FULLSCREEN on";
    }else if(this.value == "FULLSCREEN on"){
      document.getElementById("canvas").webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      document.getElementById("canvas").mozRequestFullScreen();
      this.value = "FULLSCREEN off";
    }
  };
  document.getElementById("controls").appendChild(this.full_btn);

  //BUTTON
  this.bgm_btn = document.createElement("input");
  this.bgm_btn.setAttribute("type", "button");
  this.bgm_btn.setAttribute("value", "BGM off");
  this.bgm_btn.setAttribute("id", "bgm_btn");
  this.bgm_btn.onclick = function() {
    if(this.value == "BGM off"){
      window.m.stopBGM();
      this.value = "BGM on";
    }else if(this.value == "BGM on"){
      window.m.startBGM();
      this.value = "BGM off";
    }
  };
  document.getElementById("controls").appendChild(this.bgm_btn);

  //BUTTON
  this.sfx_btn = document.createElement("input");
  this.sfx_btn.setAttribute("type", "button");
  this.sfx_btn.setAttribute("value", "SFX off");
  this.sfx_btn.setAttribute("id", "sfx_btn");
  this.sfx_btn.onclick = function() {
    if(this.value == "SFX off"){
      window.m.stopSFX();
      this.value = "SFX on";
    }else if(this.value == "SFX on"){
      window.m.startSFX();
      this.value = "SFX off";
    }
  };
  document.getElementById("controls").appendChild(this.sfx_btn);

  //BUTTON
  this.snap_btn = document.createElement("input");
  this.snap_btn.setAttribute("type", "button");
  this.snap_btn.setAttribute("value", "AUTO-SNAP off");
  this.snap_btn.setAttribute("id", "snap_btn");
  this.snap_btn.onclick = function() {
    if(this.value == "AUTO-SNAP off"){
      window.m.game.auto_snap = false;
      this.value = "AUTO-SNAP on";
    }else if(this.value == "AUTO-SNAP on"){
      window.m.game.auto_snap = true;
      this.value = "AUTO-SNAP off";
    }
  };
  document.getElementById("controls").appendChild(this.snap_btn);
}

Game.prototype.init = function(){
  console.log('loading done!')
  console.log('initing...')
  clearTimeout(this.iniTimeout);
  
  if(window.innerHeight <= 600){
    this.context.scale(0.5,0.5);
    this.scale = 0.5;
  }else
    this.scale = 1;

  this.loaded = true;
  this.auto_snap = true;
  this.pieces = new Array();
  this.holders = new Array();
  this.placed_pieces = new Array();
  this.moving = true;
  this.selected = null;
  this.over = null;
  this.is_over = false;

  this.num_pieces = 5;

  //console.log(this.img.width+','+this.img.height)
  
  this.remaining_time = this.num_pieces*3;
  this.clock_interval = null;
  this.mouse = new Mouse(this);
  
  //001
  /*
  this.puzzle = new Puzzle("001", this, new Point2D(100,100), new Array(
    new Point2D(0,14),
    new Point2D(89,0),
    new Point2D(90,34),
    new Point2D(84,84),
    new Point2D(56,164),
    new Point2D(173,161),
    new Point2D(20,234)
  ));
  */
  
  //002
  /*
  this.puzzle = new Puzzle("002", this, new Point2D(100,100), new Array(
    new Point2D(30,18),
    new Point2D(0,81),
    new Point2D(192,5),
    new Point2D(271,0),
    new Point2D(271,88),
    new Point2D(320,164),
    new Point2D(259,172),
    new Point2D(184,152),
    new Point2D(120,138),
    new Point2D(220,338)
  ));
  */

  //003
  this.puzzle = new Puzzle("003", this, new Point2D(100,100), new Array(
    new Point2D(96,0),
    new Point2D(16,23),
    new Point2D(97,87),
    new Point2D(1,145),
    new Point2D(0,203),
    new Point2D(55,196),
    new Point2D(155,209),
    new Point2D(195,281),
    new Point2D(142,280),
    new Point2D(40,277)
  ));

}

Game.prototype.render = function() {
  
  this.draw_bg();
    
  //LOADING
  if(!this.loaded){
    if((this.items_to_load > 0)&&(this.loaded_items == this.items_to_load)){
      this.items_to_load = 0;
      this.iniTimeout = setTimeout("game.init();", 3000);
    }else{
      this.context.fillText("loading...", 50, 20);
    }
  }
  else{
    //PUZZLE LOADING
    if(!this.puzzle.loaded){
      if((this.puzzle.items_to_load > 0)&&(this.puzzle.loaded_items == this.puzzle.items_to_load)){
        this.puzzle.items_to_load = 0;
        this.puzzle.iniTimeout = setTimeout("game.puzzle.init();", 3000);
      }else{
        this.context.fillText("loading puzzle...", 50, 20);
        //this.context.fillText("loaded items: "+this.puzzle.loaded_items, 150, 20);
      }
    }
    else{
      //DRAW PUZZLE
      this.puzzle.draw();
    }
  
  }

  //DEBUG
  if(this.debug){
    if(this.mouse != undefined){
      document.getElementById('mx').value = this.mouse.x;
      document.getElementById('my').value = this.mouse.y;
      document.getElementById('moving').value = this.mouse.moving;
    }
  
    if(this.puzzle != undefined){
      document.getElementById('hx').value = this.puzzle.holders[0].position.x;
      document.getElementById('hy').value = this.puzzle.holders[0].position.y;
      document.getElementById('hx2').value = this.puzzle.holders[1].position.x;
      document.getElementById('hy2').value = this.puzzle.holders[1].position.y;
      document.getElementById('px').value = this.puzzle.pieces[0].position.x;
      document.getElementById('py').value = this.puzzle.pieces[0].position.y;
      document.getElementById('p').value = this.puzzle.num_pieces;
    }
  
    if(this.over)
      document.getElementById('over').value = this.over.id;
    else
      document.getElementById('over').value = "";
    if(this.selected)
      document.getElementById('selected').value = this.selected.id;
    else
      document.getElementById('selected').value = "";
  
    if(this.loaded)
      document.getElementById('pp').value = this.placed_pieces.length;
    
  }

}

Game.prototype.draw_bg = function() {
  this.context.save();
  //bg
  this.context.fillStyle = '#FEFEFE';
  this.context.fillRect(0,0,this.canvas.width/this.scale,this.canvas.height/this.scale);
  //box
  //this.context.strokeStyle = '#000000';
  //this.context.lineWidth = 1;
  //this.context.strokeRect(1,1,this.canvas.width-2,this.canvas.height-2);

  //bg image
  /*
  var offsetx = this.canvas.width/2-this.img_bg.width/2;
  var offsety = this.canvas.height/2-this.img_bg.height/2;
  this.context.globalAlpha = 1
  this.context.drawImage(this.img_bg, offsetx, offsety);
  
  //puzzle image
  var offsetx = this.canvas.width/2-this.img_width/2;
  var offsety = this.canvas.height/2-this.img_height/2;
  this.context.globalAlpha = 0.2
  this.context.drawImage(this.img, offsetx, offsety);
  */
  
  this.context.restore();
}

////////////////////////////////////////

Game.prototype.clockTick = function() {
  this.remaining_time--;
}

Game.prototype.getTimer = function() {
  return (new Date().getTime() - this.start_time); //milliseconds
}