function Game(canvas) {
  this.started = false;
  this.stage = 1;
  this.num_lines = 2;
  this.scale = 1;
  this.alpha = 1;
  this.fade1 = 0;
  this.fade2 = 0;
  this.resized = true;
  this.debug = false;

  this.puzzle = new Puzzle("001", this, new Point2D(100,100), new Array());

  //init
  this.canvas = document.getElementById('canvas');
  this.context = this.canvas.getContext('2d');

  //canvas resize
  this.canvas.width = Math.round(window.innerWidth);
  this.canvas.height = Math.round(window.innerHeight);
  console.log("canvas: "+this.canvas.width+", "+this.canvas.height)
  this.original_width = this.canvas.width;
  this.original_height = this.canvas.height;

  //size  
  this.font_size = Math.round(this.canvas.width/8);
  this.scaled_width = (this.canvas.width/this.scale)/2;
  this.scaled_height = (this.canvas.height/this.scale)/2;
  console.log('scaled_width: '+this.scaled_width);
  console.log('scaled_height: '+this.scaled_height);
      
  this.items_to_load = 4;
  this.loaded_items = 0;
  this.loaded = false;
  this.interval = null;
  this.maxElapsedTime = 0;
  this.start_time = 0;

  this.loadAssets();
}

Game.prototype.loadAssets = function() {
  console.log('start loading...');
  
  this.assets = Array({
      type: "audio",
      src: "audio/drip",
      slug: "drip"
    },{
      type: "audio",
      src: "audio/twang",
      slug: "twang"
    },{
      type: "audio",
      src: "audio/01_Alex_Must_Once_Upon_a_Time",
      slug: "bgm"
    },{
      type: "audio",
      src: "audio/chimes",
      slug: "chimes"
    }
  );
  
  this.items_to_load = this.assets.length;
  loadAssets(this, this.assets);
}

