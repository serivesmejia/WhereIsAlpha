export const simpleEvent = (context = null) => {
    let cbs = [];
    return {
        addListener: (cb) => { cbs.push(cb); },
        removeListener: (cb) => { let i = cbs.indexOf(cb); cbs.splice(i, Math.max(i, 0)); },
        trigger: ((((...args) => cbs.forEach(cb => cb.apply(context, args)))))
    };
};
