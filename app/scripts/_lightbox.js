// Gallery View
define(['$','binding','views'], function( $, Bind, View ) {

    function LightboxView( el, data ) {
        
        var $$ = this;
        
        $$.events = [
            [ document.body, 'keyup', 'keyHandler' ]
        ];
        
        View.call( $$, el, data );
        
        var $el = $($$.element),
            $canvas = $$.element.querySelector('.lb-photo'),
            $index  = 1,
            $hidden = true;
        
        $$.viewPhoto = function( index ) {
            index = index || $index;
            var photo = $$.getPhoto(index);
            Bind( $canvas, { photo: photo } );
            if ($hidden === true) {
                $el.removeClass('hidden');
                $$.bindListeners();
                $hidden = false;
            }
            return index;
        };
        
        $$.getPhoto = function( index ) {
            index = index || $index;
            var pic = this.photos.filter( function(photo) { return (photo.index == index) });
            return (pic.length > 0) ? pic[0] : undefined;
        };
        
        $$.nextPhoto = function() {
            if ($index < this.photos.length) $index++;
            else $index = 1;
            return $$.viewPhoto( $index );
        };
        
        $$.prevPhoto = function() {
            if ($index > 1) $index--;
            else $index = this.photos.length;
            return $$.viewPhoto( $index );
        };
        
        $$.updatePhotos = function( data ) {
            $$.photos = data;
        };
        
        $$.hide = function() {
            $$.unbindListeners();
            $el.addClass('hidden');
            $hidden = true;
        };
        
        $$.keyHandler = function( e ) {
            var code = e.which;
            switch (e.which) {
                case 27: e.preventDefault(); return $$.hide();
                case 37: e.preventDefault(); return $$.prevPhoto();
                case 39: e.preventDefault(); return $$.nextPhoto();
                default: return;
            }
        };
        
        // this.lightbox = 
        
        return $$;
    }

    // LightboxView extends the base View class
    LightboxView.prototype = Object.create( View.prototype );
    
    // LightboxView.prototype.render = function(data) {
        
    //     // Bind( this.element, data );
        
    //     return this;
    //     // return View.render.call( this, data );
    // };
    // Nothing here yet, might add some other functionality
    // ....
    
    return( LightboxView );
    
});