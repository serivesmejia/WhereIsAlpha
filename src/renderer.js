export class RendererManager {

    constructor() {
        this.children = []
        this.stop_requested = false
    }

    start() {
        this.stop_requested = false

        this._render()
    }

    stop() {
        this.stop_requested = true
    }

    _render() {
        this.children.forEach((child) => {
            if(child == undefined) return
            if (child instanceof Function) {
                child()
            } else if (child.hasOwnProperty("allow_rendering") && child.allow_rendering != false) {
                child.render()
            } else if (!child.hasOwnProperty("allow_rendering")) child.render()
        })

        if (!this.stop_requested) requestAnimationFrame(() => this._render())
    }

    addChild(child) {
        return this.children.push(child)
    }

    removeChild(child_id) {
        this.children[child_id] = undefined
    }

}