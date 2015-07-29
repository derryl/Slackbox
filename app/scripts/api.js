define( function() {

    var API = function( config ) {
        
        var $$ = this;
        
        $$.app = ( config.app || window.Lightbox );
        $$.callbackPrefix = ( config.callbackPrefix || 'Lightbox.' );
        $$.defaultCallback = ( $$.callbackPrefix + 'ingest' );

        // Make an API request using JSONP
        $$.get = function( args ) {
            var $$ = this;
            
            return new Promise( function( resolve, reject ) {
                
                if (!args || !args.scheme) reject(); // return;
                
                // Get the full callback function (to wrap around our response)
                args.cb = $$.constructCallback(args.cb);
                
                var s = document.createElement('script');
                
                    s.async = true;
                    s.src = $$.constructURL( args );
                    
                    s.onreadystatechange = s.onload = function () {
                        if (this.readyState == 'complete')  resolve();
                    }
                    
                document.getElementsByTagName("head")[0].appendChild( s );
            });
        };
        
        // Creates the actual URL for our API request, 
        // including asset token and JSONP callback.
        $$.constructURL = function( args ) { 
        
            var $$ = this,
                request = '',
                args = ( args || arguments[0] || {} ),
                schemeContainsQuery = false;
            
            if (!args || !args.scheme) return;
            
            // ALL requests contain a query string (token + callback),
            // but some, like 'search', provide their own. We check for that here.
            schemeContainsQuery = /\?/.test(args.scheme);

            // Prepare the various pieces of our URL
            args.base    = "https://api.instagram.com/v1";
            args.token   = $$.token || $$.getToken();
            args.cb      = (args.cb) || $$.defaultCallback;
            args.request = args.scheme.supplant(args);
            
            // Build the URL
            request = (
                '{base}{request}'
                + (( schemeContainsQuery ) ? '&' : '?' ) 
                + 'access_token={token}&callback={cb}'
            ).supplant( args );
            
            // e.g. https://api.instagram.com/v1/users/11025817?access_token=<token>&callback=Lightbox.Header.render
            return request;
        };
        
        // Our main application (window.Lightbox) provides a hook for
        // receiving data, which is invoked when we load a response.
        $$.constructCallback = function( fnName ) {
            var $$ = this;
            fnName = fnName || 'ingest';
            return ( $$.callbackPrefix + fnName );
        };
        
        // Get a local API fixture (development usage only)
        $$.getFixture = function( url, cb ) {
            
            return new Promise( function( resolve, reject) {

                var req = new XMLHttpRequest(),
                    cb = cb || emptyFunc;
                
                req.open( 'get', url, true );
                
                req.onreadystatechange = function() {
                    if ( req.readyState === 4 ) {
                        if (req.status === 200) resolve( JSON.parse(req.responseText) );
                        else reject('Request failed');
                    }
                };
                
                req.send();
            });
        };
        
        // ----------------------------------------------------- //
        // Now that we've got the meat + potatoes,
        // let's create some interfaces that do something useful.
        // ----------------------------------------------------- //
        
        // Fetch an Instagram user's feed based on ID
        $$.getUserFeed = function( id, callback ) {
            var scheme = "/users/{user_id}/media/recent";
            return $$.get({ scheme: scheme, user_id: id, cb: callback });
        };
        
        // Fetch an Instagram user's metadata (profile info) based on ID
        $$.getUserInfo = function( id, callback ) {
            var scheme = "/users/{user_id}";
            return $$.get({ scheme: scheme, user_id: id, cb: callback });
        };
        
        // Get results for a search query
        $$.getSearchResults = function( q, callback ) {
            var scheme = "/users/search/?q={query}";
            return $$.get({ scheme: scheme, query: q, cb: callback });
        };
        
        // Retrieves the current API access_token
        $$.getToken = function() {
            
            var $$ = this;
            
            // Try to grab it from the URL (if we've just authorized the app)
            var hash = window.location.hash;
            
            if ( hash && hash !== '' ) {
                $$.setToken( hash );
            }
            
            // Otherwise try to grab it from localStorage
            if ( !hash || hash === '' ) {
                hash = localStorage.getItem('access_token');
                if ( hash === 'undefined' ) hash = null;
            }

            return hash;
        }
        
        // Store an access_token so we can re-use it (until it expires)
        $$.setToken = function( token ) {
            var $$ = this;
            
            if (!token) return;
            
            // If we're receiving a raw URL hash, discard the key
            if (/access_token=/i.test(token)) {
                token = token.split('=')[1];
            }
            
            // Persist the token between page loads
            localStorage.setItem( 'access_token', token );
            
            $$.token = token;
            
            return ( $$.token = token || null );
        };
        
        return $$;
    };
    
    return( API );
});