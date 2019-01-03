var deathState = {
  continueDelay: 30,
  score: 0,
    
  update: function() {
    if(this.continueDelay > 0) {
      this.continueDelay -= 1;
    } else {
      if(InputManager.getKey(13)) {
        levelState.startOver();
        StateManager.setState(levelState);
      }
    }
  },
  
  startOver: function(score) {
      this.continueDelay = 30;
      this.score = score;
  },
  
  draw: function(ctx) {
    ctx.clearRect(0, 0, GraphicsManager.canvas.width, GraphicsManager.canvas.height);
      
    ctx.font = "70px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Game Over", (GraphicsManager.canvas.width - ctx.measureText("Game Over").width) / 2, 130);
    
    ctx.font = "50px Arial";
    ctx.fillText("You got " + this.score + " points", (GraphicsManager.canvas.width - ctx.measureText("You got " + this.score + " points").width) / 2, 230);
    
    if(this.continueDelay <= 0) {
      ctx.font = "35px Arial";
      ctx.fillText("Press Enter to Try Again", (GraphicsManager.canvas.width - ctx.measureText("Press Enter to Try Again").width) / 2, 450);
    }
  }
}