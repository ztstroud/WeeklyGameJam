var menuState = {
  startDelay: 5,
    
  update: function() {
    if(this.startDelay > 0) {
      this.startDelay -= 1;
    } else {
      if(InputManager.getKey(13)) {
        levelState.startOver();
        StateManager.setState(levelState);
      }
    }
  },
  
  draw: function(ctx) {
    ctx.clearRect(0, 0, GraphicsManager.canvas.width, GraphicsManager.canvas.height);
      
    ctx.font = "70px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Torus", (GraphicsManager.canvas.width - ctx.measureText("Torus").width) / 2, 130);
    
    if(this.startDelay <= 0) {
      ctx.font = "35px Arial";
      ctx.fillText("Press Enter to Start", (GraphicsManager.canvas.width - ctx.measureText("Press Enter to Start").width) / 2, 450);
    }
  }
}