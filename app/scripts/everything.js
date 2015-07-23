// var emptyFunc = function(data) { return; };
// var log = console.log.bind(console);
// String.prototype.supplant = function (o) { return this.replace(/{([^{}]*)}/g, function (a, b) {var r = o[b]; return typeof r === 'string' || typeof r === 'number' ? r : a; } ); };
// String.prototype.s = function (o) { return this.replace(/{([^{}]*)}/g, function (a, b) {var r = o[b]; return typeof r === 'string' || typeof r === 'number' ? r : a; } ); };

// var config = {};
//     config.USE_FIXTURES = true;

// var authBox = document.querySelector('.auth-box');

// var toggleAuthBox = function() {
//     var curClass = authBox.getAttribute('class');
//     if (!/hidden/i.test(authBox.getAttribute('class'))) {
//         authBox.setAttribute('class','auth-box hidden');
//     } else {
//         authBox.setAttribute('class','auth-box');
//     }
// };

// var ensureIsNode = function(item) {
//     return (item instanceof Node) ? item : document.querySelector( item );
// }

// var Lightbox = function() {
    
//     var $$ = this;
    
//     $$.currentIndex = 0;
//     var btns = {};
    
//     var listeners = [
//         [ document.body, 'click', clickToClose ],
//         [ document.body, 'keyup', keyHandler   ],
//         [ '#nextPhoto',  'click', $$.nextPhoto ],
//         [ '#prevPhoto',  'click', $$.prevPhoto ]
//     ];
    
//     $$.init = function( photos ) {
//         $$.el = document.querySelector('#lightbox');
//         $$.photos = photos || null;
        
//         btns.next  = $$.el.querySelector('#nextPhoto');
//         btns.prev  = $$.el.querySelector('#prevPhoto');
//         btns.close = $$.el.querySelector('#closeBtn');
        
        
        
//         return $$;
//     };
    
//     $$.updatePhotos = function( photos ) {
//         $$.lastPhoto  = photos.length;
//         $$.firstPhoto = 0;
//         return ( $$.photos = photos || $$.photos || null );
//     }
    
//     $$.show = function( index ) {
        
//         if (typeof index !== 'number') return;
//         if (index > $$.lastPhoto) return;
//         if (index < 0) return;
        
//         $$.currentIndex = index;
        
//         var photo = $$.photos.filter( function(pic) {
//             return pic.index === index;
//         })[0];

//         setTimeout( bindListeners, 5);
//         bindData( $$.el, photo );
//         $$.el.setAttribute('class','');
//         return $$;
//     };
    
//     $$.nextPhoto = function() {
//         if ($$.currentIndex < $$.lastPhoto) {
//             $$.currentIndex++;
//             $$.show( $$.currentIndex );
//         } return;
//     }
    
//     $$.prevPhoto = function() {
//         if ($$.currentIndex > 0) {
//             $$.currentIndex--;
//             $$.show( $$.currentIndex );
//         } return;
//     }
    
//     var clickToClose = function( e ) {
//         if (e.target.isChildOf('.viewer')) return;
//         $$.hide();
//     };
    
//     // 27 = esc, 37 = < , 39 = >
//     var keyHandler = function( e ) {
//         switch (e.which) {
//             case 27: return $$.hide();
//             case 37: return $$.prevPhoto();
//             case 39: return $$.nextPhoto();
//         }
//     };
    
//     var bindListeners = function() {
//         listeners.forEach( function(l) {
//             var target = ensureIsNode(l[0]),
//                 eventType = l[1],
//                 eventHandler = l[2];
//             try { target.addEventListener( eventType, eventHandler ) }
//             catch(e) { console.error(e) }
//         });
//     };
    
//     var unbindListeners = function() {
//         listeners.forEach( function(l) {
//             var target = ensureIsNode(l[0]),
//                 eventType = l[1],
//                 eventHandler = l[2];
//             try { target.removeEventListener( eventType, eventHandler ) }
//             catch(e) { console.error(e) }
//         });
//     };
    
//     $$.hide = function() {
//         unbindListeners();
//         $$.el.setAttribute('class','hidden');
//     };
    
//     return $$.init();
// };

// var Renderer = function() {
    
//     var $$ = this;
    
//     $$.init = function( rootEl ) {
//         $$.el = document.querySelector( rootEl );
//         $$.lightbox = new Lightbox();
//         return $$;
//     };

//     $$.render = function( data ) {
//         // log('----------------')
//         if (data.data) {
            
//             log(data);
            
