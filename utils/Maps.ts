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
  new THREE.Vector2(0, 0),
  new THREE.Vector2(15, 0),
  new THREE.Vector2(15, 30),
  new THREE.Vector2(35, 30),
  new THREE.Vector2(35, 45),
  new THREE.Vector2(0, 45),
  new THREE.Vector2(0, 0),
];

const level3 = [
  new THREE.Vector2(0, 0),
  new THREE.Vector2(20, 0),
  new THREE.Vector2(20, 20),
  new THREE.Vector2(30, 20),
  new THREE.Vector2(30, 30),
  new THREE.Vector2(0, 30),
  new THREE.Vector2(0, 0),
];

const levels = [level1, level2, level3];

export function getRandomLevel() {
  const randomIndex = Math.floor(Math.random() * levels.length);
  console.log(randomIndex);
  return levels[randomIndex];
}
