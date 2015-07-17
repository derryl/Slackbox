var emptyFunc = function(data) { return; };
var log = console.log.bind(console);
String.prototype.supplant = function (o) { return this.replace(/{([^{}]*)}/g, function (a, b) {var r = o[b]; return typeof r === 'string' || typeof r === 'number' ? r : a; } ); };
String.prototype.s = function (o) { return this.replace(/{([^{}]*)}/g, function (a, b) {var r = o[b]; return typeof r === 'string' || typeof r === 'number' ? r : a; } ); };

var config = {};
    config.USE_FIXTURES = true;

var authBox = document.querySelector('.auth-box');
var toggleAuthBox = function() {
    var curClass = authBox.getAttribute('class');
    if (!/hidden/i.test(authBox.getAttribute('class'))) {
        authBox.setAttribute('class','auth-box hidden');
    } else {
        authBox.setAttribute('class','auth-box');
    }
}

var Renderer = function() {
    
    var $$ = this;
    
    $$.init = function( rootEl ) {
        $$.el = document.querySelector( rootEl );
        emoji.img_path = '/images/emoji/';
        return $$;
    };

    $$.render = function( data ) {
        log('----------------')
        if (data.data) {
            
            log(data);
            
            if (data.data instanceof Array) {
                $$.renderPhotos( data );
            } else {
                $$.renderUser( data );
            }
            // log(data.data);
            
            // log(data)
            return;
        }
    };
    
    $$.renderPhotos = function( data ) {
        
        $$.photos = data.data;
        window.photos = $$.photos;
        
        var photoHTML = '';
        
        $$.photos.forEach( $$.renderThumbnail );
        
        return;
        
        
        $$.photos.forEach( function( pic ) {
            var thumbSrc = pic.images.low_resolution.url;
                caption  = deep(pic,'caption.text') ? prepareCaption(pic.caption.text) : '';
            
            var thumbHTML = 
                "<span class='thumb'><img src='{url}' /><span class='label'>{caption}</span></span>"
                .supplant({ url: thumbSrc, caption: caption });
            
            photoHTML += thumbHTML;
        });
        
        $$.el.innerHTML = photoHTML;
    };
    
    $$.renderThumbnail = function( pic ) {
        
        // Prepare text for display on page:
        // - replace hashtags with links
        // - replace unicode emojis with inline <img>'s
        function prepareCaption( text ) {
            text = text || '';
            text = text.replace(/\s\s*$/gm, "");
            var hashTags = text.match(/(\S*#\[[^\]]+\])|(\S*#\S+)/gi);
            if (hashTags instanceof Array) hashTags.forEach( function(tag) {
                text = text.replace( tag, 
                    "<a target='_blank' href='https://instagram.com/explore/tags/{tagName}'>{tag}</a>"
                    .supplant({ tagName: tag.slice(1), tag: tag })
                );
            });
            return emoji.replace_unified(text);
        }
        
        var thumbEl   = document.createElement('span'),
            thumbSrc  = pic.images.low_resolution.url,
            caption   = (deep(pic,'caption.text') ? prepareCaption(pic.caption.text) : ''),
            thumbHTML = 
                ("<div class='thumb-img'>"+
                    "<img src='{url}' />"+
                    "<div class='metadata'>"+
                        "<span class='meta-icon likecount'>{numLikes}</span>"+
                        "<span class='meta-icon commentcount'>{numComments}</span>"+
                    "</div>"+
                "</div>"+
                "<span class='thumb-caption'>{caption}</span>")
                .supplant({ 
                    url: thumbSrc,
                    caption: caption,
                    numLikes: (pic.likes.count),
                    numComments: (pic.comments.count)
                });
        
        thumbEl.setAttribute('class','thumb');
        thumbEl.addEventListener('click', function(s,e,a) {
            log(pic);
        });
        thumbEl.innerHTML = thumbHTML;
        $$.el.appendChild(thumbEl);
    };
    
    $$.renderUser = function( data ) {
        $$.user = data;
        window.user = $$.user;
        // log($$.user)  
    };
    
    $$.showLightBox = function() {
        
    };
    
    $$.showAuthBox = function() {
        $('.auth-box').removeClass('hidden');
    };
    
    return $$;
};

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

var constructURL = function(a) {
    
    var args = arguments[0];
    
    if (!args) args = {};
    if (!args.cb) args.cb = "responseHandler";

    args.base = "https://api.instagram.com/v1";
        
    var url = "{base}/users/{user_id}/media/recent/?access_token={access_token}&callback={cb}".supplant(args);
    
    return url;
};

var GET = function( args ) {
    if (!args) return;
    if (!args.cb) args.cb = "responseHandler";
    var url = constructURL( args );
    log('making request to', url);
    
    var scriptTag = document.createElement('script');
    scriptTag.setAttribute( "src", url );
    document.getElementsByTagName("head")[0].appendChild(scriptTag);
};

window.dumpLoad = function(data) {
    log(data);
};

window.dump = function(data) {
    // log(JSON.parse(data));
    // if (data.meta && data.meta.code === 200) {
    //     console.log("Success!");
    //     window.data = data;
    // }
    // document.write(data);
};

checkForToken = function() {
    var hash = window.location.hash;
    if (!hash || hash === '') {
        hash = localStorage.getItem('access_token');
    }
    return hash;
}


var bindData = function( parentSelector, data ) {
        
    var el = document.querySelector( parentSelector );
    if (!el) return;
    
    var els = el.querySelectorAll('*');
    
    var bindingMap = {
        'data-text': 'innerHTML',
        'data-src': 'src'
    }, bindingMapString = "";
    
    // Check if an element has attributes
    function getAttrs( el ) {
        if (!el || !el.attributes) return;
        var attrs = el.attributes;
        var attributeMap = '';
        if (attrs.length > 0) {
            attributeMap = [].map.call( attrs, function( attr ) {
                return attr.name
            }).join('|');
        }
        return attributeMap;
    };
    
    function applyBinding( el, bindType ) {
        if (!bindType || !bindingMap[bindType]) return;
        var b = el.getAttribute( bindType );
        if (b && data[b]) {
            el[bindingMap[bindType]] = data[b];
        }
    };
    
    // Iterate over child nodes, and attempt to insert data
    // according to their bindings (e.g. 'data-text' -> replaces innerHTML)
    [].forEach.call( els, function(el) {
        if (/data-/i.test(getAttrs( el ))) {
            Object.keys( bindingMap ).forEach( function( binding ) {
                applyBinding( el, binding );
            });
        }
    });
        
};

window.onload = function() {
    
    // emoji.text_mode = true;
    
    bindData( 'body', { username: 'drryl' });
    
    var access_token = null,
        user_id = "11025817",
        hash, api, ui;
    
    ui  = new Renderer().init('#gallery');
        window.ui = ui;
        window.responseHandler = ui.render;
    
    api = new API().init(ui);
    
    if (config.USE_FIXTURES === true) {
        api.getFixture( '/scripts/drryl-feed.json', ui.renderPhotos );
        api.getFixture( '/scripts/drryl-user.json', ui.renderUser );
        return;
    }
    
    hash = api.getToken(ui);
    
    // Hash indicates we just returned from Instagram, and have an access_token
    if (hash && hash !== "" && hash.indexOf('access_token')) {
        
        access_token = location.hash.split('=')[1];
        
        history.pushState({}, 'Lightboxr', '/');
        
        api.setToken( access_token );
        
        api.getUserInfo("11025817");
        api.getUserFeed("11025817");
        // api.get({ user_id: user_id, access_token: access_token });
    }
    
    
    // No access_token present. We must ask the user to authenticate
    // before we can grab any data from Instagram. 
    //      https://instagram.com/developer/authentication/
    else $('.auth-box').removeClass('hidden');
    
    // var hidden = true;
    // setInterval( toggleAuthBox , 3000);
    
    (function() {
        
        var els = document.querySelectorAll('*');
        [].forEach.call( els, function(el) {
            console.log(el)
        })
        
    })();
    
};