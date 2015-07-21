define( [], function() {
        
        function DataBinder( parent, data ) {
        
            var el = (parent instanceof Node) ? parent : document.querySelector( parent );
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
                if (b && deep(data, b)) {
                    el[bindingMap[bindType]] = deep(data, b);
                }
            };
            
            // Iterate over child nodes, and attempt to insert data
            // according to their bindings (e.g. 'data-text' -> replaces innerHTML)
            [].forEach.call( els, function(el) {
                // console.log(el)
                if (/data-/i.test(getAttrs( el ))) {
                    // console.log('binding to',el);
                    Object.keys( bindingMap ).forEach( function( binding ) {
                        applyBinding( el, binding );
                    });
                }
            });
            
            return data;
              
        };
        
        return DataBinder;
    }
);