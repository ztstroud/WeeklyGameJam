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

var InputManager = {
    keys: {},
    
    mouseX: 0,
    mouseY: 0,
    
    mousePresent: false,
    
    owner: undefined,
    
    bind: function(element) {
        InputManager.owner = element;
        
        document.body.addEventListener("keydown", InputManager.keyDown);
        document.body.addEventListener("keyup", InputManager.keyUp);
        
        element.addEventListener("mouseenter", InputManager.setMousePosition);
        element.addEventListener("mousemove", InputManager.setMousePosition);
        element.addEventListener("mouseleave", InputManager.mouseLeave);
    },
    
    keyDown: function(event) {
        InputManager.keys[event.keyCode] = true;
        event.preventDefault();
    },
    
    keyUp: function(event) {
        InputManager.keys[event.keyCode] = false;
        event.preventDefault();
    },
    
    getKey: function(keyCode) {
        return InputManager.keys.hasOwnProperty(keyCode) && InputManager.keys[keyCode];
    },
    
    setMousePosition: function(event) {
        let rect = InputManager.owner.getBoundingClientRect();
        
        InputManager.mouseX = event.clientX - rect.left;
        InputManager.mouseY = event.clientY - rect.top;
        
        InputManager.mousePresent = true;
    },
    
    mouseLeave: function(event) {
        InputManager.mousePresent = false;
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