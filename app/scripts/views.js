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
            
            this.$el = $( $$.element );
            
            $$.isVisible = $( $$.element ).hasClass( 'hide' );
            
            if (!$$.events) $$.events = [];
            
            $$.listeners = new Listeners( this, $$.events );
            
            if (data) $$.render( data );
            
            return( $$ );
            // return this.initialize( el, data );
        }
        
        View.prototype = {
            
            events: [ ],
            
            render: function( data ) {
                var $$ = this;
                
                // If no data, do nothing
                if (!data || data.isEmpty()) return;

                // Either use the raw JSON, or use the 'data' object, if it exists
                $$.data = (data.data) ? data.data : data;
                
                // Bind the data to our element
                Bind( $$.element, $$.data );
                
                return $$;
            },
            
            bindListeners: function() {
                var $$ = this;
                if (!$$.events) return;
                if (!$$.listeners) $$.listeners = new Listeners( this, $$.events );
                
                return $$.listeners.bind();
            },
            
            unbindListeners: function() {
                var $$ = this;
                if (!$$.events) return;
                if (!$$.listeners) $$.listeners = new Listeners( this, $$.events );
                
                return $$.listeners.unbind();
            },
            
            show: function() {
                $hidden = false;
                return $( this.element ).removeClass('hide')
            },
            
            hide: function() {
                $hidden = true;
                return $( this.element ).addClass('hide');
            },
            
            isVisible: function() {
                return $( this.element ).hasClass('hide');
            },
            isHidden: function() {
                return !( this.isVisible() );
            }
        
        };
        
        // -------------------------------------------------- //
        // -------------------------------------------------- //
        
        return( View );
    }
);