Game.prototype.init = function(){
  console.log('loading done!')
  console.log('initing...')
  clearTimeout(this.iniTimeout);
  
  /*
  if(window.innerHeight <= 600){
    this.context.scale(0.5,0.5);
    this.scale = 0.5;
  }else
    this.scale = 1;
  */

  //IMAGE SIZE
  if(this.resized)
    this.apply_scale();

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
  
  this.clock_interval = null;
  this.mouse = new Mouse(this);
  
  this.puzzles = [
    new Puzzle("001", this, new Point2D((this.canvas.width/2-306/2), (this.canvas.height/2-347/2)-5), new Array(
      new Point2D(0,14),
      new Point2D(89,0),
      new Point2D(90,34),
      new Point2D(84,84),
      new Point2D(56,164),
      new Point2D(173,161),
      new Point2D(20,234))),
    new Puzzle("002", this, new Point2D((this.canvas.width/2-475/2)+20, (this.canvas.height/2-376/2)+32), new Array(
      new Point2D(30,18),
      new Point2D(0,81),
      new Point2D(192,5),
      new Point2D(271,0),
      new Point2D(271,88),
      new Point2D(320,164),
      new Point2D(259,172),
      new Point2D(184,152),
      new Point2D(120,138))),
    new Puzzle("003", this, new Point2D((this.canvas.width/2-303/2), (this.canvas.height/2-355/2)-5), new Array(
      new Point2D(96,0),
      new Point2D(16,23),
      new Point2D(97,87),
      new Point2D(1,145),
      new Point2D(0,203),
      new Point2D(55,196),
      new Point2D(145,209),
      new Point2D(195,281),
      new Point2D(142,280),
      new Point2D(40,277))),
    new Puzzle("004", this, new Point2D((this.canvas.width/2-467/2), (this.canvas.height/2-333/2)), new Array(
      new Point2D(0,173),
      new Point2D(49,66),
      new Point2D(207.0),
      new Point2D(286,24),
      new Point2D(115,120),
      new Point2D(170,115))),
    new Puzzle("005", this, new Point2D((this.canvas.width/2-346/2)+2, (this.canvas.height/2-425/2)+5), new Array(
      new Point2D(40,0),
      new Point2D(28,37),
      new Point2D(176,37),
      new Point2D(0,186),
      new Point2D(175,179))),
    new Puzzle("006", this, new Point2D((this.canvas.width/2-298/2)+5, (this.canvas.height/2-400/2)+5), new Array(
      new Point2D(82,0),
      new Point2D(0,193),
      new Point2D(166,283),
      new Point2D(65,127))),
    new Puzzle("007", this, new Point2D((this.canvas.width/2-337/2)+3, (this.canvas.height/2-433/2)+5), new Array(
      new Point2D(0,61),
      new Point2D(144,0),
      new Point2D(27,38),
      new Point2D(26,58),
      new Point2D(95,226),
      new Point2D(193,215))),
    new Puzzle("008", this, new Point2D((this.canvas.width/2-427/2)+5, (this.canvas.height/2-433/2)+5), new Array(
      new Point2D(28,0),
      new Point2D(0,257),
      new Point2D(58,109),
      new Point2D(185,0))),
    new Puzzle("009", this, new Point2D((this.canvas.width/2-425/2)+5, (this.canvas.height/2-666/2)+10), new Array(
      new Point2D(79,0),
      new Point2D(0,118),
      new Point2D(54,512),
      new Point2D(294,538),
      new Point2D(102,346),
      new Point2D(247,341))),
    new Puzzle("010", this, new Point2D((this.canvas.width/2-316/2), (this.canvas.height/2-446/2)+2), new Array(
      new Point2D(4,0),
      new Point2D(12,90),
      new Point2D(0,276),
      new Point2D(162,272),
      new Point2D(12,363),
      new Point2D(162,363))),
    new Puzzle("011", this, new Point2D(100,100), new Array(
      new Point2D(4,0),
      new Point2D(53,46),
      new Point2D(4,227),
      new Point2D(178,227),
      new Point2D(88,373)))/*,
    new Puzzle("012", this, new Point2D(100,100), new Array(
      new Point2D(4,0),
      new Point2D(53,46),
      new Point2D(0,276),
      new Point2D(162,272),
      new Point2D(12,363),
      new Point2D(162,363))),
    new Puzzle("013", this, new Point2D(100,100), new Array(
      new Point2D(4,0),
      new Point2D(12,90),
      new Point2D(0,276),
      new Point2D(162,272),
      new Point2D(12,363),
      new Point2D(162,363))),
    new Puzzle("014", this, new Point2D(100,100), new Array(
      new Point2D(4,0),
      new Point2D(12,90),
      new Point2D(0,276),
      new Point2D(162,272),
      new Point2D(12,363),
      new Point2D(162,363))),
    new Puzzle("015", this, new Point2D(100,100), new Array(
      new Point2D(4,0),
      new Point2D(12,90),
      new Point2D(0,276),
      new Point2D(162,272),
      new Point2D(12,363),
      new Point2D(162,363))),
    new Puzzle("016", this, new Point2D(100,100), new Array(
      new Point2D(4,0),
      new Point2D(12,90),
      new Point2D(0,276),
      new Point2D(162,272),
      new Point2D(12,363),
      new Point2D(162,363))),
    new Puzzle("017", this, new Point2D(100,100), new Array(
      new Point2D(4,0),
      new Point2D(12,90),
      new Point2D(0,276),
      new Point2D(162,272),
      new Point2D(12,363),
      new Point2D(162,363))),
    new Puzzle("018", this, new Point2D(100,100), new Array(
      new Point2D(4,0),
      new Point2D(12,90),
      new Point2D(0,276),
      new Point2D(162,272),
      new Point2D(12,363),
      new Point2D(162,363))),
    new Puzzle("019", this, new Point2D(100,100), new Array(
      new Point2D(4,0),
      new Point2D(12,90),
      new Point2D(0,276),
      new Point2D(162,272),
      new Point2D(12,363),
      new Point2D(162,363))),
    new Puzzle("020", this, new Point2D(100,100), new Array(
      new Point2D(4,0),
      new Point2D(12,90),
      new Point2D(0,276),
      new Point2D(162,272),
      new Point2D(12,363),
      new Point2D(162,363)))*/
  ];

  this.puzzle = this.puzzles[this.stage-1];

}

