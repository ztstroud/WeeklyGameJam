var levelState = {
  levelData: undefined,
  events: undefined,
  slimeMap: undefined,
  
  update: function() {
    var xOffset = GraphicsManager.canvas.width / 2 - 448;
    var yOffset = GraphicsManager.canvas.height / 2 - 256;
    
    if(InputManager.mouseReleased) {
      let boardXOffset = InputManager.mouseX - xOffset;
      let boardYOffset = InputManager.mouseY - yOffset;
      
      if(boardXOffset >= 0 && boardXOffset < 896 && boardYOffset >= 0 && boardYOffset < 512)
        this.clickCell(Math.floor(boardXOffset / 32), Math.floor(boardYOffset / 32));
    }
  },
  
  clickCell: function(column, row) {
    if(this.levelData[row][column] !== "#" && this.levelData[row][column] !== "N" && this.levelData[row][column] !== "B" && this.nextToSlime(column, row)) {
      this.levelData[row][column] = "B";
      
      if(this.events.hasOwnProperty(column + "x" + row)) {
          for(var index in this.events[column + "x" + row]) {
            var change = this.events[column + "x" + row][index];
            
            this.levelData[change.y][change.x] = change.tile;
          }
      }
      
      this.updateSlimeMap();
    }
  },
  
  updateSlimeMap: function() {
    this.slimeMap = {
      tiles: [],
      nucleus: {}
    };
    
    for(var row = 0; row < 16; row++) {
      this.slimeMap.tiles[row] = [];
        
      for(var column = 0; column < 28; column++)
        this.slimeMap.tiles[row][column] = -1;
    }
    
    var groupID = 0;
    
    for(var row = 0; row < 16; row++)
      for(var column = 0; column < 28; column++)
        if((this.levelData[row][column] === "N" || this.levelData[row][column] === "B") && this.slimeMap.tiles[row][column] === -1)
          this.exploreSlimeMap(column, row, groupID++);
    
    for(var row = 0; row < 16; row++)
      for(var column = 0; column < 28; column++)
        if(this.levelData[row][column] === "N")
          this.slimeMap.nucleus[this.slimeMap.tiles[row][column]] = true;
  },
  
  exploreSlimeMap: function(column, row, groupID) {
    if(row < 0 || row >= 16 || column < 0 || column >= 28 || (this.levelData[row][column] !== "N" && this.levelData[row][column] !== "B") || this.slimeMap.tiles[row][column] >= 0)
      return;
  
    this.slimeMap.tiles[row][column] = groupID;
    
    this.exploreSlimeMap(column - 1, row, groupID);
    this.exploreSlimeMap(column + 1, row, groupID);
    this.exploreSlimeMap(column, row - 1, groupID);
    this.exploreSlimeMap(column, row + 1, groupID);
  },
  
  nextToSlime: function(column, row) {
    if(this.levelData === undefined)
      return false;
  
    if(column > 0 && (this.levelData[row][column - 1] === "N" || this.levelData[row][column - 1] === "B") && this.slimeMap.nucleus.hasOwnProperty(this.slimeMap.tiles[row][column - 1]))
      return true;
  
    if(column < 27 && (this.levelData[row][column + 1] === "N" || this.levelData[row][column + 1] === "B") && this.slimeMap.nucleus.hasOwnProperty(this.slimeMap.tiles[row][column + 1]))
      return true;
  
    if(row > 0 && (this.levelData[row - 1][column] === "N" || this.levelData[row - 1][column] === "B") && this.slimeMap.nucleus.hasOwnProperty(this.slimeMap.tiles[row - 1][column]))
      return true;
  
    if(row < 27 && (this.levelData[row + 1][column] === "N" || this.levelData[row + 1][column] === "B") && this.slimeMap.nucleus.hasOwnProperty(this.slimeMap.tiles[row + 1][column]))
      return true;
  
    return false;
  },
  
  draw: function(ctx) {
    GraphicsManager.clear();
      
    if(this.levelData !== undefined)
      this.drawLevel(ctx);
  },
  
  drawLevel: function(ctx) {  
    var xOffset = GraphicsManager.canvas.width / 2 - 448;
    var yOffset = GraphicsManager.canvas.height / 2 - 256;
      
    for(var row = 0; row < 16; row++) {
      for(var column = 0; column < 28; column++) {
        if(this.levelData[row][column] == "#")
          ctx.fillStyle = "#FF0000";
        else if(this.levelData[row][column] == "N")
          ctx.fillStyle = "#008800";
        else if(this.levelData[row][column] == "B")
          ctx.fillStyle = "#00FF00";
        else if(this.levelData[row][column] == "O")
          ctx.fillStyle = "#444444";
        else
          ctx.fillStyle = "#888888";
        
        ctx.fillRect(xOffset + 32 * column, yOffset + 32 * row, 32, 32);
      }
    }
  },
  
  loadLevel: function(levelData) {
    this.levelData = [];
    this.events = {};
    
    for(var row = 0; row < 16; row++) {
      this.levelData[row] = [];
        
      for(var column = 0; column < 28; column++) {
        this.levelData[row][column] = levelData.layout[row].charAt(column);
      }
    }
    
    this.updateSlimeMap();
    
    for(var index in levelData.events) {
      var event = levelData.events[index];
      
      this.events[event.x + "x" + event.y] = event.changes;
    }
    
    console.log(this.events);
  }
}