
// Header View
define(['views'], function( View ) {

    function HeaderView( el, data ) {
        return View.call( this, el, data );
    }

    // HeaderView extends the base View class
    HeaderView.prototype = Object.create( View.prototype );
    
    // No customizations here, Bind() is all we need
    return( HeaderView );
});