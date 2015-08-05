// Gallery View
define(['$','binding','views'], function( $, Bind, View ) {

    function LightboxView( el, data ) {
        
        var $$ = this;
        
        // Click / keyboard events for the lightbox
        $$.events = [
            [ document.body, 'click', 'bodyClickHandler' ],
            [ document.body, 'keyup', 'keyHandler' ],
            [ '#nextPhoto',  'click', 'nextPhoto' ],
            [ '#prevPhoto',  'click', 'prevPhoto' ]
        ];
        
        View.call( $$, el, data );
        
        var $el     = $($$.element),
            $viewer = $$.element.querySelector('.viewer'),
            $canvas = $$.element.querySelector('.lb-photo'),
            $index  = 1,
            $hidden = true;
        
        $$.viewPhoto = function( index ) {
            
            if (!index) return;
            
            $index = index;
            
            // Lookup the photo for that index
            var photo = $$.getPhoto( $index );

            // Populate the lightbox with that photo's data
            Bind( $canvas, { photo: photo } );
            
            // Show the lightbox
            if ($hidden === true) {
                $el.removeClass('hide');
                setTimeout( function() { $hidden = false }, 5 );
            }
            
            return $index;
        };
        
        // Return metadata for the photo at 'index'
        $$.getPhoto = function( index ) {
            index = index || $index;
            var pic = this.photos.filter( function(photo) { return (photo.index == index) });
            return (pic.length > 0) ? pic[0] : undefined;
        };
        
        // Show the next photo
        $$.nextPhoto = function() {
            if ( $index < this.photos.length ) {
                $index++;
            } else {
                $index = 1;
            }
            
            return $$.viewPhoto( $index );
        };
        
        // Show the previous photo
        $$.prevPhoto = function() {
            if ( $index > 1 ) { 
                $index--;
            } else {
                $index = this.photos.length;
            }
            
            return $$.viewPhoto( $index );
        };
        
        // Pass new photos to the lightbox, post-instantiation
        $$.updatePhotos = function( data ) {
            $$.photos = data;
        };
        
        // Hide the lightbox
        $$.hideBox = function() {
            $$.hide();
            setTimeout( function() { $hidden = true }, 5 );
            $$.unbindListeners();
        };
        
        $$.keyHandler = function( e ) {
            if ($hidden) return false;
            var code = e.which;
            switch (e.which) {
                case 27: e.preventDefault(); return $$.hideBox();   // ESC
                case 37: e.preventDefault(); return $$.prevPhoto(); // <-
                case 39: e.preventDefault(); return $$.nextPhoto(); // ->
                default: return;
            }
        };
        
        $$.bodyClickHandler = function( e ) {
            if ($hidden) return false;
            
            var t = e.target;
            
            // Only hide lightbox if we've clicked somewhere outside of it
            if (t.isEqualNode( $viewer ) || t.isChildOf( $viewer )) {
                return false;
            }
            
            return $$.hideBox();
        };
        
        $$.bindListeners();
        
        return $$;
    }

    // LightboxView extends the base View class
    LightboxView.prototype = Object.create( View.prototype );
    
    return( LightboxView );
    
});