import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

export class GlobeScene {

  constructor(renderer, scene) {
    this.renderer = renderer
    this.scene = scene
  }

  setup() {
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.z = 2;
    this.scene.add(this.camera);

    this.renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.autoClear = false;
    this.renderer.setClearColor(0x000000, 0.0);

    // orbit control setup
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enablePan = false

    // earth geometry
    const earthGeometry = new THREE.SphereGeometry(0.6, 32, 32);

    // earth material
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: texture.load('texture/earthmap1k.jpg'),
      bumpMap: texture.load('texture/earthbump.jpg'),
      bumpScale: 0.3
    });

    // earth mesh
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    this.scene.add(earthMesh);

    // cloud Geometry
    const cloudGeometry = new THREE.SphereGeometry(0.63, 32, 32);

    // cloud metarial
    const cloudMetarial = new THREE.MeshPhongMaterial({
      map: texture.load('texture/earthCloud.png'),
      transparent: true,
    });

    // cloud mesh
    const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMetarial);
    this.scene.add(cloudMesh);

    // galaxy geometry
    const starGeometry = new THREE.SphereGeometry(80, 64, 64);

    // galaxy material
    const starMaterial = new THREE.MeshBasicMaterial({
      map: texture.load('texture/galaxy.png'),
      side: THREE.BackSide
    });

    // galaxy mesh
    const starMesh = new THREE.Mesh(starGeometry, starMaterial);
    this.scene.add(starMesh);

    // ambient light
    const ambientlight = new THREE.AmbientLight(0xffffff, 0.2);
    this.scene.add(ambientlight);

    // point light
    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.set(5, 3, 5);
    this.scene.add(pointLight);

    // point light helper
    const Helper = new THREE.PointLightHelper(pointLight);
    // scene.add(Helper);

    // handling resizing
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      render();
    }, false);

    // spinning animation
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();

      render();
    };

    // rendering
    const render = () => {
      this.renderer.render(this.scene, this.camera);
    }

    animate();
  }

}


const texture = new THREE.TextureLoader()

// camera setup
const fov = 60;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;

export function createScene(canvas) {
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;
  scene.add(camera);

  // renderer setup
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio((window.devicePixelRatio) ? window.devicePixelRatio : 1);
  renderer.autoClear = false;
  renderer.setClearColor(0x000000, 0.0);

  // orbit control setup
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false

  // earth geometry
  const earthGeometry = new THREE.SphereGeometry(0.6, 32, 32);

  // earth material
  const earthMaterial = new THREE.MeshPhongMaterial({
    roughness: 1,
    metalness: 0,
    map: texture.load('texture/earthmap1k.jpg'),
    bumpMap: texture.load('texture/earthbump.jpg'),
    bumpScale: 0.3
  });

  // earth mesh
  const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
  scene.add(earthMesh);

  // cloud Geometry
  const cloudGeometry = new THREE.SphereGeometry(0.63, 32, 32);

  // cloud metarial
  const cloudMetarial = new THREE.MeshPhongMaterial({
    map: texture.load('texture/earthCloud.png'),
    transparent: true,
  });

  // cloud mesh
  const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMetarial);
  scene.add(cloudMesh);

  // galaxy geometry
  const starGeometry = new THREE.SphereGeometry(80, 64, 64);

  // galaxy material
  const starMaterial = new THREE.MeshBasicMaterial({
    map: texture.load('texture/galaxy.png'),
    side: THREE.BackSide
  });

  // galaxy mesh
  const starMesh = new THREE.Mesh(starGeometry, starMaterial);
  scene.add(starMesh);

  // ambient light
  const ambientlight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientlight);

  // point light
  const pointLight = new THREE.PointLight(0xffffff, 1)
  pointLight.position.set(5, 3, 5);
  scene.add(pointLight);

  // point light helper
  const Helper = new THREE.PointLightHelper(pointLight);
  // scene.add(Helper);

  // handling resizing
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
  }, false);

  // spinning animation
  const animate = () => {
    requestAnimationFrame(animate);
    controls.update();

    render();
  };

  // rendering
  const render = () => {
    renderer.render(scene, camera);
  }

  animate();

  return scene;
}