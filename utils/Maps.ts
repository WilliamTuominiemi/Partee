import * as THREE from 'three';

const level1 = [
  new THREE.Vector2(0, 0),
  new THREE.Vector2(10, 0),
  new THREE.Vector2(10, 40),
  new THREE.Vector2(40, 40),
  new THREE.Vector2(40, 50),
  new THREE.Vector2(0, 50),
  new THREE.Vector2(0, 0),
];

const level2 = [
  new THREE.Vector2(10, 0),
  new THREE.Vector2(0, 0),
  new THREE.Vector2(5, 45),
  new THREE.Vector2(-40, 40),
  new THREE.Vector2(-40, 50),
  new THREE.Vector2(10, 50),
  new THREE.Vector2(10, 0),
];

const level3 = [
  new THREE.Vector2(0, 0),
  new THREE.Vector2(12, 0),
  new THREE.Vector2(20, 40),
  new THREE.Vector2(12, 80),
  new THREE.Vector2(20, 120),
  new THREE.Vector2(12, 120),
  new THREE.Vector2(0, 80),
  new THREE.Vector2(12, 40),
  new THREE.Vector2(0, 0),
];

const levels = [level1, level2, level3];

export function getRandomLevel() {
  const randomIndex = Math.floor(Math.random() * levels.length);
  console.log(randomIndex);
  return levels[randomIndex];
}
