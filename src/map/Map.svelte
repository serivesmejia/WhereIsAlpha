<script>
    import { onMount } from "svelte";
    import { iss_icon, location_circle_icon } from "./icons.js";

    import * as TLE from "tle.js";

    import L from "leaflet";

    export let rendererManager;
    export let positionRequester;
    let positionRequesterListener;

    let map;
    let renderer;

    export let date = new Date(Date.now())
    export let lat = 0
    export let lng = 0

    export let onOrbitCalculate
    
    const issIcon = L.divIcon({
        html: iss_icon,
        iconAnchor: [30, 30]
    });
    const locationCircleIcon = L.divIcon({
        html: location_circle_icon,
        iconAnchor: [45, 45]
    });

    let orbitListener

    const issMarker = L.marker([0, 0], { icon: issIcon });
    const issPathPoly = L.polyline([], { color: "black" });
    
    const locationCircleMarker = L.marker([0, 0], { icon: locationCircleIcon });

    function createMap(container) {
        let m = L.map(container).setView([0, 0], 1);

        L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            noWrap: true
        }).addTo(m);

        return m;
    }

    function mapAction(container) {
        map = createMap(container)
            .setMinZoom(1.35).fitWorld()
            
        issPathPoly.addTo(map)
        locationCircleMarker.addTo(map)
        issMarker.addTo(map);

        return {
            destroy: () => {
                map.remove();
                map = null;
                rendererManager.removeChild(renderer)
                onOrbitCalculate.removeListener(orbitListener)
            },
        };
    }

    onMount(() => {
        renderer = rendererManager.addChild(() => {
            //let lat = positionRequester.last_position.latitude;
            //let lon = positionRequester.last_position.longitude;

            issMarker.setLatLng([lat, lng]);
        });

        window.navigator.geolocation
            .getCurrentPosition((data) => {
                locationCircleMarker.addTo(map)
                locationCircleMarker.setLatLng([data.coords.latitude, data.coords.longitude])
            }, (fail) => { 
                locationCircleMarker.remove()
            });

        orbitListener = onOrbitCalculate.addListener((threeOrbits) => {
            //let current_orbit = threeOrbits[1];
            issPathPoly.setLatLngs(onOrbitCalculate.context[1]);
        })
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
        top: 0%;
        left: 0;
        bottom: 0;
        right: 0;
        height: 100%;
        width: 100%;
    }
</style>
