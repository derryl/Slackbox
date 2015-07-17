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



Node.prototype.isChildOf = function( parent ) {
    
    var target = this;
        
    function checkForParents( el, parentToFind, foundParents ) {
        
        // If this is our first run, grab the actual DOM Node
        // for our "parent" selector. Strings are no good!
        if (!(parentToFind instanceof Node)) {
            parentToFind = document.querySelector( parentToFind );
        }
        
        var isChild = false;
        
        // We've reached <html>, which has no parentElement.
        if (el.parentElement === null) {
            
            return el.isSameNode(parentToFind);
            
        } else {
            // Check if the current node is the parent we're looking for
            if (el.isSameNode(parentToFind)) return true;
            
            // If not, then keep looking
            foundParents.push( el );
            return checkForParents.call( this, el.parentElement, parentToFind, foundParents );
        }
    }
    
    return checkForParents( this, parent, [] );
}