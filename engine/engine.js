var ImageManager = {
  images: {},
  unloadedImages: [],
  
  unloadedCount: 0,
  allMediaLoaded: undefined,
  
  registerImages: function(imagePaths) {
    ImageManager.unloadedImages.push(...imagePaths);
    ImageManager.unloadedCount += imagePaths.length;
  },
  
  loadImages: function() {
    while(ImageManager.unloadedImages.length > 0) {
      let imagePath = ImageManager.unloadedImages.shift();
      
      var image = new Image();
      image.onload = ImageManager.imageLoaded;
      
      image.src = imagePath;
      
      ImageManager.images[imagePath] = image;
    }
  },
  
  imageLoaded: function() {
    ImageManager.unloadedCount -= 1;
    
    if(ImageManager.unloadedCount === 0 && ImageManager.allMediaLoaded !== undefined) {
      ImageManager.allMediaLoaded();
    }
  }
}

var GraphicsManager = {
  canvas: undefined,
  ctx: undefined,
    
  setCanvas: function(canvas) {
    GraphicsManager.canvas = canvas;
    GraphicsManager.ctx = canvas.getContext("2d");
  }
}

var StateManager = {
  states: [],
  
  popState: function() {
    if(StateManager.states.length > 0)
      StateManager.states.pop();
  },
  
  pushState: function(state) {
    StateManager.states.push(state);
  },
  
  setState: function(state) {
    StateManager.popState();
    StateManager.pushState(state);
  },
  
  tick: function() {
    if(StateManager.states.length === 0)
      return;
      
    let state = StateManager.states[StateManager.states.length - 1];
    
    state.update();
    state.draw(GraphicsManager.ctx);
  }
}

var Engine = {
  gameLoop: function() {
    StateManager.tick();
    
    requestAnimationFrame(Engine.gameLoop);
  },
  
  start: function() {
    requestAnimationFrame(Engine.gameLoop);
  }
}