//             if (data.data instanceof Array) {
//                 $$.renderPhotos( data );
//                 // $$.lightbox = new Lightbox( $$.photos );
//                 // log($$.lightbox.show)
//                 $$.lightbox.show($$.photos[0]);
//             } else {
//                 $$.renderUser( data );
//             }
//             // log(data.data);
            
//             // log(data)
//             return;
//         }
//     };
    
//     $$.renderPhotos = function( data ) {
//         $$.photos = data.data;
//         var i = -1;
//         $$.photos.forEach( function( photo ) {
//             photo.index = ++i;
//             $$.renderThumbnail( photo );
//         });
//         $$.lightbox.updatePhotos( $$.photos );
//         return $$.photos;
//     };
    
//     $$.renderThumbnail = function( pic ) {
        
//         // Prepare text for display on page:
//         // - replace hashtags with links
//         // - replace unicode emojis with inline <img>'s
//         function prepareCaption( text ) {
//             text = text || '';
//             text = text.replace(/\s\s*$/gm, "");
//             var hashTags = text.match(/(\S*#\[[^\]]+\])|(\S*#\S+)/gi);
//             if (hashTags instanceof Array) hashTags.forEach( function(tag) {
//                 text = text.replace( tag, 
//                     "<a target='_blank' href='https://instagram.com/explore/tags/{tagName}'>{tag}</a>"
//                     .supplant({ tagName: tag.slice(1), tag: tag })
//                 );
//             });
//             return emoji.replace_unified(text);
//         }
        
//         var thumbEl   = document.createElement('span'),
//             thumbSrc  = pic.images.low_resolution.url,
//             caption   = (deep(pic,'caption.text') ? prepareCaption(pic.caption.text) : ''),
//             thumbHTML = 
//                 ("<div class='thumb-img'>"+
//                     "<img src='{url}' />"+
//                     "<div class='metadata'>"+
//                         "<span class='meta-icon likecount'><span class='icon icon-like'></span> {numLikes}</span>"+
//                         "<span class='meta-icon commentcount'><span class='icon icon-comment'></span> {numComments}</span>"+
//                     "</div>"+
//                 "</div>"+
//                 "<span class='thumb-caption'>{caption}</span>")
//                 .supplant({ 
//                     url: thumbSrc,
//                     caption: caption,
//                     numLikes: (pic.likes.count),
//                     numComments: (pic.comments.count)
//                 });
        
//         thumbEl.setAttribute('class','thumb');
//         thumbEl.addEventListener('click', function(s,e,a) {
//             $$.lightbox.show(pic.index);
//         });
//         thumbEl.innerHTML = thumbHTML;
//         $$.el.appendChild(thumbEl);
//     };
    
//     $$.renderUser = function( data ) {
//         $$.user = data;
//         window.user = $$.user;
//         // bindData( 'body', $$.user );
//         // log($$.user)  
//     };
    
//     // $$.showLightBox = function( photo ) {
//     //     // history.pushState({ photo: photo }, 'View photo', '/view/'+photo.id);
//     //     $$.lightbox.setAttribute('class','');
//     //     bindData( $$.lightbox, photo );
//     //     // $$.lightbox.querySelector('.lb-photo').setAttribute('src',)
//     // };
    
//     $$.hideLightBox = function() {
//         return $$.lightbox.setAttribute('class','hidden');
//     };
    
//     $$.showAuthBox = function() {
//         return $('.auth-box').removeClass('hidden');
//     };
    
//     return $$;
// };

// var API = function() {
    
//     var $$ = this;

//     this.get = function( args ) {
//         var that = this;
        
//         if (!args) return;
//         if (!args.scheme) return;
//         if (!args.cb) args.cb = "responseHandler";
        
//         var url = that.constructURL( args );
//         // log('making request to', url);
        
//         var scriptTag = document.createElement('script');
//             scriptTag.setAttribute( "src", url );
//         document.getElementsByTagName("head")[0].appendChild( scriptTag );
//     };
    
//     this.getFixture = function( url, cb ) {
//         var req = new XMLHttpRequest();
//         // req.onload = reqListener;
//         req.open("get", url, true);
//         req.onreadystatechange = function( data, x ) {
//             if (req.readyState == 4 && req.status == 200) {
//                 if (cb && typeof cb === 'function') {
//                     cb(JSON.parse(req.responseText));
//                 }
//             }
//         };
//         req.send();
//         return req;
//     };
    
//     // api.get({ user_id: user_id, access_token: access_token });
//     this.getUserFeed = function( id ) {
//         var scheme = "/users/{user_id}/media/recent";
//         return $$.get({ scheme: scheme, user_id: id });
//     };
    
