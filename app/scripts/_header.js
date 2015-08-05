
// Header View
define(['views','binding'], function( View, Bind ) {

    function HeaderView( el, data ) {
        return View.call( this, el, data );
    }

    // HeaderView extends the base View class
    HeaderView.prototype = Object.create( View.prototype );
    
    HeaderView.prototype.render = function(data) {
        var $$ = this;
        
        if (!data) return;
        if (data.data) data = data.data;
        
        $$.data = data;
        
        // Add commas to things like "followers", etc.
        // ..... Not necessary if we're viewing my profile :-P
        [].map.call( Object.keys($$.data.counts) , function( count ) {
            $$.data.counts[count] = $$.data.counts[count].commafy();
        });
        
        
        Bind( $$.element, $$.data );
        
        $$.bindListeners();
        
        return $$;
    };
    
    // No customizations here, Bind() is all we need
    return( HeaderView );
});