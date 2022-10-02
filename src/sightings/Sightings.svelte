<script>
    import { onMount } from "svelte";

    export let onOrbitCalculate;
    export let date;
			
    export let positionRequester

	import * as TLE from "tle.js";

    //This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
    function calcCrow(lat1, lon1, lat2, lon2) 
    {
      var R = 6371; // km
      var dLat = toRad(lat2-lat1);
      var dLon = toRad(lon2-lon1);
      var lat1 = toRad(lat1);
      var lat2 = toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      return d;
    }

    // Converts numeric degrees to radians
    function toRad(Value) 
    {
        return Value * Math.PI / 180;
    }

    onMount(() => {
        onOrbitCalculate.addListener(() => {
            window.navigator.geolocation
                .getCurrentPosition((data) => {
                    let sightings = []
                    let startMs = TLE.getLastAntemeridianCrossingTimeMS(positionRequester.last_tle, date)

                    for(let [i, latlon] of onOrbitCalculate.context[1].entries()) {
                        let ms = startMs + (i + 1) * 500

                        if(calcCrow(latlon[0], latlon[1], data.coords.latitude, data.coords.longitude) < 3) {
                            sightings.push({date: new Date(ms), latitude: latlon[0], longitude: latlon[1]})
                        }
                    }
                    
                    for(let [i, latlon] of onOrbitCalculate.context[2].entries()) {
                        let ms = startMs + (i + 1) * 500

                        if(calcCrow(latlon[0], latlon[1], data.coords.latitude, data.coords.longitude) < 3) {
                            sightings.push({date: new Date(ms), latitude: latlon[0], longitude: latlon[1]})
                        }
                    }
            }, (fail) => { });
        });
    });
</script>

<div
    style="margin-top: 5%; display:inline-block; border: 1px solid #CCC; border-radius: 6px; -webkit-border-radius: 6px; -o-border-radius: 6px; position: relative; overflow: hidden; width: 310px; height: 450px;"
>
    <iframe
        src="https://spotthestation.nasa.gov/widget/widget.cfm?country=Mexico&region=None&city=Chihuahua&theme=2"
        width="310"
        height="450"
        frameborder="0"
    />
</div>
