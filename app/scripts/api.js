define( function() {

    var API = function() {
        
        var $$ = this;

        this.get = function( args ) {
            var that = this;
            
            if (!args) return;
            if (!args.scheme) return;
            if (!args.cb) args.cb = "responseHandler";
            
            var url = that.constructURL( args );
            // log('making request to', url);
            
            var scriptTag = document.createElement('script');
                scriptTag.setAttribute( "src", url );
            document.getElementsByTagName("head")[0].appendChild( scriptTag );
        };
        
        this.getFixture = function( url, cb ) {
            var req = new XMLHttpRequest();
            // req.onload = reqListener;
            req.open("get", url, true);
            req.onreadystatechange = function( data, x ) {
                if (req.readyState == 4 && req.status == 200) {
                    if (cb && typeof cb === 'function') {
                        cb(JSON.parse(req.responseText));
                    }
                }
            };
            req.send();
            return req;
        };
        
        // api.get({ user_id: user_id, access_token: access_token });
        this.getUserFeed = function( id ) {
            var scheme = "/users/{user_id}/media/recent";
            return $$.get({ scheme: scheme, user_id: id });
        };
        
        this.getUserInfo = function( id ) {
            var scheme = "/users/{user_id}";
            return $$.get({ scheme: scheme, user_id: id });
        };
        
        this.constructURL = function( args ) {
        
            var args = arguments[0];
            
            if (!args) args = {};
            if (!args.scheme) return;
            if (!args.cb) args.cb = "ui.render";

            args.base = "https://api.instagram.com/v1";
            args.token = $$.token;
            args.request = args.scheme.supplant(args);
            // log(request)
            var url = "{base}{request}?access_token={token}&callback={cb}".supplant(args);
            
            return url;
        };
        
        this.getToken = function() {
            var hash = window.location.hash;
            if (!hash || hash === '') {
                hash = localStorage.getItem('access_token');
                if (hash === 'undefined') hash = null;
            }
            
            if (!hash) {
                $$.ui.showAuthBox();
            }
            return hash;
        }
        
        this.setToken = function( token ) {
            if (!token) $$.ui.showAuthBox();
            localStorage.setItem( 'access_token', token );
            return ( $$.token = token || null );
        };
        
        this.init = function( ui ) {
            $$.ui = ui;
            return $$;
        }
        
        return this;
    };
    
    return API;
    
});