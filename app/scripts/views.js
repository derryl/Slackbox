
define(
    [
        '$',
        'binding'
    ], 
    function( $, Bind ) {
        
        function View( element, data ) {
            var $$ = this;
            return this.initialize( element, data );
        }
        
        View.prototype = {
            
            // All views are initialized with a parent element
            initialize: function( el, data ) {
                
                var $$ = this;
                
                $$.element = (el instanceof Node) ? el : document.querySelector( el );
                
                if (data) $$.render( data );
                
                return $$;
            },
            
            
            listeners: [],
            
            
            render: function( data ) {
                
                var $$ = this;
                
                if (!data) return;
                
                log(data);
                
                $$.data = data;
                
                log( 'binding',$$.data,'to',this.element);
                
                Bind( $$.element, $$.data );
                
                return $$;
            }
        
        };
        
        // -------------------------------------------------- //
        // -------------------------------------------------- //
        
        return( View );
    }
);