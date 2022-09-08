<script>
    import { onMount } from 'svelte';
    import { GlobeScene } from "./globe_scene";
    import * as THREE from 'three'
  
    let el;
    let renderer;
  
    onMount(() => {
      // renderer setup
      renderer = new THREE.WebGLRenderer({
        canvas: el,
        antialias: true,
      });

      new GlobeScene(renderer).setup()
    });
</script>
  
<canvas bind:this={el}></canvas>