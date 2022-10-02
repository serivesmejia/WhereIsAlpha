import * as THREE from 'three'
import { calculate_position_from } from './util';


const texture = new THREE.TextureLoader()

function getDayOfYear(epoch) {
  var d = new Date();
  d.setTime(epoch * 3600 * 24 * 1000);
  var y = d.getUTCFullYear();
  var d2 = new Date(Date.UTC(y, 0, 1));
  return ((d.getTime() - d2.getTime()) / (1000 * 3600 * 24));
}

const TIMCON = 3600 * 24 * 1000

function calculateSunPosition() {
    var Now = new Date();
    let epoch = Now.getTime() / TIMCON;

    var MAR21 = (31 + 28.25 + 21) * 1.0;
    var Days = getDayOfYear(epoch);
    var DayPart = Days - Math.floor(Days); 

    return {
      latitude: (23.5 * Math.PI / 180) * Math.sin(Math.PI * 2 / 365.25 * (Days - MAR21)),
      longitude: Math.PI * (1 - 2 * DayPart) 
    }
}

export class Globe {

  constructor(camera, sphere_radius) {
    this.camera = camera
    this.sphere_radius = sphere_radius
    
    this.pointLight = new THREE.PointLight(0xffffff, 1)
  
    this.allow_rendering = false
  }

  setup(scene) {
    this.camera.position.z = 2;
    scene.add(this.camera);

    // earth geometry
    const earthGeometry = new THREE.SphereGeometry(this.sphere_radius, 32, 32);

    // earth material
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: texture.load('texture/earthmap1k.jpg'),
      bumpMap: texture.load('texture/earthbump.jpg'),
      bumpScale: 0.3
    });

    // earth mesh
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthMesh.rotateY(THREE.MathUtils.degToRad(-87))
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
    scene.add(this.pointLight);

    // point light helper
    const Helper = new THREE.PointLightHelper(this.pointLight);
    // scene.add(Helper);

    // handling resizing
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    }, false);

    this.allow_rendering = true
  }

  render() {
    let sun_latlon = calculateSunPosition()
    let sun_pos = calculate_position_from(sun_latlon.latitude, sun_latlon.longitude, 9, this.sphere_radius)

    this.pointLight.position.set(sun_pos.x, sun_pos.y, sun_pos.z)
  }

}