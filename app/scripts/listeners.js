define( function() {
        
        function Listeners( view, events ) {
            this.view = view;
            this.events = events;
            return this;
        };
        
        Listeners.prototype = {
            
            // Add a new listener
            add: function( listener ) {
                return( this.events.push( listener ) );
            },
            
            // Remove a listener
            remove: function( listener ) {
                
            },
            
            // Clear all listeners
            clear: function() {
                return( this.events = new Array() );
            },
            
            iterate: function( events, action ) {
                var $$ = this;
                
                events = events || $$.events;
                action = action || 'bind';

                events.forEach( function( l ) {
                    
                    var targets = l[0];
                    if (typeof targets === 'string') targets = $$.view.element.querySelectorAll( targets );
                    if (targets instanceof Node) targets = [ targets ];
                    
                    var eventType    = l[1],
                        eventHandler = l[2];
                    
                    [].map.call( targets, function( target ) {
                        
                        try {
                            if ( action === 'bind' ) {
                                // log('binding',eventHandler,'to',target);
                                target.addEventListener( eventType, function(e) { $$.view[eventHandler](e) });
                            } else {
                                target.removeEventListener( eventType, function(e) { $$.view[eventHandler](e) });
                            }
                        } 
                        catch(e) { 
                            console.error(e);
                        }
                    })
                });
                
                return $$;
            },
            
            // Activate all listeners (e.g. when we show the lightbox)
            bind: function( events ) {
                return this.iterate( events, 'bind' );
            },
            
            // Destroy all listeners (e.g. when we hide the lightbox)
            unbind: function( events ) {
                return this.iterate( events, 'unbind' );
            }
            
        }
        
        return( Listeners );
        
    }
);
