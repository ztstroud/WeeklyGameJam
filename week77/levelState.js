var levelState = {
  ringFrames: ["./images/ring/0001.png", "./images/ring/0002.png", "./images/ring/0003.png", "./images/ring/0004.png", "./images/ring/0005.png", "./images/ring/0006.png", "./images/ring/0007.png", "./images/ring/0008.png", "./images/ring/0009.png", "./images/ring/0010.png", "./images/ring/0011.png", "./images/ring/0012.png", "./images/ring/0013.png", "./images/ring/0014.png", "./images/ring/0015.png", "./images/ring/0016.png", "./images/ring/0017.png", "./images/ring/0018.png", "./images/ring/0019.png", "./images/ring/0020.png", "./images/ring/0021.png", "./images/ring/0022.png", "./images/ring/0023.png", "./images/ring/0024.png", "./images/ring/0025.png", "./images/ring/0026.png", "./images/ring/0027.png", "./images/ring/0028.png", "./images/ring/0029.png", "./images/ring/0030.png"],
   
  ringIndex: 0,
    
  update: function() {
    this.ringIndex = (this.ringIndex + 1) % this.ringFrames.length;
  },
  
  draw: function(ctx) {
    ctx.clearRect(0, 0, GraphicsManager.canvas.width, GraphicsManager.canvas.height);
    ctx.drawImage(ImageManager.images[this.ringFrames[this.ringIndex]], 235, 35);
    
    ctx.fillStyle = "#FF0000";
    this.drawCircle(ctx, GraphicsManager.canvas.width / 2, GraphicsManager.canvas.height / 2, 70);
  },
  
  drawCircle: function(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
  }
}