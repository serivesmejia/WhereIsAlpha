<script>
    import { onMount } from 'svelte';
    import { GlobeScene } from "./globe_scene";
    import { ISS } from "./iss";
    import * as THREE from 'three'

    const globe_radius = 0.6
    const iss_separation_from_earth = 0.1
  
    let el;
    let renderer;

    let scene = new THREE.Scene()
  
    onMount(() => {
      // renderer setup
      renderer = new THREE.WebGLRenderer({
        canvas: el,
        antialias: true,
      });

      new GlobeScene(renderer, scene, globe_radius).setup()
      new ISS(scene, globe_radius, iss_separation_from_earth).setup()
    });
</script>
  
<canvas bind:this={el}></canvas>