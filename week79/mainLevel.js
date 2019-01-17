var mainLevel = {
  objects: [
    {
      type: "player",
      layer: "midground",
      
      x: 0,
      y: 480
    },
    
    {
      type: "static",
      layer: "background",
      
      x: 100,
      y: -60,
      
      xCenter: 0,
      yCenter: 0,
      
      image: "./images/props/sun.png",
    },
    
    {
      type: "static",
      layer: "background",
      
      x: -300,
      y: 490,
      
      xCenter: 0,
      yCenter: 100,
      
      image: "./images/props/bush.png",
    },
    
    {
      type: "static",
      layer: "foreground",
      
      x: 300,
      y: 520,
      
      xCenter: 0,
      yCenter: 300,
      
      image: "./images/props/tree.png",
    },
    
    {
      type: "static",
      layer: "foreground",
      
      x: -400,
      y: 520,
      
      xCenter: 0,
      yCenter: 300,
      
      image: "./images/props/tree.png",
    }
  ]
}