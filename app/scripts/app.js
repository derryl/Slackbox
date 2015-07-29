define([
        '$',
        'utilities',
        'api',
        'emoji',
        'views',
        '_header',
        '_gallery',
        '_authenticationDialog'
    ], 
    function( $, Utils, InstagramAPI, emoji, View, HeaderView, GalleryView, AuthBox ) {
        
        function App( config ) {
            
            this.config = config || { DEFAULT_USER_ID: 11025817 };
            
            window.Global = {
                provide: function(data) {
                    log(data);
                }
            };
            
            return this;
        }
        
        App.prototype = {
            
            initialize: function( ) {
                
                var $$ = this;
                
                // All my children ...
                $$.AuthBox = new AuthBox( '#authBox' );
                $$.API     = new InstagramAPI({ app: $$, callbackPrefix: 'Lightbox.' });
                $$.Header  = new HeaderView( 'header' );
                $$.Gallery = new GalleryView( '#gallery' );
                
                window.states = [];
                
                // We need an API token to make requests.
                // These don't expire, but we check every time to be sure.
                if ( !$$.API.getToken() ) {
                    
                    $$.AuthBox.show();
                    return false;
                    
                } else {
                    
                    $$.AuthBox.hide();
                    
                    $$.API.getUserInfo( $$.config.DEFAULT_USER_ID, 'Header.render' );
                    
                    $$.API.getUserFeed( $$.config.DEFAULT_USER_ID, 'Gallery.render' );
                    // var foo = function( x ) { log(x) };
                    // $$.API.getJSONP( 'foo' );
                    
                    // $$.search('foobar');
                    
                }
                
                // Return a proper 'this'
                return( $$ );
            },
            
            ingest: function( data ) {
                log(data);
            },
            
            loadUser: function( id ) {
                
            },
            
            // showAuthBox: function()
            
            search: function( q ) {
                var $$ = this;
                return $$.API.getSearchResults( q ).then( function(data) {
                    console.log( data );
                });
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