class AppRouter extends Backbone.Router
    routes: {
        "posts/:id": "getPost",
        "*actions":  "defaultRoute"
    }

# Instantiate the router
router = new AppRouter

router.on 'route:getPost', ( id ) ->
    # Note the variable in the route definition being passed in here
    alert "Get post number #{id}"


router.on 'route:defaultRoute', ( actions ) ->
    # alert( actions )

# // Start Backbone history a necessary step for bookmarkable URL's
Backbone.history.start({ pushState: true, root: '/' })