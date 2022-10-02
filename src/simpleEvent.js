class SimpleEvent {
    constructor(ctx) {
        this.context = ctx
        this.cbs = []
    }

    addListener(cb) { 
        this.cbs.push(cb); 
        return cb; 
    }
    removeListener(cb) { 
        let i = this.cbs.indexOf(cb);
        this.cbs.splice(i, 1); 
    }
    trigger(...args) { 
        this.cbs.forEach(cb => cb.apply(this.context, args))
    }
}

export const simpleEvent = (ctx = null) => new SimpleEvent(ctx)