<script>
    import { onMount } from 'svelte';
    import { GlobeScene } from "./globe_scene";
    import { ISS } from "./iss";
    import * as THREE from 'three'
  
    let el;
    let renderer;

    let scene = new THREE.Scene()
  
    onMount(() => {
      // renderer setup
      renderer = new THREE.WebGLRenderer({
        canvas: el,
        antialias: true,
      });

      new GlobeScene(renderer, scene).setup()
      new ISS(scene).setup()
    });
</script>
  
<canvas bind:this={el}></canvas>