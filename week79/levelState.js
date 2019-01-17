class WorldObject {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    
    this.bobTimer = 0;
    this.bobIncrement = Math.random() * 0.3;
    this.bobSize = 10;
  }
  
  update() {
    this.bobTimer += this.bobIncrement;
  }
  
  draw(ctx) {
    
  }
  
  getX() {
    return this.x + Math.sin(this.bobTimer / 4) * this.bobSize / 4;
  }
  
  getY() {
    return this.y + Math.sin(this.bobTimer / 3) * this.bobSize;
  }
}

class StaticObject extends WorldObject {
  constructor(x, y, image, xCenter, yCenter) {
    super(x, y);
    
    this.image = image;
    this.xCenter = xCenter;
    this.yCenter = yCenter;
    
    this.bobSize = 3;
  }
  
  update() {
    this.bobTimer += this.bobIncrement;
  }
  
  draw(ctx) {
    ctx.drawImage(MediaManager.images[this.image], this.getX() - this.xCenter, this.getY() - this.yCenter);
  }
}

class Sock extends WorldObject {
  constructor(x, y) {
    super(x, y);
    
    this.frames = 0;
    this.bobIncrement = 0;
  }
  
  update() {
    if(InputManager.keyDown(37) || InputManager.keyDown(39)) {
      if(InputManager.keyDown(37))
        this.x -= 3;
      
      if(InputManager.keyDown(39))
        this.x += 3;
      
      this.bobTimer += 1;
    } else {
      this.bobTimer += 0.1;
    }
  }
  
  draw(ctx) {
    ctx.drawImage(MediaManager.images["./images/sock/player_closed.png"], this.getX() - 196 / 2, this.getY() - 160);
  }
}

var levelState = {
  player: null,
  cameraX: 0,
  
  background: [],
  midground: [],
  foreground: [],
  
  load: function(levelData) {
    this.background = [];
    this.midground = [];
    this.foreground = [];
    
    for(objectKey in levelData.objects) {
      let objectData = levelData.objects[objectKey];
      let object = undefined;
      
      if(objectData.type === "player") {
        object = new Sock(objectData.x, objectData.y);
        this.player = object;
      } else if(objectData.type === "static") {
        object = new StaticObject(objectData.x, objectData.y, objectData.image, objectData.xCenter, objectData.yCenter);
      }
      
      if(objectData.layer === "background") {
        this.background.push(object);
      } else if(objectData.layer === "midground") {
        this.midground.push(object);
      } else if(objectData.layer === "foreground") {
        this.foreground.push(object);
      }
    }
  },
  
  update: function() {
    for(key in this.background)
      this.background[key].update();
    
    for(key in this.midground)
      this.midground[key].update();
    
    for(key in this.foreground)
      this.foreground[key].update();
    
    if(GraphicsManager.canvas.width / 2 - this.cameraX + this.player.x > 3 * GraphicsManager.canvas.width / 4)
      this.cameraX += 3;
    
    if(GraphicsManager.canvas.width / 2 - this.cameraX + this.player.x < GraphicsManager.canvas.width / 4)
      this.cameraX -= 3;
  },
  
  draw: function(ctx) {
    ctx.fillStyle = "#A7ECFF";
    ctx.fillRect(0, 0, GraphicsManager.canvas.width, GraphicsManager.canvas.height);
    
    ctx.translate(GraphicsManager.canvas.width / 2 - this.cameraX, 0);
    
    for(key in this.background)
      this.background[key].draw(ctx);
    
    for(key in this.midground)
      this.midground[key].draw(ctx);
    
    for(key in this.foreground)
      this.foreground[key].draw(ctx);
    
    ctx.translate(-(GraphicsManager.canvas.width / 2 - this.cameraX), 0);
    
    ctx.drawImage(MediaManager.images["./images/ground.png"], 0, GraphicsManager.canvas.height - 60);
    ctx.drawImage(MediaManager.images["./images/curtains.png"], 0, 0);
  }
}