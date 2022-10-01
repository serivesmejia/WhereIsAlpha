export const simpleEvent = (context = null) => {
    let cbs = [];
    return {
        addListener: (cb) => { 
            cbs.push(cb); 
            return cb; 
        },
        removeListener: (cb) => { let i = cbs.indexOf(cb); cbs.splice(i, 1); },
        trigger: ((((...args) => cbs.forEach(cb => cb.apply(context, args)))))
    };
};
