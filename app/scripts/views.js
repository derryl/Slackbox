//
//  Generic View module
//
define(
    [
        '$',
        'binding',
        'listeners'
    ], 
    function( $, Bind, Listeners ) {
        
        function View( el, data ) {
            
            this.element = (el instanceof Node) ? el : document.querySelector( el );
            
            // log(el)
            
            if (this.events && this.events.length > 0) {
                this.listeners = new Listeners( this.events );
            }
            
            if (data) this.render( data );
            
            return( this );
            // return this.initialize( el, data );
        }
        
        View.prototype = {
            
            events: [ ],
            
            // All views are initialized with a parent element
            initialize: function( el, data ) {
                var $$ = this;
                
                // Register our parent element (and make sure it's a 'Node')
                $$.element = (el instanceof Node) ? el : document.querySelector( el );
                
                // Setup our listeners
                if ($$.events && $$.events.length > 0) {
                    $$.listeners = new Listeners( $$.events );
                }
                
                // If we've got data, show it
                if (data) $$.render( data );
                
                return $$;
            },
            
            render: function( data ) {
                var $$ = this;
                
                if (!data) return;
                
                $$.data = data;
                // log(data);
                
                Bind( $$.element, $$.data );
                // log( 'binding data to', $$.element );
                
                return $$;
            },
            
            
        
        };
        
        // -------------------------------------------------- //
        // -------------------------------------------------- //
        
        return( View );
    }
);