'use strict'

// Pook Framework > copyright Adam Kircher > adam.kircher@gmail.com
// ----------------------------------------------------------------

var chain =
{
	client:[],
	server:[]
}

//Getter/Setter
function factory(key)
{
	return function(fn, type, name)
	{
		//Set (Add function to transform chain)
		if ( ! type)
		{
			chain[key].push(fn)

			return this
		}

		//Get - (Transform the function)
		for (var i in chain[key])
		{
			if (fn)
			{
				fn = chain[key][i].call(this, fn, type, name)
			}
		}

		return fn
	}
}

module.exports = transform

transform.server = factory('server')

transform.client = factory('client')

function transform(annotate)
{
	return {
		inline: inline,

		whitespace: function(fn, type, name)
		{
			var tabs = fn.match(/(\t*)\{/)[1]

			tabs = RegExp('^'+tabs, 'gm')

			fn = fn.replace(tabs, '')			//Remove all extra tabs from the function

			return fn.replace(/\t/g, '   ')	//Replace all tabs with 3 spaces
		},

		//TODO should we make the client interceptor register on the server as an interceptor (not a middleware)
		//because we want parallel functionality between client and server so it would be weird to register the
		//client function to intercept http requests and not have $http on the server intercepted at all !?!?!?!?!?
		interceptor: function(fn, type, name)
		{
			if ('interceptor' != type)
			{
				return fn
			}

			return Function('$httpProvider', '$httpProvider.interceptors.push('+inline(fn)+')')
		},

		//If function e.g., factory has 'require()' then create it on the server & create
		//a service api on the client.  If not, then create it both on the server and on the client
		//TODO should I replace this with a list of core node modules + a list of folders in node_modules/ and then add these with a factory function
		//if one of these is detected as a dependency then put factory on the server, otherwise put it on the client???
		rpc: function(fn, type, name)
		{
			if ('factory' != type)
			{
				return fn
			}

			var self = this

			function match(fn)
			{
				var match = fn.name || 'anonymous'

				match = RegExp('return (this|'+match+')([.\\w]*)')

				return fn.toString().match(match)
			}

			self.run.server(function($injector)
			{
				var rpc  = $injector.get(name)
				  , fns  = []
				  , $rpc = []
				  , i    = 0

				// if its a chainable function then just save the method and arguments
				// otherwise its a trigger so send all methods and arguments to http
				function cli(fn)
				{
					return JSON.stringify(fn, function(key, val)
					{
						if ('function' != typeof val)
						{
							return val
						}

						var props = {}
						  , chain = val
						  , scope = {}

						if  ( ! ~ key.indexOf('.'))
						{
							key   = 'fn'+fns.length
						}

						//JSON doesn't stringify properties on functions
						//we do it manually by moving them to a new {}
						for (var i in val)
						{
							props[key+'.'+i] = val[i]
						}

						//Undo previous change to get correct this
						for (var j in this)
						{
							scope[j.split('.').pop()] = this[j]
						}

						while((chain = match(chain)) && chain[2])
						{
							chain = scope[chain[2].slice(1)]
						}

						chain = chain ? 'chain' : 'trigger'

						fns.push(key+" = $rpc('"+name+"', '"+fns.length+"', '"+chain+"')")

						$rpc.push(val.bind(scope))

						//true if props has properties
						i && cli(props)

						return '!function'

					}, '   ')
				}

				rpc.$rpc = $rpc

				fns.push('var cli = '+cli(rpc), 'return cli.bind ? cli.bind(cli) : cli')

				//add functions back in afterwards so stringify doesn't encode \n, \t or \"
				fns = fns.join('\n').replace(/"!function"/g, function() { return "fn"+i++ })

				if ( ! isClient(fn))
				{
					self.factory.client(name, Function('$rpc', fns))
				}
			})

			if (isClient(fn))
			{
				return fn
			}
		},

		template: function(fn, type, name)
		{
			var client =  fn.toString()

			if ( ! /\$routeProvider\s*.\s*when\(/.test(client))
			{
				return fn
			}

			var self = this

			self.run.server(function($route)
			{
				var server = $route.routes

				for (var i in server)
				{
					if (server[i].template)
					{
						i = JSON.stringify(server[i].template.toString())

						client = client.replace(/template\s*:.+([,}])/, 'template~'+i+'$1')
					}
				}

				self.config.client(client.replace(/template~/g, 'template:'))
			})

			return false
		},

		assertClient: function(fn)
		{
			if ( ! isClient(fn))
			{
				console.error("Cannot use node's require, __dirname, and __filename in a client function\n\t"+fn)
			}

			return fn
		},

		assertServer: function(fn)
		{
			if(/\$location\W|\$browser\W|\$window\W/.test(fn))
			{
				console.error("Cannot inject $location, $browser, or $window into a server function\n\t"+fn)
			}

			return fn
		}
	}

	//Common Helper functions
	function isClient(fn)
	{
		return ! /\brequire\(|__dirname|__filename|global\./i.test(fn)
	}

	function inline(fn, type, name)
	{
		return fn.length ? JSON.stringify(annotate(fn)).replace(']', ','+fn+']') : fn
	}
}
