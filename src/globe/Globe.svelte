<script>
  import { onMount } from "svelte";
  import { Globe } from "./globe_scene";
  import { ISS } from "./iss";
  
  import * as THREE from "three";
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

  // camera setup
  const fov = 60;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 1000;

  const globe_radius = 0.6;
  const iss_separation_from_earth = 0.2;

  let el;
  let renderer;
  let controls;

  export let rendererManager;

  export let positionRequester;

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
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.autoClear = false;
    renderer.setClearColor(0x000000, 0.0);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.maxZoom = 4
    controls.minZoom = 1
    controls.enablePan = false

    window.addEventListener("resize", () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

    let globe = new Globe(camera, globe_radius)
    globe.setup(scene);

    let iss = new ISS(globe_radius, positionRequester, iss_separation_from_earth)
    iss.setup(scene);

    rendererManager.addChild(globe)
    rendererManager.addChild(iss)
    
    rendererManager.addChild(render)
  });

  function render() {
    renderer.render(scene, camera);
    controls.update();
  }
</script>

<canvas bind:this={el} />
