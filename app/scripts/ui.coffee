
class IterableCollection extends Backbone.Collection
    initialize: () ->
        @index = 0
        
    goTo: (index) ->
        return if index is @index
        return if index < 0
        return if index >= @length
        @index = index
        log @index
        @trigger 'goto'
        
    current: -> @at(@index)
    previous: -> @goTo(@index - 1)
    next: -> @goTo(@index + 1)
    isFirst: -> @index == 0
    isLast: -> @index == @length - 1
    
    
class Photo extends Backbone.Model
    
    
class Photos extends IterableCollection
    model: Photo
 
class HeaderView extends Backbone.View
    el: '.set_meta'
    constructor: (set) ->
        @tmpl = _.template $('#gallery-header').html()
        $(@el).html @tmpl({ set: set })
    render: ->
        # log @set
        
class Lightbox extends Backbone.View
    events:
        'click #closeLightbox': 'destroy'
        'click #nextPhoto': 'nextPhoto'
        'click #prevPhoto': 'prevPhoto'

    initialize: ->
        @listenTo(@collection, 'goto', @change)
        @.setElement $('.lightbox')
        @box  = $(@el)
        @tmpl = _.template $('#lightbox-photo').html()
        
    render: ->
        photo = @collection.current()
        @box.removeClass 'hidden'
        @box.html @tmpl({ photo: photo.attributes })
        @bindListeners()
        
    change: ->
        log 'lightbox: responding to \'goto\' event'
        @$el.empty()
        @render()
        
    destroy: -> 
        log 'destroying lightbox'
        @box.addClass 'hidden'
        @unbindListeners()
        # @render()
    
    prevPhoto: -> @collection.previous()
        
    nextPhoto: -> @collection.next()
    
    isPressing: false
    
    keydownHandler: (e) =>
        return if @isPressing is true
        @isPressing = true
        unsetPressing = => @isPressing = false
        setTimeout unsetPressing, 250
        # log 'keypress', e.which
        switch e.which
            when 27 then @destroy()
            when 37 then @prevPhoto()
            when 39 then @nextPhoto()
                
    bindListeners:   -> $(document).on  'keydown.lightbox', @keydownHandler
    unbindListeners: -> $(document).off 'keydown.lightbox'

class Gallery extends Backbone.View
    el: '#gallery'
    
    events:
        'click .thumb': 'click'
    
    initialize: ->
        # @listenTo(@collection, 'goto', @change)
        @thumbnailTemplate = _.template $('#photo-thumbnail').html()
    
    render: ->
        imgs = []
        $.each @collection.models, (index, photo) =>
            imgs.push @thumbnailTemplate({ photo: photo.attributes })
        @$el.append(imgs)
        # @$el.find('.thumbs').append(imgs)
        # @change()
        @
        
    click: (e) ->
        clickedIndex = $(e.currentTarget).closest('.thumb').find('img').data('index')
        @collection.goTo(clickedIndex)
        @parent.viewInLightbox(clickedIndex)
        
    change: ->
        # active_index = @collection.index
        # @$el.children().each( (index) ->
        #     thumbnail = $(@)
        #     thumbnail.toggleClass(
        #         'active', 
        #         thumbnail.data('index') == active_index
        #     )
        # )

class AppView extends Backbone.View
    el: '#container'
    
    initialize: (set) ->
        @photos = new Photos( set.photo )
        @header   = new HeaderView(set)
        @lightbox = new Lightbox({ collection: @photos })
        @gallery  = new Gallery({ collection: @photos })
        @$el.find('.loader').fadeOut()
        @lightbox.parent = @
        @gallery.parent  = @
        # @render()

    render: ->
        @header.render()
        @gallery.render()
        
    viewInLightbox: (photo) ->
        @lightbox.render(photo)




class Renderer
    initializeSet: (set) => 
        _.each set.photo, (p,i) -> p.index = i
        @app = new AppView(set).render()