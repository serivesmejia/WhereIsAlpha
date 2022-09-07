<script>
    import { onMount } from 'svelte';
    import { createScene } from "./globe_scene";
  
    let el;
  
    onMount(() => {
      createScene(el)
    });
</script>
  
<canvas bind:this={el}></canvas>