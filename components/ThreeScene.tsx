import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  let sphereDirection = 0; // Direction in radians
  let ballSpeed = 0; // Ball speed

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Scene setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      containerRef.current?.appendChild(renderer.domElement);

      // Golf track
      const mapGeometry = new THREE.BoxGeometry(10, 1, 40);
      const mapMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(mapGeometry, mapMaterial);
      scene.add(cube);

      // Golf ball
      const sphereGeometry = new THREE.SphereGeometry();
      const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.y = 1.5;
      sphere.position.z = 18;
      scene.add(sphere);

      // Lighting
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      scene.add(directionalLight);

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
          if (ballSpeed < 0.01) ballSpeed = 0; // Stop the ball
        }

        // Update camera position and rotation
        camera.position.x = sphere.position.x + 20 * Math.sin(sphereDirection);
        camera.position.y = sphere.position.y + 10;
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
