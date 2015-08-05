
//  - DataBinder -
//
//  A naive and brittle (yet effective) DOM binding utility I wrote for this. 
//  It accepts a parent element, some data, and attempts
//  to bind the provided data to that parent's child nodes.

// Basic usage:
//    HTML:  <h1 data-text="username"></h1>
//    JS:    Bind( 'h1', { username: ' drryl ' })  --->  <h1 data-text="username"> drryl </h1>

//  TODO: Add the ability to re-bind data on "repeated" elements.
//        Presently, I can't modify the data, because I'm deleting the original element.

define( [], function() {
        
        function DataBinder( parent, data ) {
            
            // Make sure the subject is a Node element
            var el = (parent instanceof Node) ? parent : document.querySelector( parent );
            
            if (!el) return;

            // Get all the children
            var els = el.querySelectorAll('*');
            
            // Set a prefix for data-bindings (e.g. Angular uses "ng-", Rivets uses "rv-", etc.)
            var prefix = 'data-';
            
            // TODO: Remove the need for prefixed attributes, and just replace
            // anything we find... I'm not sure why I decided on this strict mapping system.
            var bindingMap = {},
                bindings = {
                    'text':  'innerHTML',
                    'html':  'innerHTML',
                    'bind':  'innerHTML',
                    'src':   'src',
                    'href':  'href',
                    'value': 'value',
                    'title': 'title',
                    'background': 'style|background-image: url("{item}")'
                };
            
            // Using our prefix and supplied bindings ^ create a 'bindingMap'
            // to detect bindable attributes on DOM elements.
            Object.keys( bindings ).forEach( function(b) {
                bindingMap[ prefix + b ] = bindings[b];
            });
            
            // Check if an element has attributes
            function getBindableAttributes( el ) {
                if (!el || !el.attributes) return;
                
                var attrs = el.attributes,
                    attributeMap = [];
                    
                if (attrs.length > 0) {
                    attributeMap = [].map.call( attrs, function( attr ) {
                        return attr.name
                    }).filter( function(item) {
                        return item.indexOf( prefix ) === 0;
                    });
                }
                
                return attributeMap;
            };
            
            
            // Attempt to insert data, if the requested item exists
                // TODO: add support for pre-loading <img> tags
                // (wait for image to load before applying the binding)
            function applyBinding( el, bindType ) {
                
                if (!bindType) return;
                
                // Get the requested datum's name (e.g. "user.username")
                var b = el.getAttribute( bindType );
                // console.log(b);
                
                // Then fetch it, if possible (e.g. "Derryl")
                if (b && deep( data, b )) {
                    
                    // Check to see if we can bind this data directly ( e.g. Node.src )
                    if (bindingMap[bindType]) {
                        
                        el[bindingMap[bindType]] = deep(data, b);
                        // console.log(el[bindingMap[bindType]]);
                    
                    // Otherwise, just attach it as a [data-*] attribute.
                    } else {
                        var dataName = bindType.split( prefix ).join('');
                        el.dataset[ dataName ] = deep( data, b );
                    }
                
                // Last-minute hack: allow replacement of attributes like:
                //      data-href="http://www.foo.com/{data}" 
                // TODO: Improve the entire module to functione more like this
                } else if (/{([^{}]*)}/i.test(b)) {
                    
                    el[bindingMap[bindType]] = b.supplant( data );
                    
                }
            };
            
            
            // Iterate over child nodes, and attempt to insert data
            // according to their bindings (e.g. 'data-text' -> replaces innerHTML)
            for (var i = 0; i < els.length; i++) {
                
                // Get the current Node
                var el = els[i], repeater;
                
                // This function supports Angular-style iteration:
                //     e.g  <span data-repeat="photo in photos"> ... </span>
                //
                // In these cases, we duplicate the element the correct # of times,
                // bind data to those new elements, and then delete the original.
                
                // TODO: Fix this so it's possible to bind more than once.
                if (repeater = el.getAttribute( prefix+'repeat' )) {
                    
                    // Parse the "<item> in <collection>" instructions
                    var rep = repeater.split(' in ');
                    
                    try {
                        
                        var itemTitle  = rep[0],       // -> 'item'
                            collection = data[rep[1]]; // -> 'collection'
                        
                        if (!collection) collection = data;
                        
                        // Iterate over the collection,
                        // creating a duplicate Node for each item
                        [].map.call( collection, function( data, i ) {
                            
                            // Clone the original Node
                            var clone = el.cloneNode( true );
                            
                            // Remove the repeater. Otherwise it'd recur infinitely.
                            clone.removeAttribute( prefix+'repeat' );
                                
                            var newItem = el.parentNode.appendChild( clone ),
                                itemData = {};
                            
                            // Prepare a custom data object for each cloned Node,
                            //--> { 'item': ... }
                            itemData[ itemTitle ] = data;
                            
                            // Back to our regularly scheduled binding.
                            DataBinder( newItem, itemData );
                        });
                        
                        // Get rid of the original Node.
                        el.parentNode.removeChild( el );
                        
                    } catch(e) { log(e) }
                }
                
                // Get a list of all the bindable attributes on this element
                //--> [ 'data-src', ... , 'data-alt' ]
                var bindables = getBindableAttributes( el );

                // Iterate over each binding and apply the data
                bindables.forEach( function( binding ) {
                    applyBinding( el, binding );
                });
                
            };
            
            return data;
        };
        
        return( DataBinder );
    }
);