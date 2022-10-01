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
            .then(out => out.json())
            .then(data => {
                this.last_tle = `${data.name}\n${data.line1}\n${data.line2}`
                

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