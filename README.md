# Slackbox

Simple web-based gallery for viewing an Instagram user's feed. Uses rudimentary DOM manipulation, data binding, and XHR libraries - all written by yours truly. No 3rd-pary libraries are included (other than RequireJS).

[View live demo.](http://dev.drryl.com/slackbox)

###Running
This repo ships with a fully-built version of itself in the `/local` directory. To re-compile from source, you'll need:

- Node (with NPM)
- Bower: `npm install -g bower`

Checkout the repo, and do:

	npm install
	bower install
	grunt

If all goes well, the app will be running on: `http://localhost:8797`

--------------------------

###Notes

I initially built this using jQuery, Underscore, Backbone + Rivets, but then challenged myself to write my own libs. You can find the original version in the [backbone](https://github.com/derryl/Slackbox/tree/backbone) branch.

The aforementioned third-party libraries are, of course, far more stable and powerful than the code I wrote to replace them. While my versions leave much to be desired... they do indeed function as expected!

Here's a brief summary of the different "libraries" I created to support this app:

- **binding.js** - A simple DOM-binding utility (for injecting data into HTML).

- **listeners.js** - Binds event listeners to a view, using a Backbone-ish syntax for declaring events.

- **Views.js** - A simple View class (again similar to Backbone) which is extended by various sub-views in my app. (Note: my version is terrible and doesn't even support proper inheritance. I'll probably fix this sometime.)

- **utilities.js** - A bunch of other utility functions I wrote to make my life easier. These are kinda messy and should be organized better - but they get the job done.

---------------------------


