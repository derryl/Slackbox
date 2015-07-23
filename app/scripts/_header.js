
// Header View
define(['views'], function( View ) {

    function HeaderView( el, data ) {
        return View.call( this, el, data );
    }

    // HeaderView extends the base View class
    HeaderView.prototype = Object.create( View.prototype );
    
    // Nothing here yet, might add some other functionality
    // ....
    
    return( HeaderView );
    
});