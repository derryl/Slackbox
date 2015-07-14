
# $ ->
window.onload = ->
    
    api = new API()
    
    renderer = new Renderer()
    
    api.getSet( '72157626579923453', renderer.initializeSet )