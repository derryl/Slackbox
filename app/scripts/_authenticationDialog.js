
// Authentication dialog box
define(['views'], function( View ) {

    function AuthBox( el, data ) {
        return View.call( this, el, data );
    }

    // AuthBox extends the base View class
    AuthBox.prototype = Object.create( View.prototype );
    
    // No customizations here, hide/show is all we need
    return( AuthBox );
});