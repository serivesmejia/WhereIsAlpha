import { simpleEvent } from "./simpleEvent"
import * as TLE from "tle.js";

const tle_api = "https://tle.ivanstanojevic.me/api/tle/49044"

export class IssDataRequester {

    constructor(interval) {
        this.interval = interval
        this.last_tle = undefined
        this.latlong = [0, 0]
        this.last_lineone = ""
        this.last_linetwo = ""

        this.onTleReceive = simpleEvent(this)
    }

    start_fetching() {
        this.refresh_tle()

        this.scheduledInterval = setInterval(() => {
            this.refresh_tle()
        }, this.interval)
    }

    stop_fetching() {
        clearInterval(this.scheduledInterval)
    }

    refresh_tle() {
        fetch(tle_api)
            .then(out => out.json())
            .then(data => {
                this.last_tle = `${data.name}\n${data.line1}\n${data.line2}`
                this.last_lineone = data.line1
                this.last_linetwo = data.line2

                console.log(this.last_tle)
                this.onTleReceive.trigger()
            })
            .catch(err => { this.refresh_tle() });
    }

    current_position() {
        return this.latlong;
    }

    update_current_position() {
        if(this.last_tle == undefined) {
            this.latlong = [0, 0]
            return
        }
        this.latlong = TLE.getLatLngObj(this.last_tle)
    }

}