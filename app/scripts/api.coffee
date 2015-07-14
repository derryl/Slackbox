class API

    baseURL: 'https://api.flickr.com/services/rest/'
    key: 'c93bb72bd1dfef33bf58813958c851ab'
    
    constructor: ->
        @imgs = []
        @set  = null
    
    # Generalized function for making Flickr API requests
    get: ( args, cb = emptyFunc ) ->
        $.ajax {
            dataType: 'json'
            url: @constructURL( args )
            success: cb
        }
    
    # Constructs a request using the provided parameters
    constructURL: ( args ) ->
        if not args or args.length < 1 then return ''
        args.api_key = @key
        args.format  = 'json'
        args.nojsoncallback = true
        query = []
        _.each args, ( val, key ) -> query.push "#{key}=#{val}"
        return @baseURL + '?' + query.join( '&' )
      
        
    # Get a Flickr photoset by ID
    getSet: ( id, cb = emptyFunc ) =>

        parseSet = ( data ) =>
            @set = data.photoset
            photos = @set.photo
            $.when.apply($, _.map photos, (p) => @getPhoto( p )).done () =>
                log 'All requests finished!'
                @set.href = "https://www.flickr.com/photos/#{@set.ownername.replace(/\s+/g, '')}/sets/#{@set.id}/"
                cb @set
            
        args = { method: 'flickr.photosets.getPhotos', photoset_id: id }
            
        @get args, parseSet
    
    
    # Fetch the URL's for a photo at our desired sizes
    getPhoto: ( photo, cb = emptyFunc ) =>
        
        parsePhoto = (p) =>
            photo.thumbnail = ( _.filter p.sizes.size, (s) -> s.label is 'Large Square' )[0]
            photo.fullsize  = ( _.filter p.sizes.size, (s) -> s.label is 'Large' )[0]
            @imgs.push photo
            
        args = { method: 'flickr.photos.getSizes', photo_id: photo.id }
            
        @get args, parsePhoto