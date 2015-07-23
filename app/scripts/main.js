require.config({
    paths: {
        util: 'utilities',
        lightboxr: 'app',
        $: 'dom'
    }
});

require(
    [
        'lightboxr',
        'utilities'
    ],
    function( Lightboxr ) { 
        
        return Lightboxr.initialize();
    
    }
);
