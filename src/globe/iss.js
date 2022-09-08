import * as THREE from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Optional: Provide a DRACOLoader instance to decode compressed mesh data
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://raw.githubusercontent.com/mrdoob/three.js/b07310420fa0c1075daae13a787f8c7350ef3760/examples/js/libs/draco/');

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

export class ISS {

    constructor(scene) {
        this.scene = scene
    }

    setup() {
        // Load a glTF resource
        loader.loadAsync(
            // resource URL
            'model/ISS_stationary_draco.glb'
        ).then((model) => {
            model.scene.scale.set(0.0007, 0.0007, 0.0007)

            this.iss_scene = model.scene.clone()
            this.scene.add(this.iss_scene);

            render();
        })

        const clock = new THREE.Clock()

        const render = () => {
            requestAnimationFrame(render)

            //time tracking
            var delta = clock.getDelta();
            var elapsed = clock.elapsedTime;

            //satellite
            this.iss_scene.position.x = Math.sin(elapsed * 0.1) * 0.7;
            this.iss_scene.position.z = Math.cos(elapsed * 0.1) * 0.7;
            console.log(this.iss_scene.position)

            this.iss_scene.rotation.x += 0.4 * delta;
            this.iss_scene.rotation.y += 0.2 * delta;
        }
    }

}