Game.prototype.render = function() {
  
  this.draw_bg();
    
  //LOADING
  if(!this.loaded){
    if((this.items_to_load > 0)&&(this.loaded_items == this.items_to_load)){
      this.items_to_load = 0;
      //this.iniTimeout = setTimeout("game.init();", 3000);
      this.init();
    }else{
      this.draw_loading();
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
      
      //REMAINING TIME
      this.draw_remaining();
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
  if(!this.scale) this.scale = 1;
  this.context.fillStyle = "rgba(125, 125, 125, 1)";
  this.context.fillRect(0,0,this.canvas.width/this.scale,this.canvas.height/this.scale);
  /*
  //puzzle image
  var offsetx = Math.round(this.scaled_width-(this.img_width)/2);
  var offsety = Math.round(this.scaled_height-(this.img_height)/2);
  offsety += 40;
  this.context.globalAlpha = 0.2;
  this.context.drawImage(this.img, offsetx, offsety, this.img_width, this.img_height);
  */
}

Game.prototype.draw_remaining = function() {
  this.fade1 = this.fade1+(0.010*this.alpha);
  if(this.fade1 >= 0.6)
    this.alpha = -1;
  else if(this.fade1 <= 0.2)
    this.alpha = 1;
  this.context.fillStyle = "rgba(255, 255, 255, "+this.fade1+")";
  this.context.strokeStyle = "rgba(0, 0, 0, 0.5)";
  this.context.lineWidth = 2;
  this.context.font = "bold "+this.font_size+"px Arial";
  this.context.textBaseline = 'top';
  this.context.textAlign = 'left';
  this.context.strokeText(this.puzzle.remaining_time, 10, 30);
  this.context.fillText(this.puzzle.remaining_time, 10, 30);
}

Game.prototype.draw_loading = function() {
  this.fade1 = this.fade1+0.025;
  if(this.fade1 >= 1)
    this.fade1 = 0;
  this.fade2 = 1-this.fade1;
  
  this.context.fillStyle = "rgba(255, 255, 255, "+this.fade2+")";
  this.context.strokeStyle = "rgba(255, 255, 255, "+this.fade1+")";
  this.context.font = "bold "+this.font_size+"px Arial";
  this.context.textBaseline = 'middle';
  this.context.textAlign = 'center';
  this.context.lineWidth = 5;
  this.context.strokeText("LOADING", this.canvas.width/2, this.canvas.height/2);
  this.context.fillText("LOADING", this.canvas.width/2, this.canvas.height/2);
  //console.log('loading...');
}

Game.prototype.apply_scale = function(){
  document.getElementById('canvas').width = window.innerWidth;
  document.getElementById('canvas').height = window.innerHeight;
  
  var rw = document.getElementById('canvas').width / this.original_width;
  var rh = document.getElementById('canvas').height / this.original_height;
  this.scale = Math.min(rw,rh);

  this.context.scale(this.scale,this.scale);
  console.log('scale: '+this.scale);  
  this.resized = false;
}

////////////////////////////////////////
/*
Game.prototype.clockTick = function() {
  this.puzzle.remaining_time--;
}
*/
Game.prototype.getTimer = function() {
  return (new Date().getTime() - this.start_time); //milliseconds
}

Game.prototype.nextStage = function() {
  this.is_over = false;
  this.stage++;
  this.num_lines++;
  this.init();
  window.m.startGame();
}
