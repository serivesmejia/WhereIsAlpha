import { simpleEvent } from '../simpleEvent.js';
import * as THREE from 'three'
import * as TLE from "tle.js";
import * as satellite from 'satellite.js'
import { project } from 'ecef-projector'

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { calculate_position_from, earth_r } from './util';

// Optional: Provide a DRACOLoader instance to decode compressed mesh data
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://raw.githubusercontent.com/mrdoob/three.js/b07310420fa0c1075daae13a787f8c7350ef3760/examples/js/libs/draco/');

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

const MS_IN_A_DAY = 86400000;

const texture = new THREE.TextureLoader()
const step = 500

let iss_model = undefined;

let iss_model_promise = loader.loadAsync(
    // resource URL
    'model/ISS_stationary_draco.glb'
).then((model) => { iss_model = model; return model })

export class ISS {

    constructor(sphere_radius, position_requester, date_provider, iss_separation_from_earth) {
        this.sphere_radius = sphere_radius
        this.iss_separation_from_earth = iss_separation_from_earth

        this.iss_position_requester = position_requester
        this.date_provider = date_provider

        this.last_update = 0

        this.current_iss_position = new THREE.Vector3();
        this.current_iss_velocity = new THREE.Vector3();
        this.allow_rendering = false

        this.conversion = this.sphere_radius / earth_r
        
        this.orbit_geometry = new THREE.BufferGeometry()//create a blue LineBasicMaterial
        const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
        this.orbit_line = new THREE.Line( this.orbit_geometry, material );

        this.onStart = simpleEvent()
    }

    setup(scene) {
        let start = (model, scene) => {
            model.scene.scale.set(0.0007, 0.0007, 0.0007)

            this.iss_scene = model.scene.clone()
            scene.add(this.iss_scene);

            scene.add(this.orbit_line)

            this.onStart.trigger()

            this.allow_rendering = true
        }

        if (iss_model != undefined) {
            start(iss_model, scene)
        } else {
            // Load a glTF resource
            iss_model_promise.then((model) => {
                start(model, scene)
                return model
            }).catch((err) => { throw err })
        }
    }

    render() {
        let dateObj = this.date_provider()

        //  Propagate satellite using time since epoch (in minutes).
        const positionAndVelocity = satellite.propagate(satellite.twoline2satrec(this.iss_position_requester.last_lineone, this.iss_position_requester.last_linetwo), dateObj)
        const positionEci = positionAndVelocity.position;

        const gmst = satellite.gstime(dateObj);
        const positionEcf = satellite.eciToEcf(positionEci, gmst);

        this.current_iss_position = new THREE.Vector3(
            positionEcf.y * this.conversion,
            positionEcf.z * this.conversion,
            positionEcf.x * this.conversion + (Math.sign(positionEcf.x) * this.iss_separation_from_earth)
        )

        // console.log(this.current_iss_position);

        this.iss_scene.position.set(this.current_iss_position.x, this.current_iss_position.y, this.current_iss_position.z)
    }

}