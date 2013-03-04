/*****
 *
 *   puzzle.js
 *
 *****/

/*****
 *
 *   constructor
 *
 *****/
function Puzzle(id, game, sound, size, pos, positions) {
  
  //console.log(id)
  //console.log(positions)
  this.pos = pos;
  this.positions = positions;
  this.num_pieces = positions.length;
  this.remaining_time = this.num_pieces*30;
  this.time_to_complete = this.remaining_time;
  this.items_to_load = this.num_pieces*2+1;
  this.loaded_items = 0;
  this.id = id;
  this.game = game;
  this.pieces = new Array();
  this.holders = new Array();
  this.position = null;
  if(sound){
    this.has_voice = sound.has_voice;
    this.has_sound = sound.has_sound;
  }
  if(size){
    this.width = size.width;
    this.height = size.height;
  }
}

Puzzle.prototype.loadAssets = function() {
  //console.log('puzzle start loading...');
  //IMAGE
  this.img = new Image();
  this.img.src = "img/"+this.id+"/"+this.id+".png";
  this.img.onload = this.loaded_items++;

  //PIECES & HOLDERS
  for(i=1; i<=this.num_pieces; i++){
    //HODLER IMAGE
    var h = new Image();
    if(i<10)
      h.src = "img/"+this.id+"/h0"+i+".png";
    else
      h.src = "img/"+this.id+"/h"+i+".png";
    h.onload = this.loaded_items++;
    var holder = this.placeHolder(i, h);

    //PIECE IMAGE
    var p = new Image();
    if(i<10)
      p.src = "img/"+this.id+"/p0"+i+".png";
    else
      p.src = "img/"+this.id+"/p"+i+".png";
    p.onload = this.loaded_items++;
    this.placePiece(i, p, holder);
  }
  
  //VOICE & SOUNDS
  var sounds = []
  if(this.has_voice){
    $('#btn_voice').show();
    sounds.push({
      type: "audio",
      src: "img/"+this.id+"/voice",
      slug: "voice"
    });
  }
  else{
    $('#btn_voice').hide();
  }
  if(this.has_sound){
    $('#btn_sound').show();
    sounds.push({
      type: "audio",
      src: "img/"+this.id+"/sound",
      slug: "sound"
    });
  }
  else{
    $('#btn_sound').hide();
  }

  if(this.has_voice || this.has_sound){
    this.itens_to_load2 = sounds.length;
    loadAssetsII(this, sounds);
  }
}

Puzzle.prototype.init = function(){
  console.log('initing puzzle...');
  this.loaded = false;
  this.loadAssets();
  
  clearTimeout(this.iniTimeout);
  this.loaded = true;
  this.solved = false;
}

Puzzle.prototype.placePiece = function(id, img, holder){
  x = Math.floor(Math.random()*(this.game.canvas.width/this.game.scale-img.width));
  y = Math.floor(Math.random()*(this.game.canvas.height/this.game.scale-img.height));
  if(y<80) y += 80;
  if(y>this.game.canvas.height-20) y -= 80;
  if(x<80) x += 80;
  if(x>this.game.canvas.width-80) x -= 80;
  
  temp = new Piece(
    id,
    this.game,
    img,
    holder,
    new Point2D(x,y),
    new Point2D(x,y),
    true,
    false
  );
  this.pieces.push(temp);
  //console.log('puzzle pieces array length>>'+this.pieces.length);
}

Puzzle.prototype.placeHolder = function(id, img){
  
  this.pos.xx = (this.game.canvas.width/this.game.scale)/2-this.width/2; 
  this.pos.yy = (this.game.canvas.height/this.game.scale)/2-this.height/2; 
  
  //var x = this.positions[id-1].x+this.pos.x;
  //var y = this.positions[id-1].y+this.pos.y;
  var x = this.positions[id-1].x+this.pos.xx;
  var y = this.positions[id-1].y+this.pos.yy;
  //alert('x:'+x+' y:'+y)
  temp = new Holder(
    id,
    this.game,
    img,
    new Point2D(x,y),
    false
  );
  this.holders.push(temp);
  //console.log('puzzle holders array length>>'+this.holders.length+' '+temp.position.x+','+temp.position.y);
  return temp;
}

Puzzle.prototype.draw = function(){

  if(this.solved){    
    $('#stage').html("Stage "+this.game.stage+" completed!");
    $('#pieces').html(this.num_pieces+" pieces in "+(this.time_to_complete-this.remaining_time)+"s");
    this.solved = false;
    $('#modal-success').fadeIn();
    if(!window.m.iOS){
      /*
      if(this.has_voice && this.has_sound){
        window.m.game.chimes.addEventListener('ended', function(){
          this.currentTime = 0;
          this.pause();
          window.m.game.puzzle.voice.play();
        });
        this.voice.addEventListener('ended', function(){
          this.currentTime = 0;
          this.pause();
          window.m.game.puzzle.sound.play();
        });
      }
      else if(this.has_voice && !this.has_sound){
        window.m.game.chimes.addEventListener('ended', function(){
          this.currentTime = 0;
          this.pause();
          window.m.game.puzzle.voice.play();
        });
      }
      */
      window.m.game.chimes.play();
    }else{
      window.m.game.drip.src = "/audio/chimes.mp3";
      window.m.game.drip.play();
    }
  }
  else{
    
    if(this.num_pieces > this.game.placed_pieces.length){
    
      //HOLDERS
      for(var i = 0; i < this.holders.length; i++){
        this.holders[i].draw();
      }
    
      //PIECES
      var not_placed = new Array();
      var over = false;
      for(var i = 0; i < this.pieces.length; i++){
        piece = this.pieces[i];
        if(!piece.placed)
          not_placed.push(piece);
        else if(piece != this.game.selected)
          piece.draw();
      }
      
      if(!over){
        this.game.over = null;
      }
    
      //move
      if((this.game.selected != null)&&(this.game.selected.moveble)){
        this.game.selected.x = this.game.mouse.x;
        this.game.selected.y = this.game.mouse.y;
      }
      
      //NOT PLACED PIECES  
      for(var i = 0; i < not_placed.length; i++){
        not_placed[i].draw();
      }
      if(this.game.selected)
        this.game.selected.draw();
      
      //move
      if((this.game.selected != null)&&(this.game.selected.moveble)){
        this.game.selected.position.x = this.game.mouse.x-this.game.selected.img.width/2;
        this.game.selected.position.y = this.game.mouse.y-this.game.selected.img.height/2;
      }
      
      //Game Over
      if(this.remaining_time <= 0){
        window.m.stopGame();
        if(confirm('Timeup! Game Over! Wanna try again?')){
          this.game.is_over = false;
          this.game.init();
          window.m.startGame();
        }
      }
      else{
        if(!this.game.is_over){
          //console.log(this.num_pieces+" - "+this.game.placed_pieces.length)
          if(this.num_pieces == this.game.placed_pieces.length){
            this.game.is_over = true;
            this.solved = true;
          }
        }
      }
    
    }else{
      this.game.context.drawImage(this.img, (this.game.canvas.width/this.game.scale/2)-(this.img.width/2), (this.game.canvas.height/this.game.scale/2)-(this.img.height/2));
      window.m.pauseGame();
    }
  
  }

}
