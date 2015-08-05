// Searching for new users
define(['$','binding','Views'], function( $, Bind, View ) {

    function SearchBox( el ) {
        
        var $$ = this;
        
        View.call( $$, el, {} );
        
        return $$;
    }

    // SearchBox extends the base View class
    SearchBox.prototype = Object.create( View.prototype );
    
    return( SearchBox );
});