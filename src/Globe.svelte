<script>
    import planetaryjs from './lib/planetaryjs.min.js'
    import lakes from './lib/lakes.js'

    import { onMount } from "svelte"

    let canvas
    let planet = planetaryjs.planet();

    function setup() {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        setScreenRatioScale(128)
        setTranslate(canvas.width / 2, canvas.height / 2)
        planet.projection.translate([canvas.width / 2, canvas.height / 2]);
        setScreenRatioScale(60)
    }

    onMount(() => {
        planet.loadPlugin(planetaryjs.plugins.earth({
            topojson: {
                file: './world-110m-withlakes.json',
            },
            oceans:   { fill:   '#000080' },
            land:     { fill:   '#339966' },
            borders:  { stroke: '#008000' }
        }));

        planet.loadPlugin(lakes({
            fill: '#000080'
        }));
        
        planet.draw(canvas);

        window.addEventListener("resize", setup)
        setup()
    })

    function setScreenRatioScale(srScale) {
        planet.projection.scale((canvas.width / canvas.height) * srScale)
    }

    function setScale(scale) {
        planet.projection.scale(scale)
    }

    function setTranslate(x, y) {
        planet.projection.translate([x, y])
    }

    function setRotation(rotation) {
        planet.projection.rotate(rotation)
    }
</script>

<canvas id="fullscreen" bind:this="{canvas}"></canvas>