import { simpleEvent } from "./simpleEvent"

const iss_position_api = "http://api.open-notify.org/iss-now.json"
const tle_api = "https://tle.ivanstanojevic.me/api/tle/49044"

export class IssPositionRequester {

    constructor(interval) {
        this.interval = interval
        this.last_position = {
            latitude: 0,
            longitude: 0
        }
        this.last_tle = ""

        this.onPositionReceive = simpleEvent(this)
        this.onTleReceive = simpleEvent(this)

        this.last_update = Math.round(new Date().getTime() / 1000);
    }

    start_fetching() {
        this._recursive_fetch()
        this.refresh_tle()
    }

    refresh_tle() {
        fetch(tle_api)
            .then(out => out.text())
            .then(tles => {
                this.last_tle = ""
                
                let tles_lines = tles.split("\n")
                let iss_tle_start_index = -1
                for(let i = 0; i++; i < tles_lines.length) {
                    if(iss_tle_start_index == -1 && tles_lines[i].includes("ISS (ZARYA)")) {
                        iss_tle_start_index = i;
                    }

                    if(iss_tle_start_index >= i) {
                        if(i - iss_tle_start_index <= 2) {
                            this.last_tle += tles_lines[i]
                        } else break
                    }
                }

                console.log(this.last_tle)

                this.onTleReceive.trigger()
            })
            .catch(err => { this.refresh_tle() });
    }

    _recursive_fetch() {
        setTimeout(() => {
            fetch(iss_position_api)
                .then(res => res.json())
                .then(out => {
                    this.last_position = out.iss_position
                    this.last_update = out.timestamp;

                    this.onPositionReceive.trigger()

                    this._recursive_fetch()
                })
                .catch(err => { this._recursive_fetch() });
        }, this.interval)
    }

}