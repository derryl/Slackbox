//
//  - DataBinder -
//
//  A naive and brittle (yet effective) DOM binding utility. 
//  Accepts a parent element, some data, and attempts
//  to bind the provided data to that parent's child nodes.

define( [], function() {
        
        function DataBinder( parent, data ) {
        
            var el = (parent instanceof Node) ? parent : document.querySelector( parent );
            
            if (!el) return;

            var els = el.querySelectorAll('*');
            
            var bindingMap = {
                'data-text':  'innerHTML',
                'data-html':  'innerHTML',
                'data-bind':  'innerHTML',
                'data-src':   'src',
                'data-href':  'href',
                'data-value': 'value'
            };
            
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
            
            // Attempt to insert data, if the requested item exists
            function applyBinding( el, bindType ) {
                if (!bindType || !bindingMap[bindType]) return; // reject unidentified bindings   (e.g. data-foobar )
                var b = el.getAttribute( bindType );            // determine the requested datum  (e.g. data-href=">> profile_url <<" )
                if (b && deep(data, b)) {                       // attempt to retrieve that datum (e.g. >> data["profile_url"] <<)
                    el[bindingMap[bindType]] = deep(data, b);   // if so, apply it to the element !
                }
            };
            
            // Iterate over child nodes, and attempt to insert data
            // according to their bindings (e.g. 'data-text' -> replaces innerHTML)
            [].forEach.call( els, function(el) {
                
                // If current element has no data-* attributes, skip it
                if (/data-/i.test(getAttrs( el ))) {
                    
                    // Otherwise, iterate over our defined bindings and apply the data
                    Object.keys( bindingMap ).forEach( function( binding ) {
                        applyBinding( el, binding );
                    });
                }
            });
            
            return data;
        };
        
        return( DataBinder );
    }
);