import * as THREE from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { IssPositionRequester } from './iss_position_requester';

// Optional: Provide a DRACOLoader instance to decode compressed mesh data
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://raw.githubusercontent.com/mrdoob/three.js/b07310420fa0c1075daae13a787f8c7350ef3760/examples/js/libs/draco/');

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

const earth_r = 6378;

export class ISS {

    constructor(scene, sphere_radius, iss_separation_from_earth) {
        this.scene = scene
        this.sphere_radius = sphere_radius
        this.iss_separation_from_earth = iss_separation_from_earth

        this.iss_position_requester = new IssPositionRequester(5000)
        this.iss_position_requester.start_fetching()

        this.last_update = 0

        this.current_iss_position = new THREE.Vector3();
        this.current_iss_velocity = new THREE.Vector3();

        this.conversion = this.sphere_radius / earth_r
    }

    calculate_position_from(latitude, longitude) {
        let lat = THREE.MathUtils.degToRad(latitude)
        let lon = THREE.MathUtils.degToRad(longitude)

        let x = earth_r * Math.cos(lat) * Math.cos(lon)
        let y = earth_r * Math.cos(lat) * Math.sin(lon)
        let z = earth_r * Math.sin(lat)

        return new THREE.Vector3(
            y * this.conversion, 
            z * this.conversion, 
            x * this.conversion + (Math.sign(x) * this.iss_separation_from_earth)
        )
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

            this.iss_position_requester.onPositionReceive.addListener(() => {
                let last_pos = this.current_iss_position
                let current_time = (new Date().getTime() / 1000)
                let delta_time = current_time - this.last_update

                this.current_iss_position = this.calculate_position_from(
                    this.iss_position_requester.last_position.latitude, 
                    this.iss_position_requester.last_position.longitude
                )

                this.current_iss_velocity = this.current_iss_position.clone().sub(last_pos).divide(new THREE.Vector3(delta_time, delta_time, delta_time))
                
                this.iss_scene.position.set(this.current_iss_position.x, this.current_iss_position.y, this.current_iss_position.z)
                this.last_update = this.iss_position_requester.last_update
            })

            render();
        }).catch((err) => console.log(err))

        const clock = new THREE.Clock()

        const render = () => {
            requestAnimationFrame(render)

            //time tracking
            var delta = clock.getDelta();
            var elapsed = clock.elapsedTime;

            //satellite
            this.iss_scene.position.x += this.current_iss_velocity.x * delta
            this.iss_scene.position.y += this.current_iss_velocity.y * delta
            this.iss_scene.position.z += this.current_iss_velocity.z * delta

            // console.log(this.iss_scene.position)

            //this.iss_scene.rotation.x += 0.1 * delta;
            //this.iss_scene.rotation.y += 0.1 * delta;
        }
    }

}