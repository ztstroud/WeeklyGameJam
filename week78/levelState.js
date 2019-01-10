var levelState = {
  levelData: undefined,
  events: undefined,
  slimeMap: undefined,
  text: undefined,
  win: false,
  energy: 0,
  
  update: function() {
    var xOffset = GraphicsManager.canvas.width / 2 - 448;
    var yOffset = GraphicsManager.canvas.height / 2 - 256;
    
    if(InputManager.mouseReleased) {
      if(this.win) {
        if(this.mouseOverContinue()) {
          currentLevel += 1;
          
          if(currentLevel < levels.length)
            this.loadLevel(levels[currentLevel]);
        }
      } else {
        let boardXOffset = InputManager.mouseX - xOffset;
        let boardYOffset = InputManager.mouseY - yOffset;
        
        if(boardXOffset >= 0 && boardXOffset < 896 && boardYOffset >= 0 && boardYOffset < 512)
          this.clickCell(Math.floor(boardXOffset / 32), Math.floor(boardYOffset / 32));
      }
    }
    
    if(InputManager.getKey(82)) {
      this.loadLevel(levels[currentLevel]);
    }
  },
  
  clickCell: function(column, row) {
    if(this.levelData[row][column] === "B" && this.energy >= 5 && this.slimeMap.nucleus.hasOwnProperty(this.slimeMap.tiles[row][column])) {
      this.levelData[row][column] = "N";
      this.energy -= 5;
      
      this.updateSlimeMap();
    } else if(this.levelData[row][column] === "N"){
      this.levelData[row][column] = "B";
      this.energy += 5;
      
      this.updateSlimeMap();
    } else if(this.levelData[row][column] !== "#" && this.levelData[row][column] !== "@" && this.levelData[row][column] !== "N" && this.levelData[row][column] !== "B" && this.energy > 0 && this.nextToSlime(column, row)) {
      if(this.levelData[row][column] === "G")
        this.win = true;
      if(this.levelData[row][column] === "E")
        this.energy += 6;
        
      this.levelData[row][column] = "B";
      
      if(this.events.hasOwnProperty(column + "x" + row)) {
          for(var index in this.events[column + "x" + row]) {
            var change = this.events[column + "x" + row][index];
            
            this.levelData[change.y][change.x] = change.tile;
          }
      }
      
      this.updateSlimeMap();
      this.energy -= 1;
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
          ctx.drawImage(ImageManager.images["images/wall.png"], xOffset + 32 * column, yOffset + 32 * row);
        else if(this.levelData[row][column] == "@")
          ctx.drawImage(ImageManager.images["images/door.png"], xOffset + 32 * column, yOffset + 32 * row);
        else if(this.levelData[row][column] == "N")
          ctx.drawImage(ImageManager.images["images/nucleus.png"], xOffset + 32 * column, yOffset + 32 * row);
        else if(this.levelData[row][column] == "B")
          ctx.drawImage(ImageManager.images["images/slime.png"], xOffset + 32 * column, yOffset + 32 * row);
        else if(this.levelData[row][column] == "O")
          ctx.drawImage(ImageManager.images["images/button.png"], xOffset + 32 * column, yOffset + 32 * row);
        else if(this.levelData[row][column] == "G")
          ctx.drawImage(ImageManager.images["images/goal.png"], xOffset + 32 * column, yOffset + 32 * row);
        else if(this.levelData[row][column] == "E")
          ctx.drawImage(ImageManager.images["images/energy.png"], xOffset + 32 * column, yOffset + 32 * row);
        else if(this.levelData[row][column] == ".")
          ctx.drawImage(ImageManager.images["images/dark_ground.png"], xOffset + 32 * column, yOffset + 32 * row);
        else
          ctx.drawImage(ImageManager.images["images/ground.png"], xOffset + 32 * column, yOffset + 32 * row);
      
        ctx.drawImage(ImageManager.images["images/grid.png"], xOffset + 32 * column, yOffset + 32 * row);
      }
    }
    
    let boardXOffset = InputManager.mouseX - xOffset;
    let boardYOffset = InputManager.mouseY - yOffset;
      
    if(boardXOffset >= 0 && boardXOffset < 896 && boardYOffset >= 0 && boardYOffset < 512)
      ctx.drawImage(ImageManager.images["images/select.png"], xOffset + 32 * Math.floor(boardXOffset / 32), yOffset + 32 * Math.floor(boardYOffset / 32));
  
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "30px Arial";
    ctx.fillText("Energy: " + this.energy, 13, 29);
  
    for(var index in this.text) {
      var text = this.text[index];
      
      ctx.fillStyle = text.color;
      ctx.font = text.font;
      
      if(text.x === "center") {
        GraphicsManager.fillCenteredText(text.text, text.y);
      } else {
      ctx.fillText(text.text, text.x, text.y);
      }
    }
    
    if(this.win) {
      ctx.fillStyle = "#666666";
      ctx.fillRect((GraphicsManager.canvas.width - 300) / 2, 100, 300, 300);
        
      GraphicsManager.setFont("50px Arial");
      GraphicsManager.setFillColor("#FFFFFF");
      GraphicsManager.fillCenteredText("Win!", 200);
      
      ctx.fillStyle = this.mouseOverContinue() ? "#888888" : "#444444";
      ctx.fillRect((GraphicsManager.canvas.width - 200) / 2, 250, 200, 100);
      
      GraphicsManager.setFont("40px Arial");
      GraphicsManager.setFillColor("#FFFFFF");
      GraphicsManager.fillCenteredText("Continue", 315);
    }
  },
  
  loadLevel: function(levelData) {
    this.win = false;
    
    this.levelData = [];
    this.events = {};
    
    this.energy = levelData.startingEnergy;
    
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
    
    this.text = levelData.text;
  },
  
  mouseOverContinue: function() {
    if(!InputManager.mousePresent)
      return false;
  
    return InputManager.mouseX >= (GraphicsManager.canvas.width - 200) / 2 && InputManager.mouseX <= (GraphicsManager.canvas.width + 200) / 2 && InputManager.mouseY >= 250 && InputManager.mouseY <= 350;
  }
}