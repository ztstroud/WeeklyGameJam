var levelState = {
  ringFrames: ["./images/ring/0001.png", "./images/ring/0002.png", "./images/ring/0003.png", "./images/ring/0004.png", "./images/ring/0005.png", "./images/ring/0006.png", "./images/ring/0007.png", "./images/ring/0008.png", "./images/ring/0009.png", "./images/ring/0010.png", "./images/ring/0011.png", "./images/ring/0012.png", "./images/ring/0013.png", "./images/ring/0014.png", "./images/ring/0015.png", "./images/ring/0016.png", "./images/ring/0017.png", "./images/ring/0018.png", "./images/ring/0019.png", "./images/ring/0020.png", "./images/ring/0021.png", "./images/ring/0022.png", "./images/ring/0023.png", "./images/ring/0024.png", "./images/ring/0025.png", "./images/ring/0026.png", "./images/ring/0027.png", "./images/ring/0028.png", "./images/ring/0029.png", "./images/ring/0030.png"],
   
  ringIndex: 0,
  
  x: 350,
  y: 200,
  z: 0,
    
  update: function() {
    this.ringIndex = (this.ringIndex + 1) % this.ringFrames.length;
    
    if(InputManager.getKey(37)) {
        this.x -= 3;
    }
    
    if(InputManager.getKey(39)) {
        this.x += 3;
    }
    
    if(InputManager.getKey(38)) {
        this.y -= 3;
    }
    
    if(InputManager.getKey(40)) {
        this.y += 3;
    }
    
    let dx = this.x - GraphicsManager.canvas.width / 2;
    let dy = this.y - GraphicsManager.canvas.height / 2;
    
    let distance = Math.sqrt(dx * dx + dy * dy);
    
    if(distance <= 225 && distance >= 70) {
        let vx = dx / distance;
        let vy = dy / distance;
        
        this.x += vx * 0.55;
        this.y += vy * 0.55;
        
        
        let offset = Math.abs((distance - 70) - 77.5) / 77.5;
        
        offset *= offset;
        offset = 1.0 - offset;
        
        this.z = 100 + offset * 77.5;
    } else if(this.z > 0) {
        this.z -= 1;
        
        if(this.z < 0)
            this.z = 0;
    }
  },
  
  draw: function(ctx) {
    ctx.clearRect(0, 0, GraphicsManager.canvas.width, GraphicsManager.canvas.height);
    ctx.drawImage(ImageManager.images[this.ringFrames[this.ringIndex]], 235, 35);
    
    let scale = (this.z / 255.0);
    
    this.drawCircle(ctx, this.x, this.y, 40 * scale, "#00FF00");
  },
  
  drawCircle: function(ctx, x, y, r, color) {
    ctx.fillStyle = color;
    
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
  }
}