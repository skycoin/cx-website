'use strict'

// Pook Framework > copyright Adam Kircher > adam.kircher@gmail.com
// ----------------------------------------------------------------

var stack = []
  , log   = require('./logger')

module.exports = function($injector)
{
	//We make a middleware stack using angular style interceptors
	var chain = [$injector.get('$rpc'), undefined]
	  , $q    = $injector.get('$q')

	//Like angular interceptors, each middleware can add a
	//request, requestError, response, and/or responseError
	for (var i in stack)
	{
		stack[i] = $injector['string' == typeof stack[i] ? 'get' : 'invoke'](stack[i])

		if (stack[i].request || stack[i].requestError)
		{
		  chain.unshift(stack[i].request, stack[i].requestError);
		}

		if (stack[i].response || stack[i].responseError)
		{
		  chain.push(stack[i].response, stack[i].responseError);
		}
	}

	return function(req, res)
	{
		var q = $q.defer()

		var promise = q.promise

		//Promises can only resolve once so create a new promise chain for each request
		for (var i = 0; i < chain.length; i = i+2)
		{
		  promise = promise.then(chain[i], chain[i+1]);
		}

		function end(http)
		{
			try
			{
				if ('object' == typeof http.data && ! Buffer.isBuffer(http.data))
				{
					http.headers = http.headers || {}

					http.headers["Content-Type"] = "application/json"

					http.data = JSON.stringify(http.data)
				}

				res.writeHead(http.status || 200, http.headers)

				res.end(http.data)
			}
			catch (e)
			{
				return $q.reject(e)
			}
		}

		//End the middleware stack with response to browser or a console error
		promise.then(end, end).catch(log.red)

		//Send the req (or config in angular lingo) on its way down the chain
		q.resolve(req)
	}
}

//Create method to be put on module api by extend.js that allows us to make a middleware stack.
module.exports.server = stack.push.bind(stack)