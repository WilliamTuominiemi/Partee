import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      containerRef.current?.appendChild(renderer.domElement);

      camera.position.set(0, 10, 40);
      camera.lookAt(new THREE.Vector3(0, 0, 0));

      const mapGeometry = new THREE.BoxGeometry(10, 1, 40);
      const mapMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(mapGeometry, mapMaterial);
      scene.add(cube);

      const sphereGeometry = new THREE.SphereGeometry();
      const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.y = 1.5;
      sphere.position.z = 18;
      scene.add(sphere);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      scene.add(directionalLight);

      renderer.render(scene, camera);

      let previousTime = performance.now();

      const renderScene = (currentTime: number) => {
        const deltaTime = (currentTime - previousTime) / 1000;
        previousTime = currentTime;

        sphere.position.z -= 0.05 * deltaTime * 60;
        if (sphere.position.z <= -18) {
          sphere.position.z = 18;
        }

        camera.position.z = sphere.position.z + 22.5;
        camera.lookAt(sphere.position);

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

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return <div ref={containerRef} />;
};

export default ThreeScene;
