window.deep = function(obj) {
        
    if (!obj) {
        return undefined;
    }
    
    // Fetch our list of arguments
    var args = Array.prototype.slice.call(arguments),
        obj = args.shift();
    
    // If no arguments supplied, return the parent object
    if (args.length < 1) {
        return obj;
    }
    
    // If arguments are supplied as a single, period-delimited string -- split them into an array
    if (args.length === 1) {
        args = args[0].split('.');
    }
        
    var len = args.length, i = 0;
    
    // Work our way down the object tree -- exiting safely if any node is undefined
    for (; i < len; i++) {
        
        // Exit if the next child doesn't exist
        if (!obj || !obj.hasOwnProperty(args[i])) return undefined;
        
        // Set `obj` to be the current child
        obj = obj[args[i]];
        
        // If we're on the last value, return it
        if (i === len - 1) return obj;
    }
};