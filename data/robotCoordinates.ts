export const arrPositionModel = [

    // Hero Section / initial position
    {
      id: "hero",
      zIndex: 1,
      robotPosition: {
        x: 7,
        y: 0,
        z: -30
      },
      cameraPosition: {
          x: 1,
          y: 3,
          z: 13
      },
      robotRotation: {
          x: 0,
          y: -2.5,
          z: 0
      }, 
      robotScale : {
          x: 5,
          y: 5,
          z: 5
      },
      cameraFOV: 20,
      cameraLookAt: {
          x: 0,
          y: 0,
          z: 0
      },
      animationName: null // think_walk
    },
  
    // about section (left side)
    {
      id: "about",
      zIndex: 1,
      robotPosition: {
        x: -7,
        y: 0,
        z: -30
      },
      cameraPosition: {
          x: 1,
          y: 3,
          z: 13
      },
      robotRotation: {
          x: 0,
          y: 0,
          z: 0
      }, 
      robotScale : {
          x: 3,
          y: 3,
          z: 3
      },
      cameraFOV: 20,
      cameraLookAt: {
          x: 0,
          y: 0,
          z: 0
      },
      animationName: 1 // built in. "stand_chat"
    },
  
    // numbers section (left side)
    {
      id: "numbers",
      zIndex: 1,
      robotPosition: {
        x: -7,
        y: 0,
        z: -30
      },
      cameraPosition: {
          x: 1,
          y: 3,
          z: 13
      },
      robotRotation: {
          x: 0,
          y: 0,
          z: 0
      }, 
      robotScale : {
          x: 3,
          y: 3,
          z: 3
      },
      cameraFOV: 20,
      cameraLookAt: {
          x: 0,
          y: 0,
          z: 0
      },
      animationName: 1 // built in. "stand_chat"
    },
  
    // steps section (left side)
    {
      id: "steps",
      zIndex: 5,
      robotPosition: {
        x: -7,
        y: 0,
        z: -30
      },
      cameraPosition: {
          x: 1,
          y: 3,
          z: 13
      },
      robotRotation: {
          x: 0,
          y: 0,
          z: 0
      }, 
      robotScale : {
          x: 3,
          y: 3,
          z: 3
      },
      cameraFOV: 20,
      cameraLookAt: {
          x: 0,
          y: 0,
          z: 0
      },
      animationName: 1 // built in. "stand_chat"
    },
  
    // testimonials section (right side)
    {
      id: "testimonials",
      zIndex: 100,
      robotPosition: {
        x: 7,
        y: 0,
        z: -30
      },
      cameraPosition: {
          x: 1,
          y: 3,
          z: 13
      },
      robotRotation: {
          x: 0,
          y: -2.2,
          z: 0
      }, 
      robotScale : {
          x: 3,
          y: 3,
          z: 3
      },
      cameraFOV: 20,
      cameraLookAt: {
          x: 0,
          y: 0,
          z: 0
      },
      animationName: 2 // "agree"
    },
  
    // contact us section (left side)
    {
      id: "contact",
      zIndex: 1,
      robotPosition: {
        x: -5,
        y: 0,
        z: -30
      },
      cameraPosition: {
          x: 1,
          y: 3,
          z: 13
      },
      robotRotation: {
          x: 0,
          y: -1,
          z: 0
      }, 
      robotScale : {
          x: 3,
          y: 3,
          z: 3
      },
      cameraFOV: 20,
      cameraLookAt: {
          x: 0,
          y: 0,
          z: 0
      },
      animationName: 3 // "hello"
    },
  
  
  ]
  