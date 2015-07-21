define([
        '$',
        'utilities',
        'api',
        'binding',
        'emoji',
        'views'
    ], 
    function( $, Utils, API, DataBinder, emoji, View ) {
    
        var config = {
            USE_FIXTURES:       true,
            DEFAULT_USER_ID:    11025817,
            ALLOW_CAT_PHOTOS:   true,
            ALLOW_SELFIES:      false
        };
            
        var initialize = function() {
            
            var app = new View( '#container' );
            
            var api = new API();
            
            if ( config.USE_FIXTURES === true ) {
                api.getFixture( '/fixtures/drryl-user.json', app.render );
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