//     this.getUserInfo = function( id ) {
//         var scheme = "/users/{user_id}";
//         return $$.get({ scheme: scheme, user_id: id });
//     };
    
//     this.constructURL = function( args ) {
    
//         var args = arguments[0];
        
//         if (!args) args = {};
//         if (!args.scheme) return;
//         if (!args.cb) args.cb = "ui.render";

//         args.base = "https://api.instagram.com/v1";
//         args.token = $$.token;
//         args.request = args.scheme.supplant(args);
//         // log(request)
//         var url = "{base}{request}?access_token={token}&callback={cb}".supplant(args);
        
//         return url;
//     };
    
//     this.getToken = function() {
//         var hash = window.location.hash;
//         if (!hash || hash === '') {
//             hash = localStorage.getItem('access_token');
//             if (hash === 'undefined') hash = null;
//         }
        
//         if (!hash) {
//             $$.ui.showAuthBox();
//         }
//         return hash;
//     }
    
//     this.setToken = function( token ) {
//         if (!token) $$.ui.showAuthBox();
//         localStorage.setItem( 'access_token', token );
//         return ( $$.token = token || null );
//     };
    
//     this.init = function( ui ) {
//         $$.ui = ui;
//         return $$;
//     }
    
//     return this;
// };


// checkForToken = function() {
//     var hash = window.location.hash;
//     if (!hash || hash === '') {
//         hash = localStorage.getItem('access_token');
//     }
//     return hash;
// }

// var bindData = function( parent, data ) {
        
//     var el = (parent instanceof Node) ? parent : document.querySelector( parent );
//     if (!el) return;

//     var els = el.querySelectorAll('*');
    
//     var bindingMap = {
//         'data-text': 'innerHTML',
//         'data-src': 'src'
//     }, bindingMapString = "";
    
//     // Check if an element has attributes
//     function getAttrs( el ) {
//         if (!el || !el.attributes) return;
//         var attrs = el.attributes;
//         var attributeMap = '';
//         if (attrs.length > 0) {
//             attributeMap = [].map.call( attrs, function( attr ) {
//                 return attr.name
//             }).join('|');
//         }
//         return attributeMap;
//     };
    
//     function applyBinding( el, bindType ) {
//         if (!bindType || !bindingMap[bindType]) return;
//         var b = el.getAttribute( bindType );
//         if (b && deep(data, b)) {
//             el[bindingMap[bindType]] = deep(data, b);
//         }
//     };
    
//     // Iterate over child nodes, and attempt to insert data
//     // according to their bindings (e.g. 'data-text' -> replaces innerHTML)
//     [].forEach.call( els, function(el) {
//         if (/data-/i.test(getAttrs( el ))) {
//             Object.keys( bindingMap ).forEach( function( binding ) {
//                 applyBinding( el, binding );
//             });
//         }
//     });
        
// };

// function init( cb ) {

//     var access_token = null,
//         user_id = "11025817",
//         hash, api, ui;
    
//     emoji.img_path = "/images/emoji/";
//     for (var set in emoji.img_sets) {
//         emoji.img_sets[set].path = "/images/emoji/";
//     };
    
//     ui  = new Renderer().init('#gallery');
//         window.ui = ui;
//         window.responseHandler = ui.render;
    
//     api  = new API().init(ui);
    
//     if (config.USE_FIXTURES === true) {
//         api.getFixture( '/fixtures/drryl-feed.json', ui.renderPhotos );
//         api.getFixture( '/fixtures/drryl-user.json', ui.renderUser );
//     }
//     // Hash indicates we just returned from Instagram, and have an access_token
//     else {
        
//         hash = api.getToken(ui);
        
//         if (hash && hash !== "" && hash.indexOf('access_token')) {
            
//             access_token = location.hash.split('=')[1];
            
//             history.pushState({}, 'Lightboxr', '/');
            
//             api.setToken( access_token );
//             api.getUserInfo("11025817");
//             api.getUserFeed("11025817");
//             // api.get({ user_id: user_id, access_token: access_token });
//         }
    
//         // No access_token present. We must ask the user to authenticate
//         // before we can grab any data from Instagram. 
//         //      https://instagram.com/developer/authentication/
//         else {
            
//             $('.auth-box').removeClass('hidden');
//         }
//     }
// };

// window.onload = function() {
    
//     init();
//     // setTimeout( init, 2000000 );
//     // setInterval()
//     // var classes = 'one two three';
//     // window.g = $('#gallery').addClass( classes );
//     // g.hasClass('two');
// }