// These configs aren't necessary. Might remove some of them
require.config({
    paths: {
        lightboxr: 'app',
        $: 'dom'
    }
});

require(
    [
        'lightboxr',  // This is our main class (app.js)
        'utilities'   // These are helper functions (utilities.js)
    ],
    
    function( Lightboxr ) {
        
        // Savvy viewers will note that: 'this' = Window
        // ( Not necessary to create a global, but I like it for debugging, etc. )
        this.Lightbox = new Lightboxr({
            USE_FIXTURES:       true,
            DEFAULT_USER_ID:    11025817,
            ALLOW_CAT_PHOTOS:   true,
            ALLOW_SELFIES:      false
        });
    
        return this.Lightbox.initialize(); // --> 'App.prototype.initialize' (app.js)
    }
);
