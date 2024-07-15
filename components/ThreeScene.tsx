import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { getRandomLevel } from '@/utils/Maps';

const ThreeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && typeof window !== 'undefined') {
      let level = getRandomLevel(null);
      let lastlevelId: number = level.id;
      let ballVelocity: number = 0.5;

      const initializePlatform = () => {
        const polygonVertices = level.map;

        const mapGeometry = new THREE.ShapeGeometry(new THREE.Shape(polygonVertices));
        const mapMaterial = new THREE.MeshLambertMaterial({ color: 0x00a300 });
        const platform = new THREE.Mesh(mapGeometry, mapMaterial);

        return platform;
      };

      const initializeBall = () => {
        const sphereGeometry = new THREE.SphereGeometry();
        const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        return sphere;
      };

      const initializeHole = () => {
        const icosahedronGeometry = new THREE.IcosahedronGeometry();
        const icosahedronmaterial = new THREE.MeshLambertMaterial({ color: 0xa020f0 });
        const hole = new THREE.Mesh(icosahedronGeometry, icosahedronmaterial);
        return hole;
      };

      // Check if ball is within the area of the platform
      const isBallWithinPlatform = (sphere: THREE.Mesh, platform: THREE.Mesh): boolean => {
        const spherePosition = sphere.position.clone();

        // Raycast downward from ball position
        const raycaster = new THREE.Raycaster(spherePosition.clone(), new THREE.Vector3(0, -1, 0));

        // Check if the raycast intersects the platform
        const intersections = raycaster.intersectObject(platform);

        return intersections.length > 0;
      };

      let sphereDirection = 0; // Direction in radians
      let ballSpeed = 0; // Ball speed

      const initialBallPosition = new THREE.Vector3(5, 1, -5); // Initial position of the ball

      // Scene setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      containerRef.current?.appendChild(renderer.domElement);

      // Golf course platform
      let platform = initializePlatform();
      platform.rotation.x = -Math.PI / 2;
      scene.add(platform);

      // Golf ball
      const sphere = initializeBall();
      sphere.position.copy(initialBallPosition);
      scene.add(sphere);

      // "Hole"
      const hole = initializeHole();
      const holePosition = level.hole;
      hole.position.copy(holePosition);
      scene.add(hole);

      // Lighting
      const light = new THREE.HemisphereLight(0xffffff, 0x00a300, 1.5);
      scene.add(light);

      // Render scene
      renderer.render(scene, camera);

      let previousTime = performance.now();

      // Update ball color depending on the set velocity
      const lightBlue = new THREE.Color(0xadd8e6);
      const orange = new THREE.Color(0xffa500);

      const updateBallColor = (ballVelocity: number) => {
        const t = (ballVelocity - 0.1) / (1 - 0.1); // Normalize ballSpeed to a value between 0 and 1
        sphere.material.color = lightBlue.clone().lerp(orange, t);
      };

      // Set the color at start
      updateBallColor(ballVelocity);

      // update velocity
      const updateVelocity = (newVelocity: number) => {
        ballVelocity = Math.min(Math.max(newVelocity, 0.1), 1);
        updateBallColor(ballVelocity);
      };

      // Reset game when ball reaches hole
      const inHole = () => {
        // Get new level config, current level id so that it doesn't come again
        level = getRandomLevel(lastlevelId);

        // Reset platform
        const oldPlatform = scene.getObjectByProperty('uuid', platform.uuid);

        if (oldPlatform) scene.remove(oldPlatform);

        platform = initializePlatform();
        platform.rotation.x = -Math.PI / 2;
        scene.add(platform);

        // Reset ball
        sphere.position.copy(initialBallPosition);

        // Reset hole
        const holePosition = level.hole;
        hole.position.copy(holePosition);

        // Render scene
        renderer.render(scene, camera);
      };

      const renderScene = (currentTime: number) => {
        const deltaTime = (currentTime - previousTime) / 1000;
        previousTime = currentTime;

        // Update ball position
        if (ballSpeed > 0) {
          sphere.position.z -= ballSpeed * Math.cos(sphereDirection) * deltaTime * 60;
          sphere.position.x -= ballSpeed * Math.sin(sphereDirection) * deltaTime * 60;
          ballSpeed *= 0.99; // Slow ball
          if (ballSpeed < 0.01) {
            // When ball is stopping, check if it is within platform bounds
            if (isBallWithinPlatform(sphere, platform)) {
              ballSpeed = 0; // stop the ball

              // Check if ball stops near the "hole". If this is the case, they player won the level
              if (
                Math.abs(Math.abs(holePosition.x) - Math.abs(sphere.position.x)) < 3 &&
                Math.abs(Math.abs(holePosition.z) - Math.abs(sphere.position.z)) < 3
              ) {
                inHole();
              }
            } else {
              // Reset ball position to initial position
              sphere.position.copy(initialBallPosition);
            }
          }
        }

        // Update camera position and rotation
        camera.position.x = sphere.position.x + 20 * Math.sin(sphereDirection);
        camera.position.y = sphere.position.y + 5;
        camera.position.z = sphere.position.z + 20 * Math.cos(sphereDirection);
        camera.lookAt(sphere.position);

        // Render
        renderer.render(scene, camera);
        requestAnimationFrame(renderScene);
      };

      renderScene(previousTime);

      const handleResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (ballSpeed === 0) {
          // Only allow rotation when the ball is stopped
          switch (event.key) {
            // Controls to steer ball path
            case 'ArrowLeft':
            case 'a':
            case 'A':
              sphereDirection += 0.1;
              break;
            case 'ArrowRight':
            case 'd':
            case 'D':
              sphereDirection -= 0.1;
              break;
            case ' ':
              if (ballSpeed === 0) ballSpeed = ballVelocity; // Hit the ball
              break;
            //Controls to change hit power
            case 'w':
            case 'W':
              updateVelocity(ballVelocity + 0.1);
              break;
            case 's':
            case 'S':
              updateVelocity(ballVelocity - 0.1);
              break;
            default:
              break;
          }
        }
      };

      window.addEventListener('resize', handleResize);
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, []);

  return <div ref={containerRef} />;
};

export default ThreeScene;
