<script>
	import { onMount } from "svelte";

	import Globe from "./globe/Globe.svelte";
	import TimelineSlider from "./TimelineSlider.svelte";
	import Map from "./map/Map.svelte";
	import IssModules from "./modules/IssModules.svelte";
	import Sightings from "./sightings/Sightings.svelte";

	import { IssDataRequester } from "./iss_position_requester";
	import { RendererManager } from "./renderer";

	import * as TLE from "tle.js";

	import { Tabs, Tab, TabList, TabPanel } from "svelte-tabs";

	const iss_position_requester = new IssDataRequester(2 * 60 * 1000);
	iss_position_requester.start_fetching();

	const rendererManager = new RendererManager();

	let date = new Date(Date.now());

	let lat = 0;
	let lng = 0;

	let showTimeline = true;

	rendererManager.addChild(() => {
		date = new Date(Date.now() + displacement * 60 * 60 * 1000);
		let current_position = TLE.getLatLngObj(
			iss_position_requester.last_tle,
			date
		);

		lat = current_position.lat;
		lng = current_position.lng;
	});

	var displacement;

	onMount(() => {
		rendererManager.start();
	});

	function modulesHandler(container) {
		showTimeline = false;
		return {
			destroy: () => {
				showTimeline = true;
			},
		};
	}
</script>

<div
	style="position: relative;"
>
	<img src="ico_whereisalpha.png" style="width: 10%; position: absolute; top: 0px; right: 0px; z-index: 99999999;" />
</div>

<div class="holder">
	<div class="body">
		<Tabs>
			<div
				style="position: fixed; top: 0; z-index: 999999; background-color: white; margin-top: 1.3%; margin-left: 3.5%"
			>
				<TabList>
					<Tab>3D</Tab>
					<Tab>2D Map</Tab>
					<Tab>ISS Modules</Tab>
					<Tab>Sightings</Tab>
				</TabList>
			</div>

			<TabPanel>
				<Globe
					{date}
					{rendererManager}
					positionRequester={iss_position_requester}
				/>
			</TabPanel>

			<TabPanel>
				<Map
					{rendererManager}
					{lat}
					{lng}
					{date}
					positionRequester={iss_position_requester}
				/>
			</TabPanel>

			<TabPanel>
				<span use:modulesHandler />
				<IssModules {rendererManager} />
			</TabPanel>

			<TabPanel>
				<span use:modulesHandler />
				<Sightings />
			</TabPanel>
		</Tabs>
	</div>

	{#if showTimeline}
		<footer>
			<TimelineSlider {lat} {lng} bind:displacement />
		</footer>
	{/if}
</div>

<style>
	.body {
		padding-bottom: 100px; /* height of footer */
	}

	footer {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		margin-top: 58vh;

		background-color: rgba(200, 200, 200, 200);
	}
</style>
