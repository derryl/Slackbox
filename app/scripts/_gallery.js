// Gallery View
define(['views'], function( View ) {

    function GalleryView( el, data ) {
        return View.call( this, el, data );
    }

    // GalleryView extends the base View class
    GalleryView.prototype = Object.create( View.prototype );
    
    // Nothing here yet, might add some other functionality
    // ....
    
    return( GalleryView );
    
});