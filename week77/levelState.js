var levelState = {
  ringFrames: ["./images/ring/0001.png", "./images/ring/0002.png", "./images/ring/0003.png", "./images/ring/0004.png", "./images/ring/0005.png", "./images/ring/0006.png", "./images/ring/0007.png", "./images/ring/0008.png", "./images/ring/0009.png", "./images/ring/0010.png", "./images/ring/0011.png", "./images/ring/0012.png", "./images/ring/0013.png", "./images/ring/0014.png", "./images/ring/0015.png", "./images/ring/0016.png", "./images/ring/0017.png", "./images/ring/0018.png", "./images/ring/0019.png", "./images/ring/0020.png", "./images/ring/0021.png", "./images/ring/0022.png", "./images/ring/0023.png", "./images/ring/0024.png", "./images/ring/0025.png", "./images/ring/0026.png", "./images/ring/0027.png", "./images/ring/0028.png", "./images/ring/0029.png", "./images/ring/0030.png"],
   
  ringIndex: 0,
  
  entities: [{x: 350, y:200, z: 100, radius: 50, type:"player", color:"#00FF00", remove: false, dead: false}],
  
  blockSpawnTimer: 100,
  blockSpawnTime: 100,
  
  coinSpawnTimer: 80,
  coinSpawnTime: 80,
  
  score: 0,
  torusRate: 1,
    
  update: function() {
    this.ringIndex = (this.ringIndex + this.torusRate) % this.ringFrames.length;
    
    if(this.blockSpawnTimer > 0) {
      this.blockSpawnTimer -= 1;
    } else {
      this.blockSpawnTimer = this.blockSpawnTime;
      
      if(this.blockSpawnTime > 20)
        this.blockSpawnTime -= 2;
      
      let angle = Math.random() * 2 * Math.PI;
      let entity = {
        x: GraphicsManager.canvas.width / 2 + Math.cos(angle) * 71,
        y: GraphicsManager.canvas.height / 2 + Math.sin(angle) * 71,
        z: 0,
        
        type: "block",
        color: "#FF0000",
        
        radius: 20 + 20 * Math.random()
      };
      
      this.entities.push(entity)
    }
    
    if(this.coinSpawnTimer > 0) {
      this.coinSpawnTimer -= 1;
    } else {
      this.coinSpawnTimer = this.coinSpawnTime;
      
      if(this.coinSpawnTime > 40)
          this.coinSpawnTime -= 1;
      
      let angle = Math.random() * 2 * Math.PI;
      let entity = {
        x: GraphicsManager.canvas.width / 2 + Math.cos(angle) * 71,
        y: GraphicsManager.canvas.height / 2 + Math.sin(angle) * 71,
        z: 0,
        
        type: "coin",
        color: "#FFFF00",
        
        radius: 20 + 20 * Math.random()
      };
      
      this.entities.push(entity)
    }
    
    if(this.entities.length > 0 && this.entities[0].type === "player") {
      if(!this.entities[0].dead) {
        let player = this.entities[0];
        
        if(InputManager.getKey(37)) {
          player.x -= 3;
        }
        
        if(InputManager.getKey(39)) {
          player.x += 3;
        }
        
        if(InputManager.getKey(38)) {
          player.y -= 3;
        }
        
        if(InputManager.getKey(40)) {
          player.y += 3;
        }
        
        
        let playerRadius = player.radius * (player.z / 255.0)
        for(let index = 1; index < this.entities.length; index++) {
          let entity = this.entities[index];
          let entityRadius = entity.radius * (entity.z / 255.);
          
          let dx = player.x - entity.x;
          let dy = player.y - entity.y;
          
          let dist = Math.sqrt(dx * dx + dy * dy);
          if(dist < playerRadius + entityRadius) {
            if(entity.type === "coin") {
              this.score += 1;
              
              entity.remove = true;
            } else if(entity.type === "block") {
              player.dead = true;
              this.torusRate = 3;
            }
          }
        }
      }
    } else {
      deathState.startOver(this.score);
      StateManager.setState(deathState);
    }
    
    for(var index in this.entities) {
      let entity = this.entities[index];
      
      let dx = entity.x - GraphicsManager.canvas.width / 2;
      let dy = entity.y - GraphicsManager.canvas.height / 2;
      
      let distance = Math.sqrt(dx * dx + dy * dy);
      
      if(distance <= 225 && distance >= 70) {  
        let vx = dx / distance;
        let vy = dy / distance;
        
        entity.x += vx * 0.55 * this.torusRate;
        entity.y += vy * 0.55 * this.torusRate;
        
        
        let offset = Math.abs((distance - 70) - 77.5) / 77.5;
        
        offset *= offset;
        offset = 1.0 - offset;
        
        entity.z = 50 + offset * 77.5;
      } else if(entity.z > 0) {
        if(entity.type === "player")
          entity.dead = true;
         
        entity.z -= this.torusRate;
        
        if(entity.z < 0)
          entity.z = 0;
      } else {
        entity.remove = true;
      }
    }
    
    let removeIndex = 0;
    while(removeIndex < this.entities.length) {
      if(this.entities[removeIndex].remove) {
        this.entities.splice(removeIndex, 1);
      } else {
        removeIndex += 1;
      }
    }
  },
  
  startOver: function() {
    this.entities = [{x: 350, y:200, z: 100, radius: 50, type:"player", color:"#00FF00", remove: false, dead: false}];
  
    this.blockSpawnTimer = 100;
    this.blockSpawnTime = 100;
    
    this.coinSpawnTimer = 80;
    this.coinSpawnTime = 80;
    
    this.score = 0;
    this.torusRate = 1;
  },
  
  draw: function(ctx) {
    ctx.clearRect(0, 0, GraphicsManager.canvas.width, GraphicsManager.canvas.height);
    ctx.drawImage(ImageManager.images[this.ringFrames[this.ringIndex]], 235, 35);
    
    for(var index in this.entities) {
      let scale = (this.entities[index].z / 255.0);
    
      this.drawCircle(ctx, this.entities[index].x, this.entities[index].y, this.entities[index].radius * scale, this.entities[index].color);
    }
    
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "30px Arial";
    ctx.fillText("Score: " + this.score, 10, 35);
  },
  
  drawCircle: function(ctx, x, y, r, color) {
    ctx.fillStyle = color;
    
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
  }
}