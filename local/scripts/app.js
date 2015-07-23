define([
        '$',
        'utilities',
        'api',
        'emoji',
        'views',
        '_header',
        '_gallery'
    ], 
    function( $, Utils, InstagramAPI, emoji, View, HeaderView, GalleryView ) {
    
        var config = {
            USE_FIXTURES:       true,
            DEFAULT_USER_ID:    11025817,
            ALLOW_CAT_PHOTOS:   true,
            ALLOW_SELFIES:      false
        };
            
        var initialize = function() {
            
            
            var API = new InstagramAPI(),
                // MyApp  = new View( '#container' ),
                Header  = new HeaderView( 'header' ),
                Gallery = new GalleryView( '#gallery' );
            
            if ( config.USE_FIXTURES === true ) {
                
                API.getFixture('/fixtures/drryl-user.json').then( function(data) { 
                    if (!data) return console.error('Problem fetching user data');
                    Header.render( data );
                });
                    
                API.getFixture('/fixtures/drryl-feed.json').then( function(data) { 
                    if (!data) return console.error('Problem fetching user feed');
                    Gallery.render( data.data );
                });
            }
            
            // window.app = new View( '#container', { username: 'Hello' });
            // var app2 = new View('body');
            
            // console.log(app1);
            // console.log(DataBinder)
            
            // DataBinder('.user-info', { username: 'Hello' });
            
            // app1.render();
            // app2.render();
            
        };

        return {
            initialize: initialize
        };
    }
);