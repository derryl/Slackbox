// Gallery View
define(['views','binding','_lightbox'], function( View, Bind, Lightbox ) {

    function GalleryView( el, data ) {
        
        var $$ = this;
        
        // The Lightbox is a child of Gallery
        $$.lightbox = new Lightbox('#lightbox');
        
        // Pass-thru function to show a photo in Lightbox upon click
        $$.viewPhoto = function( e ) {
            return $$.lightbox.viewPhoto( e.target.dataset.index );
        };
        
        $$.events = [
            [ '.thumb', 'click', 'viewPhoto' ]
        ];
        
        return View.call( $$, el, data );
    }

    // GalleryView extends the base View class
    GalleryView.prototype = Object.create( View.prototype );
    
    // Note: I'm very displeased with the way I've approached the extension
    // of functions like 'render'. In a real-life situation, I'd make sure this
    // is actually inheriting from the parent, rather than naively overwriting
    // the whole damn thing, but .... "what are you gonna do?" **Tony Soprano voice**
    //                                     https://youtu.be/w6q_FgBJt4U?t=5s
    GalleryView.prototype.render = function(data) {
        var $$ = this;
        
        // No data? No party.
        if (!data) return;
        if (data.data) data = data.data;
        
        $$.data = data;
        
        // Give each photo an index, so our lightbox can increment ( next / prev )
        $$.data.forEach( function( photo, i ) {
            photo.index = (i + 1);
        });
        
        // Pass these new photos to our Lightbox view
        $$.lightbox.updatePhotos( $$.data );
        
        // Draw the thumbnails on-screen
        Bind( $$.element, $$.data );
        
        // Listen for clicks
        $$.bindListeners();
        
        return $$;
    };
    
    return( GalleryView );
});