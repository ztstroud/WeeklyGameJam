var MediaManager = {
  images: {},
  registeredImages: [],
  
  loadedCount: 0,
  totalCount: 0,
  
  singleMediaLoaded: undefined,
  allMediaLoaded: undefined,
  
  registerImages: function(imagePaths) {
    MediaManager.registeredImages.push(...imagePaths);
    MediaManager.totalCount += imagePaths.length;
  },
  
  loadRegisteredMedia: function() {
    if(MediaManager.registeredImages.length === 0 && MediaManager.allMediaLoaded !== undefined) {
      MediaManager.allMediaLoaded();
    }
      
    while(MediaManager.registeredImages.length > 0) {
      let imagePath = MediaManager.registeredImages.shift();
      
      var image = new Image();
      image.onload = MediaManager.imageLoaded;
      
      image.src = imagePath;
      
      MediaManager.images[imagePath] = image;
    }
  },
  
  imageLoaded: function() {
    MediaManager.loadedCount += 1;
    
    if(MediaManager.singleMediaLoaded !== undefined)
      MediaManager.singleMediaLoaded();
    
    if(MediaManager.loadedCount === MediaManager.totalCount && MediaManager.allMediaLoaded !== undefined) {
      MediaManager.allMediaLoaded();
    }
  }
}

var InputManager = {
  keys: new Set(),
  previousKeys: new Set(),
  
  mouseX: 0,
  mouseY: 0,
  
  mousePresent: false,
  
  mouseButtons: new Set(),
  previousMouseButtons: new Set(),
  
  owner: undefined,
  
  bind: function(element) {
    InputManager.owner = element;
      
    document.body.addEventListener("keydown", InputManager.onKeyDown);
    document.body.addEventListener("keyup", InputManager.onKeyUp);
      
    element.addEventListener("mouseenter", InputManager.setMousePosition);
    element.addEventListener("mousemove", InputManager.setMousePosition);
    element.addEventListener("mouseleave", InputManager.onMouseLeave);
    
    element.addEventListener("mousedown", InputManager.onMouseDown);
    element.addEventListener("mouseup", InputManager.onMouseUp);
  },
  
  tick: function() {
    InputManager.previousKeys = new Set(InputManager.keys);
    InputManager.previousMouseButtons = new Set(InputManager.mouseButtons);
  },
  
  onKeyDown: function(event) {
    InputManager.keys.add(event.keyCode);
    event.preventDefault();
  },
  
  onKeyUp: function(event) {
    InputManager.keys.delete(event.keyCode);
    event.preventDefault();
  },
  
  /**
   * Returns true if the specified button is currently pressed.
   */
  keyDown: function(keyCode) {
    return InputManager.keys.has(keyCode);
  },
  
  /**
   * Returns true if the specified button was pressed this frame.
   */
  keyPressed: function(keyCode) {
    return InputManager.keys.has(keyCode) && !InputManager.previousKeys.has(keyCode);
  },
  
  /**
   * Returns true if the specified button was released this frame.
   */
  keyReleased: function(keyCode) {
    return InputManager.previousKeys.has(keyCode) && !InputManager.keys.has(keyCode);
  },
  
  setMousePosition: function(event) {
    let rect = InputManager.owner.getBoundingClientRect();
    
    InputManager.mouseX = event.clientX - rect.left;
    InputManager.mouseY = event.clientY - rect.top;
    
    InputManager.mousePresent = true;
  },
  
  onMouseLeave: function(event) {
    InputManager.mousePresent = false;
  },
  
  onMouseDown: function(event) {
    InputManager.mouseButtons.add(event.button);
  },
  
  onMouseUp: function(event) {
    InputManager.mouseButtons.delete(event.button);
  },
  
  /**
   * Returns true if the specified mouse button is currently pressed.
   */
  mouseButtonDown: function(button) {
    return InputManager.mouseButtons.has(button);
  },
  
  /**
   * Returns true if the specified mouse button was pressed this frame.
   */
  mouseButtonPressed: function(button) {
    return InputManager.mouseButtons.has(button) && !InputManager.previousMouseButtons.has(button);
  },
  
  /**
   * Returns true if the specified mouse button was released this frame.
   */
  mouseButtonReleased: function(button) {
    return InputManager.previousMouseButtons.has(button) && !InputManager.mouseButtons.has(button);
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
    StateManager.tick();
    InputManager.tick();
    
    requestAnimationFrame(Engine.gameLoop);
  },
  
  start: function() {
    requestAnimationFrame(Engine.gameLoop);
  }
}