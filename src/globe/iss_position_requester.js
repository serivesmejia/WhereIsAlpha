import { simpleEvent } from "../simpleEvent"

const iss_position_api = "http://api.open-notify.org/iss-now.json"

export class IssPositionRequester {

    constructor(interval) {
        this.interval = interval
        this.last_position = {
            latitude: 0,
            longitude: 0
        }
        
        this.onPositionReceive = simpleEvent(this)

        this.last_update = Math.round(new Date().getTime() / 1000);
    }

    start_fetching() {
        this._recursive_fetch()
    }

    _recursive_fetch() {
        setTimeout(() => {
            fetch(iss_position_api)
                .then(res => res.json())
                .then(out => {
                    let before_position = this.last_position

                    this.last_position = out.iss_position

                    this.last_update = Math.round(new Date().getTime() / 1000);

                    this.onPositionReceive.trigger()

                    this._recursive_fetch()
                })
                .catch(err => { this._recursive_fetch() });
        }, this.interval)
    }

}