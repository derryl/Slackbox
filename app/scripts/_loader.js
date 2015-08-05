// Full page loader
define(['$','binding','Views'], function( $, Bind, View ) {

    function PageLoader( el ) {
        
        var $$ = this;
        
        View.call( $$, el, {} );
        
        // $$.show = function() {
        $($$.element).removeClass('hidden');
        
        $$.loadingText = $$.element.querySelector('#loading-text');

        $$.startAnimation = function() {
            
            var step = 0;
            
            $$.animationInterval = window.setInterval( function() {
                if (step > 3) step = 0;
                // log('step')
                $$.loadingText.setAttribute('class', 'step'+step);
                step++;
            }, 350);
            
            return $$;
        }
        
        $$.startAnimation();
        
        return $$;
    }

    // PageLoader extends the base View class
    PageLoader.prototype = Object.create( View.prototype );
    
    return( PageLoader );
    
});