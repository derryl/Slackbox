require.config({
    paths: {
        util: 'utilities',
        lightboxr: 'app',
        $: 'dom'
        // emoji: 'emoji'
    },
    shim: {
        // 'dom': { exports: '$' },
        // 'emoji': { exports: 'emoji' }
    }
});

require(
    [
        'lightboxr',
        'utilities'
    ],
    function( Lightboxr ) { 
        
        return Lightboxr.initialize()
    
    }
);
