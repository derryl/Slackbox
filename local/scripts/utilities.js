// Empty function. Used as a 'callback' when none is provided
var emptyFunc = function() { return; };

// Shorthand for console.log()
window.log = console.log.bind(console);

// String interpolation (courtesy of Douglas Crockford)
String.prototype.supplant = function (o) { return this.replace(/{([^{}]*)}/g, function (a, b) {var r = o[b]; return typeof r === 'string' || typeof r === 'number' ? r : a; } ); };
String.prototype.s = function (o) { return this.replace(/{([^{}]*)}/g, function (a, b) {var r = o[b]; return typeof r === 'string' || typeof r === 'number' ? r : a; } ); };

String.prototype.commafy = function () {
    return this.replace(/(^|[^\w.])(\d{4,})/g, function($0, $1, $2) {
        return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, "$&,");
    });
};

Number.prototype.commafy = function () {
    return String(this).commafy();
};

// deep() is one of my favorite tools.
// It allows safe retrieval of deeply-nested children from an object.
// Returns the requested item (if it exists), otherwise returns undefined,
// but without triggering an "Uncaught Type Error".
//  Usage: deep( item, 'deeply.nested.value' )
window.deep = function(obj) {
        
    if (!obj) return undefined;
    
    // Fetch our list of arguments
    var args = Array.prototype.slice.call(arguments),
        obj  = args.shift();
    
    // If no arguments supplied, return the parent object
    if (args.length < 1) 
        return obj;
    
    // If arguments are supplied as a single, period-delimited string -- split them into an array
    if (args.length === 1)
        args = args[0].split('.');
        
    var len = args.length, 
          i = 0;
    
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



// Useful. Should be part of the spec, but it's not.
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
};

Object.prototype.isEmpty = function() {
    return ( JSON.stringify(this) === JSON.stringify({}) );
};