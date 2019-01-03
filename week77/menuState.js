var menuState = {
  startDelay: 30,
    
  update: function() {
    if(this.startDelay > 0) {
      this.startDelay -= 1;
    } else {
      if(InputManager.getKey(13))
        StateManager.setState(levelState);
    }
  },
  
  draw: function(ctx) {
    ctx.font = "70px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Torus", (GraphicsManager.canvas.width - ctx.measureText("Torus").width) / 2, 130);
    
    if(this.startDelay <= 0) {
      ctx.font = "35px Arial";
      ctx.fillText("Press Enter to Start", (GraphicsManager.canvas.width - ctx.measureText("Press Enter to Start").width) / 2, 450);
    }
  }
}