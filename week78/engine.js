var ImageManager = {
  images: {},
  registeredImages: [],
  
  loadedCount: 0,
  totalCount: 0,
  
  allMediaLoaded: undefined,
  
  registerImages: function(imagePaths) {
    ImageManager.registeredImages.push(...imagePaths);
    ImageManager.totalCount += imagePaths.length;
  },
  
  loadImages: function() {
    if(ImageManager.registeredImages.length === 0 && ImageManager.allMediaLoaded !== undefined) {
      ImageManager.allMediaLoaded();
    }
      
    while(ImageManager.registeredImages.length > 0) {
      let imagePath = ImageManager.registeredImages.shift();
      
      var image = new Image();
      image.onload = ImageManager.imageLoaded;
      
      image.src = imagePath;
      
      ImageManager.images[imagePath] = image;
    }
  },
  
  imageLoaded: function() {
    ImageManager.loadedCount += 1;
    
    if(ImageManager.loadedCount === ImageManager.totalCount && ImageManager.allMediaLoaded !== undefined) {
      ImageManager.allMediaLoaded();
    }
  }
}

var InputManager = {
    keys: {},
    
    mouseX: 0,
    mouseY: 0,
    
    isMouseDown: false,
    isMouseDownPrevious: false,
    mousePressed: false,
    mouseReleased: false,
    
    mousePresent: false,
    
    owner: undefined,
    
    bind: function(element) {
      InputManager.owner = element;
        
      document.body.addEventListener("keydown", InputManager.keyDown);
      document.body.addEventListener("keyup", InputManager.keyUp);
        
      element.addEventListener("mouseenter", InputManager.setMousePosition);
      element.addEventListener("mousemove", InputManager.setMousePosition);
      element.addEventListener("mouseleave", InputManager.mouseLeave);
      
      element.addEventListener("mousedown", InputManager.mouseDown);
      element.addEventListener("mouseup", InputManager.mouseUp);
    },
    
    tick: function() {
      InputManager.mousePressed = InputManager.isMouseDown && !InputManager.isMouseDownPrevious;
      InputManager.mouseReleased = !InputManager.isMouseDown && InputManager.isMouseDownPrevious;
      
      InputManager.isMouseDownPrevious = InputManager.isMouseDown;
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
    },
    
    mouseDown: function(event) {
      if(event.button === 0) {
        InputManager.isMouseDown = true;
      }
    },
    
    mouseUp: function(event) {
      if(event.button === 0) {
        InputManager.isMouseDown = false;
      }
    }
}

var GraphicsManager = {
  canvas: undefined,
  ctx: undefined,
    
  setCanvas: function(canvas) {
    GraphicsManager.canvas = canvas;
    GraphicsManager.ctx = canvas.getContext("2d");
  },
  
  clear: function() {
    if(GraphicsManager.ctx === undefined)
      return;
  
    GraphicsManager.ctx.clearRect(0, 0, GraphicsManager.canvas.width, GraphicsManager.canvas.height);
  },
  
  fillCenteredText: function(text, y) {
    if(GraphicsManager.ctx === undefined)
      return;
  
    GraphicsManager.ctx.fillText(text, (GraphicsManager.canvas.width - GraphicsManager.ctx.measureText(text).width) / 2, y);
  },
  
  setFillColor: function(color) {
    if(GraphicsManager.ctx === undefined)
      return;
  
    GraphicsManager.ctx.fillStyle = color;
  },
  
  setFont: function(font) {
    if(GraphicsManager.ctx === undefined)
        return;
    
    GraphicsManager.ctx.font = font;
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
    InputManager.tick();
    StateManager.tick();
    
    requestAnimationFrame(Engine.gameLoop);
  },
  
  start: function() {
    requestAnimationFrame(Engine.gameLoop);
  }
}