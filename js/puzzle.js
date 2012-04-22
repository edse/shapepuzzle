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
function Puzzle(id, game, pos, positions) {
  this.pos = pos;
  this.positions = positions;
  this.num_pieces = positions.length;
  this.items_to_load = this.num_pieces*2+1;
  this.loaded_items = 0;
  this.id = id;
  this.game = game;
  this.pieces = new Array();
  this.holders = new Array();
  this.position = null;
  this.loadAssets();
}

Puzzle.prototype.loadAssets = function() {
  console.log('puzzle start loading...');
  //IMAGE
  this.img = new Image();
  this.img.src = "img/"+this.id+"/"+this.id+".png";
  this.img.onload = this.loaded_items++;

  //PIECES & HOLDERS
  for(i=1; i<=this.num_pieces; i++){
    //HODLER IMAGE
    var h = new Image();
    h.src = "img/"+this.id+"/h0"+i+".png";
    h.onload = this.loaded_items++;
    var holder = this.placeHolder(i, h);

    //PIECE IMAGE
    var p = new Image();
    p.src = "img/"+this.id+"/p0"+i+".png";
    p.onload = this.loaded_items++;
    this.placePiece(i, p, holder);
  }

}

Puzzle.prototype.init = function(){
  console.log('initing puzzle...');
  clearTimeout(this.iniTimeout);
  this.loaded = true;
  this.solved = false;
}

Puzzle.prototype.placePiece = function(id, img, holder){
  x = Math.floor(Math.random()*this.game.canvas.width);
  y = Math.floor(Math.random()*this.game.canvas.height);
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
  console.log('puzzle pieces array length>>'+this.pieces.length);
}

Puzzle.prototype.placeHolder = function(id, img){
  var x = this.positions[id-1].x+this.pos.x;
  var y = this.positions[id-1].y+this.pos.y;
  temp = new Holder(
    id,
    this.game,
    img,
    new Point2D(x,y),
    false
  );
  this.holders.push(temp);
  console.log('puzzle holders array length>>'+this.holders.length+' '+temp.position.x+','+temp.position.y);
  return temp;
}

Puzzle.prototype.draw = function(){
  if(this.solved){
    this.game.context.drawImage(this.img, this.pos.x, this.pos.y);
  }
  else{
    //HOLDERS
    for(var i = 0; i < this.holders.length; i++){
      this.holders[i].draw();
      //this.pieces[i].draw();
    }
  
    //PIECES
    var not_placed = new Array();
    var over = false;
    for(var i = 0; i < this.pieces.length; i++){
      piece = this.pieces[i];
      if(!over && piece.mouse_is_over())
        over = true;
      if(!piece.placed)
        not_placed.push(piece);
      else if(piece != this.game.selected)
        piece.draw();
        
      if(over && !this.game.selected){
        if((!this.game.over)||(this.game.over.id < piece.id)||(piece.mouse_is_over())){
          if(piece.mouse_is_over() && !piece.placed){
            this.game.over = piece;
          }
        }
      }
      
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
    if(this.game.remaining_time <= 0){
      window.m.stopGame();
      if(confirm('Timeup! Game Over! Wanna try again?')){
        this.game.is_over = false;
        this.game.init();
        window.m.startGame();
      }
    }
    else{
      if(this.game.is_over){
        window.m.stopGame();
        if(confirm('Huhuhuh! You did it! Wanna try the next level?')){
          this.game.is_over = false;
          this.game.scale_input.value++;
          this.game.init();
          window.m.startGame();
        }
      }else{
        if(this.num_pieces == this.game.placed_pieces.length){
          this.game.is_over = true;
          this.solved = true;
        }
      }
    }
  }

}
