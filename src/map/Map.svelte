<script>
    import { onMount } from "svelte";
    import { iss_icon } from "./iss_icon.js";

    import L from "leaflet";

    export let rendererManager;
    export let positionRequester;

    let map;

    const initialView = [39.8283, -98.5795];

    const issIcon = L.divIcon({
        html: iss_icon,
        className: "",
        iconSize: [10, 10],
        iconAnchor: [12, 40],
    });

    const issMarker = L.marker([0, 0], { icon: issIcon });

    function createMap(container) {
        let m = L.map(container).setView([0, 0], 1);
        
        L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(m);

        return m;
    }

    function mapAction(container) {
        map = createMap(container);

        return {
            destroy: () => {
                map.remove();
                map = null;
            },
        };
    }

    onMount(() => {
        positionRequester.onPositionReceive.addListener(() => {
            let lat = positionRequester.last_position.latitude;
            let lon = positionRequester.last_position.longitude;
            
            issMarker.addTo(map);

            issMarker.setLatLng([lat, lon]);
        });
    });
</script>

<link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
    integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
    crossorigin=""
/>

<div class="map" use:mapAction />

<style>
    .map {
        position: absolute;
        top: 8%;
        left: 0;
        bottom: 0;
        right: 0;
        height: 100%;
        width: 100%;
    }
</style>
