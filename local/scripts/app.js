define([
        '$',
        'utilities',
        'api',
        'emoji',
        'Views',
        '_loader',
        '_header',
        '_gallery',
        '_authenticationDialog',
        '_search'
    ], function ( 
        $,
        Utils,
        InstagramAPI,
        emoji,
        View,
        PageLoader,
        HeaderView,
        GalleryView,
        AuthBox,
        SearchBox
    ) {
        
        function App( config ) {
            this.config = config;
            return this;
        }
        
        App.prototype = {
            
            initialize: function( user_id ) {
                
                var $$ = this;
                
                user_id = user_id || $$.config.DEFAULT_USER_ID;
                
                // All my children ...
                // $$.Loader  = new PageLoader( '.loader' );
                $$.AuthBox = new AuthBox( '#authBox' );
                $$.API     = new InstagramAPI({ app: $$, callbackPrefix: 'Lightbox.' });
                $$.Header  = new HeaderView( 'header' );
                $$.Gallery = new GalleryView( '#gallery' );
                // $$.SearchBox = new SearchBox( '#search' );
                
                // We need an API token to make requests.
                // These don't expire, but we check every time to be sure.
                if ( !$$.API.getToken() ) {
                    
                    $$.AuthBox.show();
                    return false;
                    
                } else {
                    
                    $$.load( user_id );
                    
                    // $$.API.getSearchResults( 'drryl', 'SearchBox.render' );
                }
                
                // Return a proper 'this'
                return( $$ );
            },
            
            // TODO: Fix the Gallery when this function is called more than once.
            // ( My naive 'ngRepeat' clone destroys itself after the first time it's
            //  bound, so we can't currently update the page
            //  with thumbnails from a new user. )
            
            // Otherwise, this function loads new users. Try it in the console:
            //  --->  Lightbox.load(11025817)
            load: function( user_id ) {
                var $$ = this;
                
                $$.AuthBox.hide();
                    
                $$.API.getUserInfo( user_id, 'Header.render' );
                    
                $$.API.getUserFeed( user_id, 'Gallery.render' );
                
                return $$;
            },
            
            ingest: function( data ) {
                log(data);
            }
            
        };
            
        // if ( config.USE_FIXTURES === true ) {
            
        //     API.getFixture('/fixtures/drryl-user.json').then( function(data) { 
        //         if (!data) return console.error('Problem fetching user data');
        //         Header.render( data );
        //     });
                
        //     API.getFixture('/fixtures/drryl-feed.json').then( function(data) { 
        //         if (!data) return console.error('Problem fetching user feed');
        //         Gallery.render( data.data );
        //     });
            
        // } else {
            
        // }

        return( App );
    }
);