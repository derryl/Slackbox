//
//  - DataBinder -
//
//  A naive and brittle (yet effective) DOM binding utility. 
//  Accepts a parent element, some data, and attempts
//  to bind the provided data to that parent's child nodes.

define( [], function() {
        
        function DataBinder( parent, data ) {
        
            var el = (parent instanceof Node) ? parent : document.querySelector( parent );
            
            if (!el) return;

            var els = el.querySelectorAll('*'),
                prefix = 'data-';
            
            var bindingMap = {},
                bindings = {
                    'text':  'innerHTML',
                    'html':  'innerHTML',
                    'bind':  'innerHTML',
                    'src':   'src',
                    'href':  'href',
                    'value': 'value',
                    'background': 'style|background-image: url("{item}")'
                };
            
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
            function applyBinding( el, bindType ) {
                
                if (!bindType) return;
                
                // Get the requested datum's name (e.g. "user.username")
                var b = el.getAttribute( bindType );
                
                // Then fetch it, if possible (e.g. "Derryl")
                if (b && deep( data, b )) {
                    
                    // Check to see if we can bind this data directly ( e.g. Node.src )
                    if (bindingMap[bindType]) {
                        el[bindingMap[bindType]] = deep(data, b);
                    
                    // Otherwise, just attach it as a [data-*] attribute.
                    } else {
                        var dataName = bindType.split( prefix ).join('');
                        el.dataset[ dataName ] = deep( data, b );
                    }
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