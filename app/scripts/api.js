define( function() {

    var API = function() {
        
        var $$ = this;

        // Make an API request. Note: I'm appending the response
        // as a <script> tag to circumvent CORS issues.
        $$.get = function( args ) {
            var that = this;
            
            if (!args) return;
            if (!args.scheme) return;
            if (!args.cb) args.cb = "responseHandler";
            
            var url = that.constructURL( args );
            
            var scriptTag = document.createElement('script');
                scriptTag.setAttribute( 'src', url );
                
            document.getElementsByTagName("head")[0].appendChild( scriptTag );
        };
        
        // Loads an API fixture (for faster development)
        $$.getFixture = function( url, cb ) {
            
            return new Promise( function( resolve, reject) {

                var req = new XMLHttpRequest(),
                    cb  = cb || emptyFunc;
                
                req.open( 'get', url, true );
                
                req.onreadystatechange = function() {
                    
                    if ( req.readyState === 4 ) {
                        
                        if (req.status === 200)
                            resolve( JSON.parse(req.responseText) );
                        else
                            reject('Request failed');
                    }
                };
                
                req.send();
                
                // return req;
                
            });
        };
        
        // Fetch an Instagram user's feed based on ID
        $$.getUserFeed = function( id ) {
            var scheme = "/users/{user_id}/media/recent";
            return $$.get({ scheme: scheme, user_id: id });
        };
        
        // Fetch an Instagram user's metadata (profile info) based on ID
        $$.getUserInfo = function( id ) {
            var scheme = "/users/{user_id}";
            return $$.get({ scheme: scheme, user_id: id });
        };
        
        // Constructs an Instagram API request from the provided arguments
        $$.constructURL = function( args ) {
        
            var args = args || arguments[0] || {};
            
            if (!args || !args.scheme)
                return;
            
            if (!args.cb) 
                args.cb = "emptyFunc";

            args.base    = "https://api.instagram.com/v1";
            args.token   = $$.token;
            args.request = args.scheme.supplant(args);
            
            return("{base}{request}?access_token={token}&callback={cb}".supplant( args ));
        };
        
        // Retrieves the current API access_token
        $$.getToken = function() {
            
            // Try to grab it from the URL (if we've just authorized the app)
            var hash = window.location.hash;
            
            // Otherwise try to grab it from localStorage
            if ( !hash || hash === '' ) {
                hash = localStorage.getItem('access_token');
                if ( hash === 'undefined' ) hash = null;
            }
            
            // Otherwise ask the user to authenticate,
            // which results in a fresh access_token
            if ( !hash ) $$.ui.showAuthBox();
            
            return hash;
        }
        
        // Store an access_token so we can re-use it (until it expires)
        $$.setToken = function( token ) {
            
            if (!token) $$.ui.showAuthBox();
            
            localStorage.setItem( 'access_token', token );
            
            return ( $$.token = token || null );
        };
        
        $$.init = function( ui ) {
            $$.ui = ui;
            return $$;
        }
        
        return $$;
    };
    
    return API;
    
});