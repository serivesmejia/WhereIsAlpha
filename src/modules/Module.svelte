<script>
    import { onMount } from "svelte";
    import * as THREE from "three";
    import { OrbitControls } from "three/addons/controls/OrbitControls.js";
    import { LWOLoader } from "three/addons/loaders/LWOLoader.js";

    const loader = new LWOLoader();

    export let model;
    export let description;
    export let rendererManager;

    // camera setup
    const fov = 60;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 1000;

    let el;

    let renderer;
    let controls;
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    onMount(() => {
        // renderer setup
        renderer = new THREE.WebGLRenderer({
            canvas: el,
            antialias: true,
        });

        renderer.setPixelRatio(
            window.devicePixelRatio ? window.devicePixelRatio : 1
        );
        renderer.autoClear = false;
        renderer.setClearColor(0x000000, 0.0);

        controls = new OrbitControls(camera, renderer.domElement);
        controls.maxZoom = 4;
        controls.minZoom = 1;
        controls.enablePan = false;

        loader.load(model, function (object) {
            scene.add(object);
        });

        rendererManager.addChild(render);
    });

    function render() {
        renderer.render(scene, camera);
        controls.update();
    }
</script>

<div>
    <canvas class="scene" bind:this={el} />
</div>

<style>
    .scene {
        position: absolute;
        top: 0%;
        left: 0;
        bottom: 0;
        right: 0;
        height: 80%;
        width: 100%;
    }
</style>
