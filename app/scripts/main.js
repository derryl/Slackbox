require.config({
    paths: { lightboxr: 'app', $: 'dom' }
});


// This is the entry point for my application.
// All that I do here is provide a config and feed it into my main app.
require([
        '$',
    
        'lightboxr',  // <-- This is our main class (app.js)
        
        'utilities'   // <-- This file contains some hacks / mods to native functions,
                      //     and isn't directly referenced in my code  (utilities.js)
    ], 
    function( $, Lightboxr ) {
        
        this.$ = $;
        
        // Savvy viewers will note that: 'this' = 'Window' here.
        // This is critical for my JSONP implementation, which
        // feeds API responses into 'Window.Lightbox.someFunc' *
        this.Lightbox = new Lightboxr({
            USE_FIXTURES:       true,
            DEFAULT_USER_ID:    252953197,
            ALLOW_CAT_PHOTOS:   true,      // TODO: detect cat photos
            ALLOW_SELFIES:      false      // TODO: TL-Joint-Bayesian for detecting mirror selfies
        });
    
        return this.Lightbox.initialize(); // --> see 'App.prototype.initialize' (app.js)
    }
);

// * jQuery uses a similar approach to JSONP, although theirs is (obviously) far more robust.
//      https://github.com/jquery/jquery/blob/a2ae215d999637e8d9d0906abcbf6b1ca35c8e6e/src/ajax/jsonp.js#L61