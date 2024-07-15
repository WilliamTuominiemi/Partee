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

const level1hole = new THREE.Vector3(35, 1.5, -45);

const level2 = [
  new THREE.Vector2(10, 0),
  new THREE.Vector2(0, 0),
  new THREE.Vector2(5, 45),
  new THREE.Vector2(-40, 40),
  new THREE.Vector2(-40, 50),
  new THREE.Vector2(10, 50),
  new THREE.Vector2(10, 0),
];

const level2hole = new THREE.Vector3(-35, 1.5, -45);

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

const level3hole = new THREE.Vector3(15, 1.5, -115);

const levels = [level1, level2, level3];
const holes = [level1hole, level2hole, level3hole];

export function getRandomLevel(lastId: number | null) {
  let randomIndex;

  // If lastId is null, don't check for uniqueness from last id
  if (lastId === null) {
    randomIndex = Math.floor(Math.random() * levels.length);
  } else {
    do {
      randomIndex = Math.floor(Math.random() * levels.length);
    } while (randomIndex === lastId);
  }

  return { map: levels[randomIndex], hole: holes[randomIndex], id: randomIndex };
}
