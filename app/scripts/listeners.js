define( function() {
        
        function Listeners( events ) {
            log(events)
            return this.initialize( events );
        };
        
        Listeners.prototype = {
            
            initialize: function( events ) {
                
            },
            
            // Add a new listener
            add: function( listener ) {
                
            },
            
            // Remove a listener
            remove: function( listener ) {
                
            },
            
            // Clear all listeners
            clear: function() {
                
            },
            
            // Activate all listeners (e.g. when we show the lightbox)
            bind: function() {
                listeners.forEach( function(l) {
                    var target = ensureIsNode(l[0]),
                        eventType = l[1],
                        eventHandler = l[2];
                    try { target.addEventListener( eventType, eventHandler ) }
                    catch(e) { console.error(e) }
                });
            },
            
            // Destroy all listeners (e.g. when we hide the lightbox)
            unbind: function() {
                listeners.forEach( function(l) {
                    var target = ensureIsNode(l[0]),
                        eventType = l[1],
                        eventHandler = l[2];
                    try { target.removeEventListener( eventType, eventHandler ) }
                    catch(e) { console.error(e) }
                });
            }
            
        }
        
        return( Listeners );
        
    }
);
