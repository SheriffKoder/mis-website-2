/*

The key change is replacing the fixed time step mixerRef.current.update(0.005) with a time-based approach using clock.getDelta(). This ensures that animations run at the same speed regardless of frame rate or environment differences between development and production.
This approach makes the animation speed consistent by:
Using a clock to measure actual elapsed time between frames
Updating the animation mixer based on real time rather than a fixed value
Ensuring animations run at the same speed regardless of how frequently frames are rendered

*/

"use client"
import React, { useEffect, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// z = 0 // display text
import { myAnim } from '../../../data/robot_animations'
import { arrPositionModel } from '../../../data/robotCoordinates'
import gsap from 'gsap'
// import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// use the default animation stand_chat.
// the const will contain animations of think_walk, agree, hello.

// Register ScrollTrigger plugin outside the component
gsap.registerPlugin(ScrollTrigger);

const RobotNew = () => {

    const [isMobile, setIsMobile] = useState(false);

    ////////////////////////////////////////////////////////////
    // GSAP SETUP
    ////////////////////////////////////////////////////////////
    
    // References for animation targets
    const robotRef = React.useRef<THREE.Group | null>(null);
    const cameraRef = React.useRef<THREE.PerspectiveCamera | null>(null);

    ////////////////////////////////////////////////////////////
    // STATE AND REFS
    ////////////////////////////////////////////////////////////
    
    // Names for our custom animations - these are just for display purposes
    // const animationNames = ['think_walk', 'agree', 'hello']

    // Track the current animation index
    // 0 = built-in animation from GLB file
    // 1+ = custom animations from myAnim array (index 0+)
    const [currentAnimIndex, setCurrentAnimIndex] = useState(0);
    
    // Store references that need to persist between renders
    const mixerRef = React.useRef<THREE.AnimationMixer | null>(null);  // Controls all animations
    const activeActionRef = React.useRef<THREE.AnimationAction | null>(null);  // Currently playing animation
    const builtInAnimationsRef = React.useRef<THREE.AnimationClip[]>([]);  // Animations from the GLB file

    // Add a state to track when the model is loaded
    const [modelLoaded, setModelLoaded] = useState(false);

    // Add state to track current section's z-index
    const [currentZIndex, setCurrentZIndex] = useState(0);

    const positions =  {

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
        animationName: null // index 0

    }
    ////////////////////////////////////////////////////////////
    // SETUP THREE.JS SCENE
    ////////////////////////////////////////////////////////////
    useEffect(() => {
        //// Camera Setup ////
        const camera = new THREE.PerspectiveCamera(
            positions.cameraFOV, // field of view (view angle)
            window.innerWidth / window.innerHeight, // aspect ratio
            0.1, // near clipping plane, the closest distance the camera can see
            1000 // far clipping plane, the farthest distance the camera can see
        );

        // Store camera in ref for GSAP animations
        cameraRef.current = camera;

        // Position the camera to see the robot
        camera.position.x = positions.cameraPosition.x; // +ve right, -ve left
        camera.position.y = positions.cameraPosition.y; // +ve down, -ve up
        camera.position.z = positions.cameraPosition.z; // move the camera away to see the scene more
        

        //// Scene Setup ////
        const scene = new THREE.Scene(); // contains all the objects, lights, cameras, etc.
        let robot: THREE.Group | undefined; // Will hold our 3D model
        const loader = new GLTFLoader(); // Loader for GLTF/GLB files
        
        // Add a clock to track time between frames
        const clock = new THREE.Clock();

        //// Load 3D Model ////
        loader.load('assets_3D/robot/think_walk.glb', 
            // Success callback - runs when the model is loaded
            function(gltf) {
                // Add the model to the scene
                robot = gltf.scene;
                
                // Store robot in ref for GSAP animations
                robotRef.current = robot;
                
                robot.scale.set(positions.robotScale.x, positions.robotScale.y, positions.robotScale.z); // scale the robot

                // 1, 1, 1
                // hero -1.5
                let robotPositionX = positions.robotPosition.x;
                if (window.innerWidth > 1500)  robotPositionX = robotPositionX+2;
                robot.position.x = robotPositionX;
                robot.position.y = positions.robotPosition.y;
                robot.position.z = positions.robotPosition.z;

                robot.rotation.x = positions.robotRotation.x;
                robot.rotation.y = positions.robotRotation.y;
                robot.rotation.z = positions.robotRotation.z;


                scene.add(robot);

                // Store built-in animations for later use
                builtInAnimationsRef.current = gltf.animations;
                // console.log("Built-in animations:", gltf.animations);

                // Create animation mixer (manages all animations for this model)
                mixerRef.current = new THREE.AnimationMixer(robot);
                
                // Play the initial built-in animation if available
                if (gltf.animations && gltf.animations.length > 0) {
                    const action = mixerRef.current.clipAction(gltf.animations[0]);
                    action.play();
                    activeActionRef.current = action;
                }

                // Mark the model as loaded
                setModelLoaded(true);
                // console.log("3D model loaded successfully!");
            }, 
            // Progress callback - runs during loading
            // function(xhr) {
            //     // console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
            // }, 
            // Error callback - runs if there's an error
            // function(error) {
            //     // console.log('An error happened during loading');
            // }
        );

        //// Renderer Setup ////
        // Creates the canvas element where the 3D scene will be drawn
        const renderer = new THREE.WebGLRenderer({alpha: true}); // alpha: true makes background transparent
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('containerThreeD')?.appendChild(renderer.domElement);

        //// Animation Loop ////
        // This function runs continuously to update and render the scene
        const reRender3D = () => {
            renderer.render(scene, camera); // Draw the current state of the scene
            requestAnimationFrame(reRender3D); // Schedule the next frame
            
            // OPTIMIZATION: Use time-based animation with speed multiplier
            if (mixerRef.current) {
                // Get the time elapsed since the last frame
                const delta = clock.getDelta();
                
                // Apply a speed multiplier to match production speed with development speed
                // Adjust this value as needed (1.5-2.0 typically works well)
                const speedMultiplier = process.env.NODE_ENV === 'production' ? 1.3 : 0.75;
                
                // Update animations based on actual elapsed time with multiplier
                mixerRef.current.update(delta * speedMultiplier);
            }
        }
        
        reRender3D(); // Start the animation loop

        //// Lighting ////
        const ambientLight = new THREE.AmbientLight(0xffffff, 0); // Add ambient light to illuminate the scene
        scene.add(ambientLight);


        //// Cleanup Function ////
        // This runs when the component unmounts to prevent memory leaks
        return () => {
            // Only try to remove the element if it exists in the DOM
            const container = document.getElementById('containerThreeD');
            if (renderer && container && container.contains(renderer.domElement)) {
                renderer.dispose(); // Release WebGL resources
                container.removeChild(renderer.domElement);
            }
        };
    }, []); // Empty dependency array means this runs once on mount

    ////////////////////////////////////////////////////////////
    // GSAP ANIMATIONS
    ////////////////////////////////////////////////////////////
    
    // Set up ScrollTrigger animations only after the model is loaded
    useEffect(() => {
        if (!modelLoaded || !robotRef.current || !cameraRef.current) {
            // console.log("Waiting for robot and camera to load...");
            return;
        }
        
        // console.log("Setting up ScrollTrigger animations - model is loaded!");
        
        // Check window width - don't set up ScrollTrigger on small devices
        if (window.innerWidth < 950) {
            // console.log("Screen width < 900px - ScrollTrigger disabled");
            
            // Set initial position for mobile (using hero section values)
            const heroSection = arrPositionModel[0];
            
            // Set z-index for mobile
            setCurrentZIndex(heroSection.zIndex);
            
            // Set robot position, rotation, scale for mobile
            if (robotRef.current) {
                robotRef.current.position.set(
                    heroSection.robotPosition.x,
                    heroSection.robotPosition.y,
                    heroSection.robotPosition.z
                );
                
                robotRef.current.rotation.set(
                    heroSection.robotRotation.x,
                    heroSection.robotRotation.y,
                    heroSection.robotRotation.z
                );
                
                robotRef.current.scale.set(
                    heroSection.robotScale.x,
                    heroSection.robotScale.y,
                    heroSection.robotScale.z
                );
            }
            
            // Set camera position and FOV for mobile
            if (cameraRef.current) {
                cameraRef.current.position.set(
                    heroSection.cameraPosition.x,
                    heroSection.cameraPosition.y,
                    heroSection.cameraPosition.z
                );
                
                cameraRef.current.fov = heroSection.cameraFOV;
                cameraRef.current.updateProjectionMatrix();
            }
            
            return; // Exit early - don't set up ScrollTrigger
        }
        
        // Debug - check if sections exist in the DOM
        // arrPositionModel.forEach((section) => {
        //     // const element = document.getElementById(section.id);
        //     // console.log(`Section #${section.id} exists:`, !!element);
        // });
        
        // First, create a special trigger for returning to the hero section
        const heroSection = arrPositionModel[0];
        const heroElement = document.getElementById(heroSection.id);
        
        if (heroElement) {
            ScrollTrigger.create({
                trigger: heroElement,
                start: "top 60%",
                end: "bottom 40%",
                scrub: 0.5, // Add scrubbing with 0.5 second smoothing
                onEnter: () => {
                    // console.log(`Entering hero section`);
                    // Set z-index directly from the section data
                    setCurrentZIndex(heroSection.zIndex);
                    
                    // add extra offset for large screens
                    let robotPositionX = heroSection.robotPosition.x;
                    if (heroSection.id === "hero" && window.innerWidth > 1500) robotPositionX = heroSection.robotPosition.x+2;

                    // Animate robot position
                    if (robotRef.current) {
                        gsap.to(robotRef.current.position, {
                            x: robotPositionX,
                            y: heroSection.robotPosition.y,
                            z: heroSection.robotPosition.z,
                            duration: 1.5,
                            ease: "power2.inOut"
                        });
                    
                        // Animate robot rotation
                        gsap.to(robotRef.current?.rotation, {
                            x: heroSection.robotRotation.x,
                            y: heroSection.robotRotation.y,
                            z: heroSection.robotRotation.z,
                            duration: 1.5,
                            ease: "power2.inOut"
                        });
                        
                        // Animate robot scale
                        gsap.to(robotRef.current?.scale, {
                            x: heroSection.robotScale.x,
                            y: heroSection.robotScale.y,
                            z: heroSection.robotScale.z,
                            duration: 1.5,
                            ease: "power2.inOut"
                        });
                    }
                    
                    // Animate camera position
                    if (cameraRef.current) {
                        gsap.to(cameraRef.current?.position, {
                        x: heroSection.cameraPosition.x,
                        y: heroSection.cameraPosition.y,
                        z: heroSection.cameraPosition.z,
                        duration: 1.5,
                        ease: "power2.inOut"
                    });
                    
                    // Animate camera FOV
                        gsap.to(cameraRef.current, {
                            fov: heroSection.cameraFOV,
                            duration: 1.5,
                            ease: "power2.inOut",
                            onUpdate: () => {
                                if (cameraRef.current) {
                                    cameraRef.current.updateProjectionMatrix();
                                }
                            }
                        });
                    }
                    
                    // Change animation if specified
                    if (heroSection.animationName !== null) {
                        setCurrentAnimIndex(heroSection.animationName);
                    }
                },
                onEnterBack: () => {
                    console.log(`Entering hero section (scrolling back up)`);
                    // Set z-index directly from the section data
                    setCurrentZIndex(heroSection.zIndex);
                    
                    // add extra offset for large screens
                    let robotPositionX = heroSection.robotPosition.x;
                    if (heroSection.id === "hero" && window.innerWidth > 1500) robotPositionX = heroSection.robotPosition.x+2;

                    // Animate robot position
                    if (robotRef.current) {
                        gsap.to(robotRef.current.position, {
                            x: robotPositionX,
                            y: heroSection.robotPosition.y,
                            z: heroSection.robotPosition.z,
                            duration: 1.5,
                            ease: "power2.inOut"
                        });
                    
                    // Animate robot rotation
                    gsap.to(robotRef.current?.rotation, {
                        x: heroSection.robotRotation.x,
                        y: heroSection.robotRotation.y,
                        z: heroSection.robotRotation.z,
                        duration: 1.5,
                        ease: "power2.inOut"
                    });
                    
                    // Animate robot scale
                    gsap.to(robotRef.current?.scale, {
                        x: heroSection.robotScale.x,
                        y: heroSection.robotScale.y,
                        z: heroSection.robotScale.z,
                        duration: 1.5,
                        ease: "power2.inOut"
                    });
                    
                }

                    // Animate camera position
                    if (cameraRef.current) {
                        gsap.to(cameraRef.current?.position, {
                            x: heroSection.cameraPosition.x,
                            y: heroSection.cameraPosition.y,
                            z: heroSection.cameraPosition.z,
                            duration: 1.5,
                            ease: "power2.inOut"
                            });
                        
                        // Animate camera FOV
                        gsap.to(cameraRef.current, {
                            fov: heroSection.cameraFOV,
                            duration: 1.5,
                            ease: "power2.inOut",
                            onUpdate: () => {
                                if (cameraRef.current) {
                                    cameraRef.current.updateProjectionMatrix();
                                }
                            }
                        });
                    }
                    // Change animation if specified
                    if (heroSection.animationName !== null) {
                        setCurrentAnimIndex(heroSection.animationName);
                    }
                },
                // markers: true,
                id: `trigger-hero`
            });
        }
        
        // Create animations for each section in arrPositionModel
        arrPositionModel.forEach((section, index) => {
            // Skip the first (hero) section as we handled it separately
            if (index === 0) return;
            
            const sectionElement = document.getElementById(section.id);
            if (!sectionElement) {
                console.error(`Section with ID #${section.id} not found in the DOM`);
                return;
            }
            
            // Create a ScrollTrigger for this section
            ScrollTrigger.create({
                trigger: sectionElement,
                start: "top bottom", // Start when the top of the section hits the bottom of the viewport
                end: "bottom top", // End when the bottom of the section hits the top of the viewport
                scrub: 1, // Add scrubbing with 1 second smoothing for a more natural feel
                onEnter: () => {
                    // console.log(`Entering section: ${section.id}`);
                    // Set z-index directly from the section data
                    setCurrentZIndex(section.zIndex);
                    
                    // add extra offset for large screens
                    let robotPositionX = section.robotPosition.x;
                    if (window.innerWidth > 1500 && section.id !== "hero") robotPositionX = robotPositionX-2;
                    if (section.id === "testimonials" || section.id === "contact") robotPositionX = section.robotPosition.x;
                    if (section.id === "testimonials" && window.innerWidth > 1500) robotPositionX = section.robotPosition.x+4;
                    if (section.id === "hero" && window.innerWidth > 1500) robotPositionX = section.robotPosition.x+2;

                    // Animate robot position
                    if (robotRef.current) {
                        gsap.to(robotRef.current?.position, {
                            x: robotPositionX,
                            y: section.robotPosition.y,
                            z: section.robotPosition.z,
                            duration: 1.5,
                            ease: "power2.inOut"
                        });
                        
                        // Animate robot rotation
                        gsap.to(robotRef.current?.rotation, {
                            x: section.robotRotation.x,
                            y: section.robotRotation.y,
                            z: section.robotRotation.z,
                            duration: 1.5,
                            ease: "power2.inOut"
                        });
                        
                        // Animate robot scale
                        gsap.to(robotRef.current?.scale, {
                            x: section.robotScale.x,
                            y: section.robotScale.y,
                            z: section.robotScale.z,
                            duration: 1.5,
                            ease: "power2.inOut"
                        });
                    }
                    // Animate camera position
                    if (cameraRef.current) {
                        gsap.to(cameraRef.current?.position, {
                        x: section.cameraPosition.x,
                        y: section.cameraPosition.y,
                        z: section.cameraPosition.z,
                        duration: 1.5,
                        ease: "power2.inOut"
                        });
                    
                    // Animate camera FOV
                        gsap.to(cameraRef.current, {
                            fov: section.cameraFOV,
                            duration: 1.5,
                            ease: "power2.inOut",
                            onUpdate: () => {
                                if (cameraRef.current) {
                                    cameraRef.current.updateProjectionMatrix();
                                }
                            }
                        });
                    }
                    // Change animation if specified
                    if (section.animationName !== null) {
                        setCurrentAnimIndex(section.animationName);
                    }
                },
                onLeaveBack: () => {
                    // console.log(`Leaving section: ${section.id} (going back)`);
                    
                    // When scrolling back up, return to previous section
                    const prevSection = arrPositionModel[Math.max(0, index - 1)];
                    // Set z-index directly from the previous section data
                    setCurrentZIndex(prevSection.zIndex);
                    
                    // add extra offset for large screens
                    let robotPositionX = prevSection.robotPosition.x;
                    if (window.innerWidth > 1500 && prevSection.id !== "hero") robotPositionX = robotPositionX-2;
                    if (prevSection.id === "testimonials" || prevSection.id === "contact") robotPositionX = prevSection.robotPosition.x;
                    if (prevSection.id === "testimonials" && window.innerWidth > 1500) robotPositionX = prevSection.robotPosition.x+4;
                    if (prevSection.id === "hero" && window.innerWidth > 1500) robotPositionX = prevSection.robotPosition.x+2;

                    // Animate robot position
                    if (robotRef.current) {
                        gsap.to(robotRef.current?.position, {
                        x: robotPositionX,
                        y: prevSection.robotPosition.y,
                        z: prevSection.robotPosition.z,
                        duration: 1.5,
                        ease: "power2.inOut"
                    });
                    
                        // Animate robot rotation
                        gsap.to(robotRef.current?.rotation, {
                            x: prevSection.robotRotation.x,
                            y: prevSection.robotRotation.y,
                            z: prevSection.robotRotation.z,
                            duration: 1.5,
                            ease: "power2.inOut"
                        });
                        
                        // Animate robot scale
                        gsap.to(robotRef.current?.scale, {
                            x: prevSection.robotScale.x,
                            y: prevSection.robotScale.y,
                            z: prevSection.robotScale.z,
                            duration: 1.5,
                            ease: "power2.inOut"
                        });
                    }

                    // Animate camera position
                    if (cameraRef.current) {
                        gsap.to(cameraRef.current?.position, {
                        x: prevSection.cameraPosition.x,
                        y: prevSection.cameraPosition.y,
                        z: prevSection.cameraPosition.z,
                        duration: 1.5,
                        ease: "power2.inOut"
                        });
                    
                        // Animate camera FOV
                        gsap.to(cameraRef.current, {
                            fov: prevSection.cameraFOV,
                            duration: 1.5,
                            ease: "power2.inOut",
                            onUpdate: () => {
                                if (cameraRef.current) {
                                    cameraRef.current.updateProjectionMatrix();
                                }
                            }
                        });
                    }
                    // If we're leaving the "about" section and going back to hero,
                    // set animation to the default GLB animation (index 0)
                    if (section.id === "about") {
                        // console.log("Returning to hero section - setting default GLB animation");
                        setCurrentAnimIndex(0);
                    } 
                    // Otherwise use the previous section's animation if specified
                    else if (prevSection.animationName !== null) {
                        setCurrentAnimIndex(prevSection.animationName);
                    }
                },
                // // markers: true,, // Keep markers on for debugging
                id: `trigger-${section.id}` // Add ID for debugging
            });
        });

        // Add window resize listener to disable/enable ScrollTrigger
        const handleResize = () => {
            if (window.innerWidth < 950) {
                // Kill all ScrollTrigger instances
                ScrollTrigger.getAll().forEach(trigger => trigger.kill());
                // console.log("Screen resized to < 900px - ScrollTrigger disabled");
                
                // Reset to hero section values
                setCurrentZIndex(heroSection.zIndex);
                
                if (robotRef.current) {
                    robotRef.current.position.set(
                        heroSection.robotPosition.x,
                        heroSection.robotPosition.y,
                        heroSection.robotPosition.z
                    );
                    
                    robotRef.current.rotation.set(
                        heroSection.robotRotation.x,
                        heroSection.robotRotation.y,
                        heroSection.robotRotation.z
                    );
                    
                    robotRef.current.scale.set(
                        heroSection.robotScale.x,
                        heroSection.robotScale.y,
                        heroSection.robotScale.z
                    );
                }
                
                if (cameraRef.current) {
                    cameraRef.current.position.set(
                        heroSection.cameraPosition.x,
                        heroSection.cameraPosition.y,
                        heroSection.cameraPosition.z
                    );
                    
                    cameraRef.current.fov = heroSection.cameraFOV;
                    cameraRef.current.updateProjectionMatrix();
                }
            } else {
                // Refresh the page to re-initialize ScrollTrigger
                // This is a simple approach - a more complex one would recreate the triggers
                window.location.reload();
            }
        };
        
        // Add resize listener
        window.addEventListener('resize', handleResize);
        
        // Cleanup function
        return () => {
            // Remove resize listener
            window.removeEventListener('resize', handleResize);
            
            // Kill all ScrollTrigger instances
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, [modelLoaded]); // Only run when modelLoaded changes to true

    ////////////////////////////////////////////////////////////
    // ANIMATION FUNCTIONS
    ////////////////////////////////////////////////////////////
    
    /**
     * Plays a specific animation based on index
     * @param animIndex - 0 for built-in animation, 1+ for custom animations
     */
    const playCustomAnimation = (animIndex: number) => {
        // Don't proceed if the mixer isn't ready
        if (!mixerRef.current) return;
        
        // Stop current animation with crossfade
        if (activeActionRef.current) {
            activeActionRef.current.fadeOut(0.5); // Smooth transition out
        }

        //// Handle Built-in Animation ////
        // Index 0 = built-in animation from the GLB file
        if (animIndex === 0) {
            if (builtInAnimationsRef.current && builtInAnimationsRef.current.length > 0) {
                const action = mixerRef.current.clipAction(builtInAnimationsRef.current[0]);
                action.reset().fadeIn(0.5).play(); // Reset, fade in, and play
                activeActionRef.current = action; // Store as active animation
            }
            return;
        }

        //// Handle Custom Animations ////
        // Convert from UI index to myAnim array index (1 → 0, 2 → 1, etc.)
        const myAnimIndex = animIndex - 1;
        
        // Debug logging
        // console.log("Animation name:", animationNames[myAnimIndex]);
        // console.log("myAnim is array with length:", myAnim.length);
        
        // Check if the index is valid
        if (myAnimIndex >= 0 && myAnimIndex < myAnim.length) {
            try {
                // Get the animation data from the array
                const animData = myAnim[myAnimIndex];
                
                // Verify the animation has tracks
                if (!animData.tracks || !Array.isArray(animData.tracks)) {
                    console.error(`No tracks found for animation at index ${myAnimIndex}`);
                    return;
                }
                
                // Convert track data to THREE.js KeyframeTracks
                const tracks = animData.tracks.map(track => {
                    // Create the appropriate track type based on track.type
                    switch(track.type) {
                        case "vector":
                            return new THREE.VectorKeyframeTrack(track.name, track.times, track.values);
                        case "quaternion":
                            return new THREE.QuaternionKeyframeTrack(track.name, track.times, track.values);
                        default:
                            return new THREE.NumberKeyframeTrack(track.name, track.times, track.values);
                    }
                });

                // Create animation clip from the tracks
                const animationClip = new THREE.AnimationClip(
                    animData.name || `animation-${myAnimIndex}`,
                    animData.duration,
                    tracks
                );

                // Play the new animation with crossfade
                const newAction = mixerRef.current.clipAction(animationClip);
                newAction.reset().fadeIn(0.5).play(); // Reset, fade in, and play
                activeActionRef.current = newAction; // Store as active animation
            } catch (error) {
                console.error(`Error creating animation at index ${myAnimIndex}:`, error);
            }
        } else {
            console.error(`Animation index ${myAnimIndex} is out of bounds (myAnim length: ${myAnim.length})`);
        }
    };

    ////////////////////////////////////////////////////////////
    // EFFECTS AND EVENT HANDLERS
    ////////////////////////////////////////////////////////////
    
    // Effect to handle animation changes
    // This runs whenever currentAnimIndex changes
    useEffect(() => {
        if (mixerRef.current) {
            playCustomAnimation(currentAnimIndex);
        }
    }, [currentAnimIndex]);

    /**
     * Cycles to the next animation when button is clicked
     */
    // const cycleAnimation = () => {
    //     // Calculate total available animations (1 built-in + custom animations)
    //     // Use Math.min to avoid trying to access animations that don't exist
    //     const totalAnimations = 1 + Math.min(myAnim.length, animationNames.length);
        
    //     // Update the animation index, wrapping around when we reach the end
    //     setCurrentAnimIndex((prevIndex) => (prevIndex + 1) % totalAnimations);
    // };

    ////////////////////////////////////////////////////////////
    // HELPER FUNCTIONS FOR UI
    ////////////////////////////////////////////////////////////
    
    /**
     * Gets the name of the currently playing animation
     */
    // const getCurrentAnimationName = () => {
    //     if (currentAnimIndex === 0) {
    //         return "Built-in Animation";
    //     } else {
    //         const nameIndex = currentAnimIndex - 1;
    //         // Use the name if available, otherwise use a generic name
    //         return nameIndex < animationNames.length ? animationNames[nameIndex] : `Animation ${nameIndex}`;
    //     }
    // };

    /**
     * Gets the name of the next animation that will play when button is clicked
     */
    // const getNextAnimationName = () => {
    //     // Calculate the next index with wrapping
    //     const nextIndex = (currentAnimIndex + 1) % (1 + Math.min(myAnim.length, animationNames.length));
        
    //     if (nextIndex === 0) {
    //         return "Built-in Animation";
    //     } else {
    //         const nameIndex = nextIndex - 1;
    //         // Use the name if available, otherwise use a generic name
    //         return nameIndex < animationNames.length ? animationNames[nameIndex] : `Animation ${nameIndex}`;
    //     }
    // };

    // Check for mobile on initial render and window resize
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 500;
            setIsMobile(mobile);
            // console.log("isMobile:", mobile);
            
            // Only adjust scale if robot is loaded AND we're on mobile
            if (mobile && robotRef.current && modelLoaded) {
                // console.log("Robot loaded, adjusting scale for mobile");
                // Set smaller scale for mobile devices
                robotRef.current.scale.x = 2.5;
                robotRef.current.scale.y = 2.5;
                robotRef.current.scale.z = 2.5;
                robotRef.current.position.x = 4;
            }
        };
        
        // Initial check
        checkMobile();
        
        // Add resize listener
        window.addEventListener('resize', checkMobile);
        
        // Cleanup
        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, [modelLoaded]); // Add modelLoaded as a dependency

    // Add a separate effect to handle resize for ScrollTrigger reactivation
    useEffect(() => {
        if (!modelLoaded) return;
        
        let prevWidth = window.innerWidth;
        const handleResize = () => {
            const currentWidth = window.innerWidth;
            
            // If transitioning from small to large screen
            if (prevWidth < 950 && currentWidth >= 950) {
                // console.log("Screen resized to >= 900px - Reactivating ScrollTrigger");
                
                // Kill any existing triggers first
                ScrollTrigger.getAll().forEach(trigger => trigger.kill());
                
                // Refresh ScrollTrigger
                ScrollTrigger.refresh();
                
                // Force re-run of the ScrollTrigger setup effect
                setModelLoaded(false);
                setTimeout(() => setModelLoaded(true), 10);
            } 
            // If transitioning from large to small screen
            else if (prevWidth >= 950 && currentWidth < 950) {
                // console.log("Screen resized to < 900px - ScrollTrigger disabled");
                
                // Kill all ScrollTrigger instances
                ScrollTrigger.getAll().forEach(trigger => trigger.kill());
                
                // Reset to hero section values
                const heroSection = arrPositionModel[0];
                setCurrentZIndex(heroSection.zIndex);
                
                if (robotRef.current) {
                    robotRef.current.position.set(
                        heroSection.robotPosition.x,
                        heroSection.robotPosition.y,
                        heroSection.robotPosition.z
                    );
                    
                    robotRef.current.rotation.set(
                        heroSection.robotRotation.x,
                        heroSection.robotRotation.y,
                        heroSection.robotRotation.z
                    );
                    
                    // Set scale to 1 for mobile
                    robotRef.current.scale.set(1, 1, 1);
                }
                
                if (cameraRef.current) {
                    cameraRef.current.position.set(
                        heroSection.cameraPosition.x,
                        heroSection.cameraPosition.y,
                        heroSection.cameraPosition.z
                    );
                    
                    cameraRef.current.fov = heroSection.cameraFOV;
                    cameraRef.current.updateProjectionMatrix();
                }
            }
            
            // Update previous width
            prevWidth = currentWidth;
        };
        
        // Add resize listener
        window.addEventListener('resize', handleResize);
        
        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [modelLoaded]);

    ////////////////////////////////////////////////////////////
    // RENDER
    ////////////////////////////////////////////////////////////
    return (
        <div id="containerThreeD" 
            className={`${isMobile ? 'absolute' : 'fixed'} inset-0 w-full h-full pointer-events-none overflow-hidden`}
            style={{ zIndex: currentZIndex }}>
            {/* Debug display for z-index */}
            {/* <div className="absolute top-16 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                z-index: {currentZIndex}
            </div> */}
            
            {/* Button to cycle through animations */}
            {/* <button 
                className='absolute top-4 left-4 z-[100] bg-blue-500 text-white px-4 py-2 rounded pointer-events-auto'
                onClick={cycleAnimation}
            >
                <div className="flex flex-col items-start">
                    <span className="text-xs opacity-70">Current: {getCurrentAnimationName()}</span>
                    <span>Next: {getNextAnimationName()}</span>
                </div>
            </button> */}
        </div>
    )
}

export default RobotNew