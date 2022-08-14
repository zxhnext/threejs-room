import * as THREE from 'three';
import data from '@/mock/data';
import gsap from 'gsap';
import scene from './scene';
import camera from './camera';

export function createSphere(index = 0): THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial> {
  const sphereGeometry = new THREE.SphereBufferGeometry(16, 30, 30);
  sphereGeometry.scale(16, 16, -16);
  const sphereTexture = new THREE.TextureLoader().load(data[index].textures);
  const sphereMaterial = new THREE.MeshBasicMaterial({ map: sphereTexture });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

  scene.add(sphere);
  return sphere;
}

export function addSprite(index = 0): THREE.Sprite[] {
  const tipTexture = new THREE.TextureLoader().load(
    require('@/assets/textures/tip.png'),
  );
  const material = new THREE.SpriteMaterial({ map: tipTexture });
  const spriteList: THREE.Sprite[] = [];
  data[index].tipsList.forEach((item: any) => {
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(10, 10, 10);
    sprite.position.set(item.position.x, item.position.y, item.position.z);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    sprite.content = item.content;
    spriteList.push(sprite);
    scene.add(sprite);
  });
  return spriteList;
}

export function changeContentAndTips(
  sphere: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>,
  index: number,
): THREE.Sprite[] {
  scene.children = scene.children.filter((item) => String(item.type) !== 'Sprite');
  const texture = new THREE.TextureLoader().load(data[index].textures);
  const sphereMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0,
  });
  // eslint-disable-next-line no-param-reassign
  sphere.material = sphereMaterial;
  gsap.to(sphereMaterial, { transparent: true, opacity: 1, duration: 2 });
  camera.updateProjectionMatrix();
  return addSprite(index);
}
