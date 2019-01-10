var levelState = {
  levelData: undefined,
  
  update: function() {
    
  },
  
  draw: function(ctx) {
    GraphicsManager.clear();
      
    //if(this.levelData !== undefined)
      this.drawLevel(ctx);
  },
  
  drawLevel: function(ctx) {  
    var xOffset = GraphicsManager.canvas.width / 2 - 448;
    var yOffset = GraphicsManager.canvas.height / 2 - 256;
      
    for(var row = 0; row < 16; row++)
      for(var column = 0; column < 28; column++) {
        ctx.fillStyle = (row + column) % 2 === 0 ? "#FF0000" : "#00FF00";
        ctx.fillRect(xOffset + 32 * column, yOffset + 32 * row, 32, 32);
      }
  },
  
  loadLevel: function(levelData) {
    // 
  }
}