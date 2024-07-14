import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { getRandomLevel } from '@/utils/Maps';

const ThreeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && typeof window !== 'undefined') {
      const level = getRandomLevel();

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
      const platform = initializePlatform();
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
                console.log('win');
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
            case 'ArrowLeft':
            case 'a':
              sphereDirection += 0.1;
              break;
            case 'ArrowRight':
            case 'd':
              sphereDirection -= 0.1;
              break;
            case ' ':
              if (ballSpeed === 0) ballSpeed = 1; // Hit the ball
              break;
            default:
              break;
          }
        }
      };

      const handleMouseClick = () => {
        if (ballSpeed === 0) ballSpeed = 1; // Hit the ball
      };

      window.addEventListener('resize', handleResize);
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('mousedown', handleMouseClick);

      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('mousedown', handleMouseClick);
      };
    }
  }, []);

  return <div ref={containerRef} />;
};

export default ThreeScene;
