<script>
    import { onMount } from "svelte";

	import Globe from "./globe/Globe.svelte";
	import Map from "./map/Map.svelte";

    import { IssDataRequester } from "./iss_position_requester";
    import { RendererManager } from "./renderer";
	
	import { Tabs, Tab, TabList, TabPanel } from 'svelte-tabs';

	const iss_position_requester = new IssDataRequester(2 * 60 * 1000)
    iss_position_requester.start_fetching()

	const rendererManager = new RendererManager()

	onMount(() => {
		rendererManager.start()
		rendererManager.addChild(() => {
            iss_position_requester.update_current_position()
		})
	})
</script>

<Tabs>
	<TabList>
		<Tab>3D</Tab>
		<Tab>2D Map</Tab>
	</TabList>

	<TabPanel>
		<Globe rendererManager={rendererManager} positionRequester={iss_position_requester}/>
	</TabPanel>

	<TabPanel>
		<Map rendererManager={rendererManager} positionRequester={iss_position_requester}/>
	</TabPanel>
</Tabs>