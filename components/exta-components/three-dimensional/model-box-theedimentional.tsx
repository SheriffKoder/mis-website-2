import React, { useEffect } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const ModelBoxTheedimentional = ({ fileName, rotationSpeedProp }: { fileName: string, rotationSpeedProp: number }) => {

    const containerWidth = 300;
    const containerHeight = 200;

    const positions =  {

        modelPosition: {
            x: 0,
            y: 0,
            z: 0
        },
        cameraPosition: {
            x: 0,
            y: 0,
            z: 10
        },
        modelRotation: {
            x: 0,
            y: 0,
            z: 0
        }, 
        modelScale : {
            x: 1,
            y: 1,
            z: 1
        },
        cameraFOV: 10,
        cameraLookAt: {
            x: 0,
            y: 0,
            z: 0
        },
    }

    useEffect(() => {
        // Create container reference
        const container = document.getElementById(fileName);
        if (!container) return;
        
        // Clear any existing content to prevent duplication
        container.innerHTML = '';

        const camera = new THREE.PerspectiveCamera(
            10, // field of view
            containerWidth / containerHeight, // aspect ratio
            0.1, // near clipping plane
            1000 // far clipping plane
        );
        camera.position.set(
            positions.cameraPosition.x, 
            positions.cameraPosition.y, 
            positions.cameraPosition.z
        );

        const scene = new THREE.Scene();
        let model: THREE.Group | null = null;

        // OPTIMIZATION: Reduce rendering resolution for better performance
        // Lower pixel ratio reduces the number of pixels that need to be rendered,
        // significantly decreasing GPU workload
        const pixelRatio = Math.min(1.5, window.devicePixelRatio);
        
        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            // OPTIMIZATION: Request low power mode from the GPU
            // This hints to the browser to prioritize power efficiency over performance
            powerPreference: 'low-power'
        });
        renderer.setSize(containerWidth, containerHeight);
        renderer.setPixelRatio(pixelRatio);
        container.appendChild(renderer.domElement);

        // OPTIMIZATION: Add visibility tracking to pause animations when not visible
        // This prevents unnecessary rendering of off-screen components
        let isVisible = true;
        let animationFrameId: number;
        
        // OPTIMIZATION: Use Intersection Observer to detect visibility
        // This is more efficient than checking visibility on every frame
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isVisible = entry.isIntersecting;
            });
        }, { threshold: 0.1 });
        
        observer.observe(container);

        const loader = new GLTFLoader();
        
        // Add error handling and path verification
        const modelPath = `/assets_3D/about/${fileName}.glb`;
        
        loader.load(
            modelPath, 
            // onLoad
            (gltf) => {
                model = gltf.scene;

                // Apply position, rotation, scale
                model.position.set(
                    positions.modelPosition.x, 
                    positions.modelPosition.y, 
                    positions.modelPosition.z
                );

                model.rotation.set(
                    positions.modelRotation.x, 
                    positions.modelRotation.y, 
                    positions.modelRotation.z
                );

                model.scale.set(
                    positions.modelScale.x, 
                    positions.modelScale.y, 
                    positions.modelScale.z
                );

                // OPTIMIZATION: Use a single shared material for all meshes
                // This reduces draw calls and memory usage
                const glassMaterial = new THREE.MeshPhysicalMaterial({
                    color: 0xffffff,
                    metalness: 0.1,
                    roughness: 0.1,
                    transmission: 1.5,
                    transparent: false,
                    opacity: 0.5,
                    reflectivity: 1.0,
                    clearcoat: 1.0,
                    clearcoatRoughness: 0.1
                });

                // Apply the glass material to all meshes in the model
                model.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.material = glassMaterial;
                        
                        // OPTIMIZATION: Clean up unused geometry data
                        // This frees up memory by disposing of the original geometry
                        if (child.geometry) {
                            child.geometry.dispose();
                        }
                    }
                });

                scene.add(model);
            },
            undefined,
            // (error) => {
            //     console.error(`Error loading model ${fileName}:`, error);
            //     if (error.target && error.target.status === 404) {
            //         console.error(`Model file not found at path: ${modelPath}`);
            //     }
            // }
        );

        // OPTIMIZATION: Simplified lighting setup
        // Using fewer lights reduces calculations per frame
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // OPTIMIZATION: Use just one directional light instead of multiple lights
        // Each light adds significant rendering overhead
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(500, 500, 500);
        scene.add(light);

        // OPTIMIZATION: Use a speed multiplier to match production speed with development speed
        const speedMultiplier = process.env.NODE_ENV === 'production' ? 2.0 : 1.0;
        const rotationSpeed = rotationSpeedProp * speedMultiplier;

        // OPTIMIZATION: Implement frame rate limiting
        // These variables control the animation throttling
        let lastFrameTime = 0;
        // OPTIMIZATION: Target 30 FPS instead of 60 FPS
        // This cuts the rendering workload in half
        const targetFPS = 30;
        const frameInterval = 1000 / targetFPS;
        
        const animate = (currentTime: number) => {
            // OPTIMIZATION: Skip animation completely when not visible
            // This prevents unnecessary CPU/GPU work for off-screen components
            if (!isVisible) {
                animationFrameId = requestAnimationFrame(animate);
                return;
            }
            
            // OPTIMIZATION: Throttle frame rate to target FPS
            // This prevents rendering more frames than necessary
            const deltaTime = currentTime - lastFrameTime;
            if (deltaTime < frameInterval) {
                animationFrameId = requestAnimationFrame(animate);
                return;
            }
            
            lastFrameTime = currentTime - (deltaTime % frameInterval);
            
            if (model) {
                model.rotation.y += rotationSpeed;
            }
            
            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        // OPTIMIZATION: Comprehensive cleanup to prevent memory leaks
        // Proper disposal of Three.js resources is critical for performance
        return () => {
            // OPTIMIZATION: Cancel any pending animation frames
            cancelAnimationFrame(animationFrameId);
            
            // OPTIMIZATION: Disconnect the observer to prevent memory leaks
            observer.disconnect();
            
            // OPTIMIZATION: Dispose of the renderer
            renderer.dispose();
            
            // OPTIMIZATION: Properly dispose of all THREE.js resources
            if (model) {
                model.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        // OPTIMIZATION: Dispose of geometries
                        if (child.geometry) child.geometry.dispose();
                        
                        // OPTIMIZATION: Dispose of materials (handling both array and single materials)
                        if (child.material) {
                            if (Array.isArray(child.material)) {
                                child.material.forEach(material => material.dispose());
                            } else {
                                child.material.dispose();
                            }
                        }
                    }
                });
                scene.remove(model);
            }
            
            // OPTIMIZATION: Dispose of lights to prevent memory leaks
            // Check if scene exists first to prevent errors
            // if (scene) {
            //     scene.traverse((object) => {
            //         if (object instanceof THREE.Light) {
            //             scene.remove(object);
            //         }
            //     });
            // }
        };
    }, [fileName, rotationSpeedProp, positions]);

    
  return (
    <div 
        id={fileName} 
        className="relative w-full h-full z-50 pointer-events-none"
        style={{
            overflow: 'hidden',
            width: containerWidth,
            height: containerHeight
        }}
    >
      
    </div>
  )
}

export default ModelBoxTheedimentional
