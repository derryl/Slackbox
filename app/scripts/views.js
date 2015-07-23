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
            
            var $$ = this;
            
            $$.element = (el instanceof Node) ? el : document.querySelector( el );
            
            if (!$$.events) $$.events = [];
            
            $$.listeners = new Listeners( this, $$.events );
            
            if (data) $$.render( data );
            
            return( $$ );
            // return this.initialize( el, data );
        }
        
        View.prototype = {
            
            events: [ ],
            
            // update: function( data, render ) {
            //     var $$ = this;
            //     if (!data) return;
            //     $$.data = data;
            //     return( (render) ? $$.render(data) : $$ );
            // },
            
            render: function( data ) {
                var $$ = this;
                
                if (!data) return;
                
                $$.data = data;
                
                Bind( $$.element, $$.data );
                
                return $$;
            },
            
            bindListeners: function() {
                var $$ = this;
                if (!$$.events) return;
                if (!$$.listeners) $$.listeners = new Listeners( this, $$.events );
                
                // log('binding listeners on', $$);
                return $$.listeners.bind();
            },
            
            unbindListeners: function() {
                var $$ = this;
                if (!$$.events) return;
                if (!$$.listeners) $$.listeners = new Listeners( this, $$.events );
                
                // log('binding listeners on', $$);
                return $$.listeners.unbind();
            }
        
        };
        
        // -------------------------------------------------- //
        // -------------------------------------------------- //
        
        return( View );
    }
);