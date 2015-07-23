// Gallery View
define(['views','binding','_lightbox'], function( View, Bind, Lightbox ) {

    function GalleryView( el, data ) {
        
        var $$ = this;
        
        $$.lightbox = new Lightbox('#lightbox');
        
        $$.viewPhoto = function( e ) {
            return $$.lightbox.viewPhoto( e.target.dataset.index );
        };
        
        $$.events = [
            [ 'span.thumb', 'click', 'viewPhoto' ]
        ];
        
        return View.call( $$, el, data );
    }

    // GalleryView extends the base View class
    GalleryView.prototype = Object.create( View.prototype );
    
    GalleryView.prototype.render = function(data) {
        
        if (!data) return;
        
        data.forEach( function( photo, i ) {
            photo.index = (i + 1);
        });
        
        this.data = data;
        this.lightbox.updatePhotos( data );
        
        Bind( this.element, data );
        
        this.bindListeners();
        
        return this;
    };
    
    // Nothing here yet, might add some other functionality
    // ....
    
    return( GalleryView );
    
});