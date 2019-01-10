var menuState = {
  update: function() {
    if(InputManager.mouseReleased) {
      levelState.loadLevel(levels[currentLevel]);
      StateManager.setState(levelState);
    }
  },
  
  draw: function(ctx) {
    GraphicsManager.clear();
    
    GraphicsManager.setFillColor("#FFFFFF");
    GraphicsManager.setFont("50px Arial");
    GraphicsManager.fillCenteredText("Cyto", 80);
    
    GraphicsManager.setFont("30px Arial");
    GraphicsManager.fillCenteredText("Click to Continue...", GraphicsManager.canvas.height - 50);
  }
}