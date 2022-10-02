<script>
    import { onMount } from "svelte";

    export let lat;
    export let lng;

    export let displacement = 0;

    let slider;

    function playback(value) {
        displacement = parseFloat(
            (((value - slider.max / 2) / (slider.max / 2)) * 24).toFixed(2)
        );
    }

    function sliderChange(e) {
        playback(e.target.value);
    }

    onMount(() => {
        slider.addEventListener("input", sliderChange);
    });

    function playbackToNow() {
        slider.value = slider.max / 2;
        playback(slider.value);
    }
</script>

<div class="overlay">
    <p>Latitude: {lat.toFixed(3)} Longitude: {lng.toFixed(3)}</p>
    <p>
        Playback: {displacement == 0
            ? "Now"
            : (displacement >= 0 ? "+" : "") +
              displacement.toFixed(0) +
              "h" +
              " " +
              Math.abs(Math.round((displacement % 1) * 60)) +
              "m"}
    </p>
    <button on:click={playbackToNow}>Playback to Now</button>
</div>
<input
    type="range"
    min="1"
    max="10000"
    value="5000"
    step="2"
    class="slider"
    bind:this={slider}
/>

<style>
    .overlay {
        z-index: 999999;
        background: rgba(200, 200, 200, 0.5);

        width: 75vm;
        text-align: center;
        margin-bottom: 2vh;
    }

    /* The slider itself */
    .slider {
        z-index: 999999;
        -webkit-appearance: none; /* Override default CSS styles */
        appearance: none;
        width: 100%; /* Full-width */
        height: 25px; /* Specified height */
        background: #d3d3d3; /* Grey background */
        outline: none; /* Remove outline */
        opacity: 0.5; /* Set transparency (for mouse-over effects on hover) */
        -webkit-transition: 0.2s; /* 0.2 seconds transition on hover */
        transition: opacity 0.2s;
    }

    input[type="range"] {
        -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
        width: 100%; /* Specific width is required for Firefox. */
        background: transparent; /* Otherwise white in Chrome */
    }

    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
    }

    input[type="range"]:focus {
        outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
    }

    input[type="range"]::-ms-track {
        width: 100%;
        cursor: pointer;

        /* Hides the slider so custom styles can be added */
        background: transparent;
        border-color: transparent;
        color: transparent;
    }

    /* Special styling for WebKit/Blink */
    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        border: 1px solid #000000;
        height: 36px;
        width: 16px;
        border-radius: 3px;
        background: #ffffff;
        cursor: pointer;
        margin-top: -14px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
        box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d; /* Add cool effects to your sliders! */
    }

    /* All the same stuff for Firefox */
    input[type="range"]::-moz-range-thumb {
        box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
        border: 1px solid #000000;
        height: 36px;
        width: 16px;
        border-radius: 3px;
        background: #ffffff;
        cursor: pointer;
    }

    /* All the same stuff for IE */
    input[type="range"]::-ms-thumb {
        box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
        border: 1px solid #000000;
        height: 36px;
        width: 16px;
        border-radius: 3px;
        background: #ffffff;
        cursor: pointer;
    }

    input[type="range"]::-webkit-slider-runnable-track {
        width: 100%;
        height: 8.4px;
        cursor: pointer;
        box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
        background: #3071a9;
        border-radius: 1.3px;
        border: 0.2px solid #010101;
    }

    input[type="range"]:focus::-webkit-slider-runnable-track {
        background: #367ebd;
    }

    input[type="range"]::-moz-range-track {
        width: 100%;
        height: 8.4px;
        cursor: pointer;
        box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
        background: #3071a9;
        border-radius: 1.3px;
        border: 0.2px solid #010101;
    }

    input[type="range"]::-ms-track {
        width: 100%;
        height: 8.4px;
        cursor: pointer;
        background: transparent;
        border-color: transparent;
        border-width: 16px 0;
        color: transparent;
    }
    input[type="range"]::-ms-fill-lower {
        background: #2a6495;
        border: 0.2px solid #010101;
        border-radius: 2.6px;
        box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    }
    input[type="range"]:focus::-ms-fill-lower {
        background: #3071a9;
    }
    input[type="range"]::-ms-fill-upper {
        background: #3071a9;
        border: 0.2px solid #010101;
        border-radius: 2.6px;
        box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    }
    input[type="range"]:focus::-ms-fill-upper {
        background: #367ebd;
    }
</style>
